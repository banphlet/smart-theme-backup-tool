'use strict'

import { required } from '../../../lib/utils'
import paginate from './paginate'
import errors from '../../../lib/errors'

const hasUniqueValidationError = message =>
  /e11000 duplicate key error collection/gi.test(message)

const create = Model => async ({ data = required('data'), populate }) => {
  try {
    const item = new Model(data)
    let doc = await item.save()
    if (populate) {
      doc = await doc.populate(populate).execPopulate()
    }

    return doc.toObject({ getters: true })
  } catch (error) {
    if (hasUniqueValidationError(error.message)) {
      throw errors.throwError({
        name: errors.ResourceAlreadyExistsError,
        message: `${Object.keys(error.keyPattern)[0]} already exists`
      })
    }
    throw error
  }
}

const findOne = Model => async ({
  query = required('query'),
  populate,
  select
}) => {
  const doc = Model.findOne(query, select)
  if (populate) {
    doc.populate(populate)
  }

  const item = await doc.exec()
  return item ? item.toObject({ getters: true }) : item
}

const updateOne = Model => async ({
  query = required('query'),
  update,
  populate,
  options = {}
}) => {
  const opts = Object.assign({}, { new: true, runValidators: true, upsert: true }, options)

  let doc = await Model.findOneAndUpdate(query, update, opts)
    .populate(populate)
    .exec()
  return doc?.toObject({ getters: true })
}

const upsert = Model => async ({ query, update, populate }) => {
  const doc = await findOne(Model)({ query })
  if (doc) return updateOne(Model)({ query, update, populate })
  return create(Model)({ data: update, populate })
}

const fetch = Model => async ({
  query = required('query'),
  populate,
  select
}) => {
  const doc = Model.find(query, select)

  return doc
    .batchSize(200)
    .populate(populate)
    .exec()
}

const count = Model => async (query = required('query')) => {
  const count = Model.countDocuments
    ? await Model.countDocuments(query).exec()
    : await Model.count(query).exec()

  return count
}

const deleteOne = Model => async ({ query = required('query') }) => {
  const doc = await Model.findOneAndDelete(query).exec()
  return doc?.toObject({ getters: true })
}

const deleteMany = Model => async ({ query = required('query') }) => {
  return Model.deleteMany(query).exec()
}

/**
 *
 * Create base model
 */
const BaseModel = Model => {
  return {
    /**
     * Get total items from a collection by query
     */
    count: (query = required('query')) => Model.count(query).exec(),
    /**
     * Create new item
     */
    create: create(Model),
    /**
     * Fetch batch items
     */
    fetch: fetch(Model),
    /**
     * Delete one
     */
    deleteOne: deleteOne(Model),
    /**
     * Delete many
     */
    deleteMany: deleteMany(Model),
    /**
     * Get one
     */
    get: findOne(Model),
    /**
     * Paginate resources
     */
    paginate: paginate(Model, count(Model)),
    upsert: upsert(Model),
    updateOne: updateOne(Model),
    ensureExists: async ({
      query = required('query'),
      populate,
      customErrorMessage,
      select
    }) => {
      const doc = await findOne(Model)({ query, populate, select })
      if (!doc) {
        throw errors.throwError({
          name: errors.ResourceDoesNotExistsError,
          message: customErrorMessage || 'resource does not exist'
        })
      }
      return doc
    }
  }
}

export default BaseModel

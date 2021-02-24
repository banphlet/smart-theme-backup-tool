'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'
import { compact } from 'lodash'
import moment from 'moment'

const Model = mongoose.models.Activity || mongoose.model('Activity', schema)
const ActivityModal = BaseModel(Model)

const customErrorMessage = 'customer does not exist'

/**
 * Update or create by email
 */
const create = (payload = required('payload')) =>
  ActivityModal.create({
    data: payload
  })

const getByEmail = (
  email = required('email'),
  errMessage = customErrorMessage
) =>
  ActivityModal.ensureExists({
    query: {
      email
    },
    customErrorMessage: errMessage
  })

const getById = (id = required('id')) =>
  ActivityModal.ensureExists({
    query: {
      _id: id
    },
    customErrorMessage
  })

const updateById = (id, update) =>
  ActivityModal.updateOne({
    query: {
      _id: id
    },
    update
  })

const fetchByShopId = shopId =>
  ActivityModal.fetch({
    query: {
      shop: shopId
    },
    select: '-access_token'
  })

const getBasedOnCriteria = ({ shopId = required('shopId'), field, value }) =>
  ActivityModal.get({
    query: {
      shop: shopId,
      [field]: value
    }
  })

const createOrUpdate = ({
  shopId = required('shopId'),
  ip,
  email,
  geo_location
}) =>
  ActivityModal.upsert({
    query: {
      shop: shopId,
      $or: compact([ip && { ip }, email && { email }])
    },
    update: {
      ip,
      shop: shopId,
      email,
      $inc: { attempts: 1 },
      geo_location
    }
  })

const paginateByShopId = ({ shopId, page, limit = 20, sort, isBlocked }) => {
  const aggregate = Model.aggregate([
    {
      $match: {
        shop: new mongoose.Types.ObjectId(shopId),
        ...(isBlocked && {
          is_blocked: isBlocked
        })
      }
    }
  ])
  const options = {
    limit,
    sort: sort ?? { _id: -1 },
    page
  }
  return Model.aggregatePaginate(aggregate, options).then(
    ({ docs, ...rest }) => {
      return {
        docs: docs.map(doc => {
          doc.id = doc._id
          return doc
        }),
        ...rest
      }
    }
  )
}

export default () => ({
  ...ActivityModal,
  createOrUpdate,
  create,
  getByEmail,
  getById,
  updateById,
  fetchByShopId,
  getBasedOnCriteria,
  paginateByShopId
})

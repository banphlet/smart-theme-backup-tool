'use strict'
import formWhereCriteria from './form-where-criteria'
import formSortCriteria from './form-sort-criteria'
import errors from './errors'

const DEFAULT_MAXIMUM_LIMIT = 200

/**
 * Performs a pagination query
 */
const paginate = (Model, count) => async ({
  query = {},
  search,
  sort,
  lean = true,
  after,
  limit = '10',
  populate = '',
  transform,
  maximumLimit = DEFAULT_MAXIMUM_LIMIT
} = {}) => {
  if (search) {
    query.$text = { $search: search }
  }

  let parsedLimit = parseInt(limit)

  parsedLimit = parsedLimit > maximumLimit ? maximumLimit : parsedLimit

  if (isNaN(parsedLimit)) throw errors.limitNaNError()

  const sortCriteria = formSortCriteria(sort)

  const whereCriteria = formWhereCriteria({
    after,
    sortCriteria
  })

  const tempModel = Model.find(query)
  if (whereCriteria) {
    tempModel.where(whereCriteria)
  }

  const [data, totalRecords] = await Promise.all([
    tempModel
      .limit(parsedLimit)
      .populate(populate)
      .sort(Array.from(sortCriteria))
      .exec(),
    count(query)
  ])

  return {
    data: data.map(item => item.toObject({ getters: true })),
    metadata: {
      count: totalRecords
    }
  }
}

export default paginate

'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'
import { compact } from 'lodash'
import moment from 'moment'

const Model = mongoose.models.Asset || mongoose.model('Asset', schema)
const AssetModal = BaseModel(Model)

const customErrorMessage = 'asset does not exist'

/**
 * Update or create by email
 */
const create = (payload = required('payload')) =>
  AssetModal.create({
    data: payload
  })

const getByEmail = (
  email = required('email'),
  errMessage = customErrorMessage
) =>
  AssetModal.ensureExists({
    query: {
      email
    },
    customErrorMessage: errMessage
  })

const getById = (id = required('id')) =>
  AssetModal.ensureExists({
    query: {
      _id: id
    },
    customErrorMessage
  })

const updateById = (id, update) =>
  AssetModal.updateOne({
    query: {
      _id: id
    },
    update
  })

const fetchByShopId = shopId =>
  AssetModal.fetch({
    query: {
      shop: shopId
    },
    select: '-access_token'
  })

const getBasedOnCriteria = ({ shopId = required('shopId'), field, value }) =>
  AssetModal.get({
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
  AssetModal.upsert({
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

const upsertBasedOn24HourPeriod = ({
  shopId,
  backupId,
  key,
  syncType,
  ...rest
}) =>
  AssetModal.upsert({
    query: {
      created_at: {
        $lte: moment()
          .endOf('day')
          .toDate(),
        $gte: moment()
          .startOf('day')
          .toDate()
      },
      shop: shopId,
      back_up_id: backupId,
      key,
      sync_type: syncType
    },
    update: {
      shop: shopId,
      back_up_id: backupId,
      key,
      sync_type: syncType,
      ...rest
    }
  })

export default () => ({
  ...AssetModal,
  createOrUpdate,
  create,
  getByEmail,
  getById,
  updateById,
  fetchByShopId,
  getBasedOnCriteria,
  upsertBasedOn24HourPeriod
})

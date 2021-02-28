'use strict'

import {
  activityModel,
  assetModel,
  backupModel,
  themes as themeModel
} from '../../../models'
import { ActivityTypes } from '../../../models/activities/schema'
import platforms from '../../platforms'
import { differenceBy } from 'lodash'
import moment from 'moment'
import pino from 'pino'

const logger = pino()

const updateActivity = async ({ theme, syncType, currentBackups }) => {
  const previousBackups = await backupModel().fetchPreviousBackUp({
    shopId: theme.shop.id,
    themeId: theme.id
  })
  if (!previousBackups?.length)
    return activityModel().create({
      shop: theme.shop.id,
      theme_id: theme.id,
      action: /automatic/gi.test(syncType)
        ? 'Automatic Backup'
        : 'Manual Backup'
    })
  const backUpAssets = previousBackups[0]?.assets
  const assetDifference = differenceBy(
    currentBackups,
    backUpAssets,
    item => item.value
  )
  if (!assetDifference.length)
    return activityModel().create({
      shop: theme.shop.id,
      theme_id: theme.id,
      action: 'No Changes'
    })

  const deletedItems = differenceBy(
    backUpAssets,
    currentBackups,
    item => item.key
  ).map(asset => ({
    type: ActivityTypes.DELETED,
    current_id: asset.id,
    previous_asset_id: backUpAssets.find(ass => ass.key === asset.key)?.id
  }))

  const addedOrModified = assetDifference.map(asset => {
    const wasCreatedToday = moment(asset.external_created_at).isAfter(
      moment().startOf('day')
    )
    return {
      type: wasCreatedToday ? ActivityTypes.ADDED : ActivityTypes.UPDATED,
      current_id: asset.id,
      previous_asset_id: backUpAssets.find(ass => ass.key === asset.key)?.id
    }
  })

  return activityModel().create({
    shop: theme.shop.id,
    theme_id: theme.id,
    assets: [...addedOrModified, ...deletedItems]
  })
}

export default async function syncTheme (data) {
  const theme = await themeModel().getById(data.themeId)
  const backup = await backupModel().upsertBaseOn24HourRange({
    shopId: theme.shop.id,
    syncType: data.syncType,
    themeId: theme.id
  })
  const assets = await platforms(theme.shop.platform).getAssets({
    accessToken: theme.shop.external_access_token,
    platformDomain: theme.shop.platform_domain,
    themeId: theme.external_theme_id
  })
  const currentBackups = []
  const sliced = assets //.slice(93, 96)
  for (let i = 0; i < sliced.length; i++) {
    const asset = sliced[i]
    const assetValues = await platforms(theme.shop.platform).getAsset({
      accessToken: theme.shop.external_access_token,
      platformDomain: theme.shop.platform_domain,
      themeId: theme.external_theme_id,
      assetKey: asset?.key
    })
    const currentAsset = await assetModel().upsertBasedOn24HourPeriod({
      shopId: theme.shop.id,
      backupId: backup.id,
      key: assetValues.key,
      value: assetValues.value || assetValues.attachment,
      content_type: assetValues.content_type,
      syncType: backup.type,
      external_created_at: assetValues.created_at,
      external_updated_at: assetValues.updated_at
    })
    currentBackups.push(currentAsset)
  }
  backupModel().updateById(backup.id, {
    is_syncing: false
  })
  await updateActivity({ theme, syncType: data.syncType, currentBackups })
  console.info('===================>done syncing', data)
}

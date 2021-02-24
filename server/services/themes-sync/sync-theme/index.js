'use strict'

import {
  activityModel,
  assetModel,
  backupModel,
  themes as themeModel
} from '../../../models'
import platforms from '../../platforms'

const updateActivity = async ({ theme, syncType, currentBackups }) => {
  const previousBackups = await backupModel().fetchByPrevious24HourRange({
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
  console.log(previousBackups, currentBackups)
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

  const currentBackups = await Promise.all(
    assets.splice(0, 3).map(async asset => {
      const assetValues = await platforms(theme.shop.platform).getAsset({
        accessToken: theme.shop.external_access_token,
        platformDomain: theme.shop.platform_domain,
        themeId: theme.external_theme_id,
        assetKey: asset?.key
      })
      return assetModel().upsertBasedOn24HourPeriod({
        shopId: theme.shop.id,
        backupId: backup.id,
        key: assetValues.key,
        value: assetValues.value || assetValues.attachment,
        content_type: assetValues.content_type,
        syncType: backup.type
      })
    })
  )
  backupModel().updateById(backup.id, {
    is_syncing: false
  })
  await updateActivity({ theme, syncType: data.syncType, currentBackups })
  console.log('===================>done syncing')
}

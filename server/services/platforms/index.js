'use strict'

import * as shopify from './shopify'

const platformApis = {
  shopify
}

const wrongPlatformError = _ => {
  //  eslint-disable-next-line
  throw Error('platform is not supported')
}

export default function platforms (platform) {
  return platformApis[platform] || wrongPlatformError()
}

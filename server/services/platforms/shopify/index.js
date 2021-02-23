'use strict'
import ShopifyToken from 'shopify-token'
import Shopify from 'shopify-api-node'
import config from '../../../config'
import { required } from '../../../lib/utils'
import { Platforms } from '../../../models/shops/schema'
import request from '../../../lib/request'

const API_VERSION = '2020-04'

const shopifyClient = ({
  shop = required('shop'),
  accessToken = required('accessToken')
}) => {
  const shopify = new Shopify({
    shopName: shop.replace(/(^\w+:|^)\/\//, ''),
    accessToken,
    autoLimit: true,
    apiVersion: API_VERSION
  })

  return shopify
}

const shopifyToken = new ShopifyToken({
  sharedSecret: config.get('SHOPIFY_CLIENT_SECRET'),
  redirectUri: `${config.get(
    'NEXT_PUBLIC_APP_URL'
  )}/api/permission-accepted/shopify`,
  apiKey: config.get('NEXT_PUBLIC_SHOPIFY_CLIENT_ID'),
  scopes: ['read_themes', 'write_themes']
})

const getPermissionUrl = ({ shop = required('shop') }) =>
  shopifyToken.generateAuthUrl(shop)

const getOauthAccessTokens = ({
  code = required('code'),
  shop = required('shop')
}) =>
  shopifyToken.getAccessToken(shop, code).then(response => ({
    accessToken: response.access_token,
    scope: response.scope
  }))

const getSiteDetails = ({
  shop = required('shop'),
  accessToken = required('accessToken')
}) =>
  shopifyClient({ shop, accessToken })
    .shop.get()
    .then(shopDetails => ({
      domain: shopDetails.domain,
      platformDomain: shopDetails.myshopify_domain,
      email: shopDetails.email,
      platform: Platforms.SHOPIFY,
      external_access_token: accessToken,
      name: shopDetails.name,
      externalId: shopDetails.id
    }))

const insertSnippetIntoCurrentLiquid = (value = '') => {
  const snippet = "{% render 'limit-login.liquid', form: form %}"
  const match = value.match(/customer_login.*}/)
  if (!match) return value
  const indexAfterFormTag = match.index + match[0].length
  return (
    value.slice(0, indexAfterFormTag) + snippet + value.slice(indexAfterFormTag)
  )
}
const loadScript = async shopId => {
  const script = await request(
    `${config.get('NEXT_PUBLIC_APP_URL')}/script.liquid`,
    {
      responseType: 'text',
      rejectUnauthorized: false
    }
  ).then(response => response.body)
  return script
    .replace(/SHOP_ID/g, shopId)
    .replace(/NEXT_PUBLIC_APP_URL/g, config.get('NEXT_PUBLIC_APP_URL'))
}

const installWebhooks = ({
  accessToken = required('accessToken'),
  platformDomain = required('platformDomain')
}) => {
  const shopify = shopifyClient({ shop: platformDomain, accessToken })
  const webhooks = [
    {
      address: `${config.get('NEXT_PUBLIC_APP_URL')}}/api/uninstall`,
      topic: 'app/uninstalled'
    },
    {
      address: `${config.get('NEXT_PUBLIC_APP_URL')}}/api/shops/theme`,
      topic: ' themes/publish'
    },
    {
      address: `${config.get('NEXT_PUBLIC_APP_URL')}}/api/shops/theme`,
      topic: ' themes/update'
    }
  ]
  return Promise.all(
    webhooks.map(webhook =>
      shopify.webhook.create({
        topic: webhook.topic,
        address: webhook.address,
        format: 'json'
      })
    )
  ).catch(err => {
    console.log(err.response.body)
  })
}

const createCharge = ({
  accessToken = required('accessToken'),
  platformDomain = required('platformDomain'),
  shopId = required('shopId')
}) =>
  shopifyClient({ shop: platformDomain, accessToken })
    .recurringApplicationCharge.create({
      name: 'Pro Plan',
      price: '2.99',
      return_url: `${config.get(
        'NEXT_PUBLIC_APP_URL'
      )}/api/plans/callback?shop_id=${shopId}`,
      test: config.get('IS_TEST_CHARGE')
    })
    .then(response => response.confirmation_url)

const confirmCharge = ({
  accessToken = required('accessToken'),
  platformDomain = required('platformDomain'),
  chargeId = required('chargeId')
}) =>
  shopifyClient({
    shop: platformDomain,
    accessToken
  }).recurringApplicationCharge.activate(chargeId)

const verifyHmac = shopifyToken.verifyHmac

export {
  getPermissionUrl,
  getOauthAccessTokens,
  getSiteDetails,
  installWebhooks,
  verifyHmac,
  createCharge,
  confirmCharge
}

'use strict'
import config from '../config'
import { createHmac, required } from './utils'
import got from './request'

const API_VERSION = 'v9.0'

const graphBaseUrl = `https://graph.facebook.com/${API_VERSION}`

const request = got.extend({
  prefixUrl: graphBaseUrl,
  responseType: 'json'
})

const FB_APP_ID = config.get('NEXT_PUBLIC_APP_FACEBOOK_ID')
const FB_APP_SECRET = config.get('FACEBOOK_APP_SECRET')

const generateAppProf = (accessToken = required('accessToken')) =>
  createHmac({
    secret: FB_APP_SECRET,
    data: accessToken
  })

function generateLongUserAccessToken (accessToken) {
  return request
    .post('oauth/access_token', {
      json: {
        appsecret_proof: generateAppProf(accessToken),
        grant_type: 'fb_exchange_token',
        client_id: FB_APP_ID,
        client_secret: FB_APP_SECRET,
        fb_exchange_token: accessToken
      }
    })
    .then(response => response.body.access_token)
}

const syncProducts = ({
  products = required('products'),
  catalogId = required('catalogId'),
  accessToken = required('accessToken')
}) =>
  request
    .post(`${catalogId}/batch`, {
      json: {
        allow_upsert: true,
        requests: products,
        appsecret_proof: generateAppProf(accessToken),
        access_token: accessToken
      }
    })
    .then(response => response.body)

const verifyPush = ({
  handle = required('products'),
  catalogId = required('catalogId'),
  accessToken = required('accessToken')
}) =>
  request
    .get(`${catalogId}/check_batch_request_status`, {
      searchParams: {
        handle,
        appsecret_proof: generateAppProf(accessToken),
        access_token: accessToken
      }
    })
    .then(response => response.body)

export { generateLongUserAccessToken, syncProducts, verifyPush }

import convict from 'convict'

import isNil from 'lodash/isNil'
convict.addFormat(require('convict-format-with-validator').email)

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  IS_TEST_CHARGE: {
    doc: 'Is paryment test charge',
    format: Boolean,
    env: 'IS_TEST_CHARGE',
    default: isNil(process.env.IS_TEST_CHARGE)
      ? false
      : !!process.env.IS_TEST_CHARGE
  },
  DB_URL: {
    doc: 'Database url',
    default: process.env.DB_URL,
    format: '*',
    env: 'DB_URL'
  },
  APP_KEY: {
    doc: 'APP KEY',
    default: process.env.APP_KEY,
    format: '*',
    env: 'APP_KEY',
    sensitive: true
  },
  NEXT_PUBLIC_APP_URL: {
    doc: 'NEXT_PUBLIC_APP_URL',
    default: process.env.NEXT_PUBLIC_APP_URL,
    format: '*',
    env: 'NEXT_PUBLIC_APP_URL'
  },
  NEXT_PUBLIC_SHOPIFY_CLIENT_ID: {
    doc: 'NEXT_PUBLIC_SHOPIFY_CLIENT_ID',
    default: process.env.NEXT_PUBLIC_SHOPIFY_CLIENT_ID,
    format: '*',
    env: 'NEXT_PUBLIC_SHOPIFY_CLIENT_ID'
  },
  SHOPIFY_CLIENT_SECRET: {
    doc: 'SHOPIFY_CLIENT_SECRET',
    default: process.env.SHOPIFY_CLIENT_SECRET,
    format: '*',
    env: 'SHOPIFY_CLIENT_SECRET'
  }
})

config.validate({ allowed: 'strict' })

export default config

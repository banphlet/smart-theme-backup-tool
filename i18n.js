import NextI18Next from 'next-i18next'
import path from 'path'
const { localeSubpaths } = require('next/config').default().publicRuntimeConfig

export const supportedLanguages = ['en', 'fr', 'es']

export default new NextI18Next({
  otherLanguages: supportedLanguages,
  localeSubpaths,
  localePath: path.resolve('./public/static/locales'),
  debug: false,
  fallbackLng: 'en'
})

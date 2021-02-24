'use strict'

import mongoose from 'mongoose'
import config from '../../config'
import logger from '../logger'

const dbUrl = config.get('DB_URL')

export const connect = () => {
  return mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => {
      logger().info('Connected to db successfully')
    })
}

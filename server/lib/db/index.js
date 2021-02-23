'use strict'

import mongoose from 'mongoose'
import config from '../../config'
import logger from '../logger'

const dbUrl = config.get('DB_URL')

export const connect = () => {
  if (mongoose.connection.readyState >= 1) {
    return
  }
  return mongoose
    .connect(dbUrl, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    .then(() => {
      logger().info('Connected to db successfully')
    })
}

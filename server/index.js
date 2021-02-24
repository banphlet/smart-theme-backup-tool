'use strict'
import express from 'express'
import next from 'next'
import pino from 'express-pino-logger'
import config from './config'
import userAgent from 'express-useragent'
import attachLocation from './request-handler/middlewares/attach-location'
import Agendash from 'agendash'

import { connect } from './lib/db'
import agenda from './lib/agenda'

const dev = config.get('env') !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const PORT = config.get('PORT') || 8000

app.prepare().then(() => {
  const server = express()
  connect()
  server
    .use(pino())
    .use(userAgent.express())
    .use(attachLocation)
    .use('/dash', Agendash(agenda))
    .all('*', (req, res) => {
      return handle(req, res)
    })
    .listen(PORT, err => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${PORT}`)
    })
})

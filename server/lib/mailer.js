'use strict'
import nodemailer from 'nodemailer'
import nodemailerSendgrid from 'nodemailer-sendgrid'
import config from '../config'

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: config.get('MAILER_API_KEY')
  })
)

export default transport

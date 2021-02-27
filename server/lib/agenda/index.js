'use strict'

import Agenda from 'agenda'
import config from '../../config'
import { required } from '../utils'
import * as handlers from './handlers'

const agenda = new Agenda({ db: { address: config.get('DB_URL') } })

function agendaPreSet () {
  agenda.on('ready', async () => {
    const jobs = await agenda.jobs()
    await Promise.all(
      jobs.map(job =>
        addJob({
          theme: {
            external_theme_name: job.attrs.data.themeName,
            id: job.attrs.data.themeId,
            schedule_time: job.attrs.data.scheduleTime
          },
          handlerName: job.attrs.data.handlerName,
          syncType: job.attrs.data.syncType
        })
      )
    )
  })
  async function graceful () {
    await agenda.stop()
    process.exit(0)
  }

  process.on('SIGTERM', graceful)
  process.on('SIGINT', graceful)
}

const addJob = async ({
  theme = required('theme'),
  handlerName = required('handlerName'),
  syncType = required('syncType')
}) => {
  const jobName = `${theme.external_theme_name}::${theme.id}`
  agenda.define(jobName, definedJob =>
    handlers[handlerName](definedJob.attrs.data)
  )
  const job = agenda.create(jobName, {
    themeId: theme.id,
    themeName: theme.external_theme_name,
    handlerName,
    scheduleTime: theme.schedule_time,
    syncType
  })

  await agenda.start()
  await job
    .repeatEvery(
      // '*/2 * * * *'
      `0 0 ${theme?.schedule_time} * * ?`
    )
    .unique({ 'data.themeId': theme.id })
    .save()
}

export { addJob, agendaPreSet }

export default agenda

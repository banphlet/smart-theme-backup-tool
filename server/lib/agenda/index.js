'use strict'

import Agenda from 'agenda'
import config from '../../config'

const agenda = new Agenda({ db: { address: config.get('DB_URL') } })

export default agenda

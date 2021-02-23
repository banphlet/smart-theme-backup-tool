'use strict'

import Kafka from 'node-rdkafka'
import config from '../config'
import { parseString } from './utils'
import createLogger from './logger'

const pino = createLogger()

const POLL_TIME = 100

const METADATA_OPTIONS = {}

const producer = new Kafka.Producer({
  dr_cb: true,
  'compression.codec': 'gzip',
  'metadata.broker.list': config.get('QUEUE_URL')
})

producer.setPollInterval(POLL_TIME)
producer.on('delivery-report', function (err, report) {
  pino.info('kafka_sent', report)
})

producer.on('event.error', function (err) {
  pino.error('Error from producer')
  pino.error(err)
})

const consumer = new Kafka.KafkaConsumer(
  {
    'group.id': 'digiduka',
    'enable.auto.commit': false,
    'metadata.broker.list': config.get('QUEUE_URL')
  },
  {
    'auto.offset.reset': 'earliest'
  }
)

const connectProducer = () =>
  producer.connect(METADATA_OPTIONS, (err, data) => {
    if (err) return pino.error('error connecting to ', err)
    pino.info('Connected to kafka producer successfully')
  })

const connectConsumer = () =>
  consumer.connect(METADATA_OPTIONS, (err, data) => {
    if (err) return pino.error('error connecting to ', err)
    pino.info('Connected to kafka consumer successfully')
  })

const publish = ({ topic, message }) => {
  if (!producer.isConnected()) throw new Error('Producer not connected')
  const data = typeof message === 'string' ? message : JSON.stringify(message)
  return producer.produce(topic, null, Buffer.from(data))
}

const subscribe = ({
  topics,
  handler,
  rateOrConsumptionInMilliSeconds = 1000,
  numberOfMessagesToProcesssPerRate = 4
}) => {
  consumer.on('ready', () => {
    consumer.subscribe(topics).on('data', async data => {
      const value = parseString(data.value.toString())
      await handler(Object.assign(data, { value }))
      consumer.commit()
    })

    setInterval(() => {
      consumer.consume(numberOfMessagesToProcesssPerRate)
    }, rateOrConsumptionInMilliSeconds)
  })
}

export { connectProducer, connectConsumer, subscribe, publish }

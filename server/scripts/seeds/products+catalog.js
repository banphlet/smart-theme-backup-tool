'use strict'

import { connect } from '../../lib/db'
import { products, catalogs as catalogModel } from '../../models'
import productService from '../../services/products'
import faker from 'faker'
import { DiscountTypes } from '../../models/products/schema'
import sample from 'lodash/sample'

const createCatalogs = (length = 20) => {
  const promises = Array.from({ length }).map(() =>
    catalogModel().create({
      shop: '600169d0207bf12dafcf9d15',
      handle: faker.helpers.slugify(faker.random.words()),
      name: faker.commerce.productName()
    })
  )
  return Promise.all(promises)
}

const createProduct = catalog =>
  productService().create({
    payment_user_id: '714d4685-9d6a-4b36-a7a4-dee4143dcad5',
    name: faker.commerce.productName(),
    handle: faker.helpers.slugify(
      faker.commerce.productName() + faker.random.word()
    ),
    description: faker.commerce.productDescription(),
    images: Array.from({ length: 3 }).map(() => faker.image.imageUrl()),
    price: faker.commerce.price(),
    stock: faker.random.number({ min: 1, max: 20, precision: 1 }),
    variants: [
      {
        type: 'color',
        values: Array.from({ length: 5 }).map(() => faker.commerce.color())
      },
      {
        type: 'size',
        values: ['lg', 'sm', 'xl', 'xxl', 'xsm']
      }
    ],
    catalogs: [catalog],
    discount: {
      value: faker.random.number({ min: 1, max: 4 }),
      type: sample([DiscountTypes.FIXED, DiscountTypes.PERCENTAGE])
    }
  })

const runAndCreateCatalogsAndProducts = async () => {
  await connect()
  const catalogs = await createCatalogs(5)
  const items = Array.from({ length: 200 })
  for (let i = 0; i < items.length; i++) {
    const catalog = catalogs[i] || catalogs[0]
    await createProduct(catalog?.id)
  }
}

export { runAndCreateCatalogsAndProducts }

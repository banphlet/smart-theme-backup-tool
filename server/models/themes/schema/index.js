'use strict'

import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    },
    external_theme_id: {
      type: String,
      required: true
    },
    external_theme_name: {
      type: String,
      required: true
    },
    is_subscribed: {
      type: Boolean,
      default: false
    },
    role: String,
    external_payment_id: String,
    payment_price: Number,
    payment_name: String,
    schedule_time: {
      type: Number,
      default: 12
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    toJSON: {
      virtuals: true,
      getters: true
    },
    toObject: {
      virtuals: true,
      getters: true
    }
  }
)

export default schema

'use strict'

import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    },
    back_up_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Backup',
      required: true
    },
    external_id: {
      type: String,
      required: true
    },
    key: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
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

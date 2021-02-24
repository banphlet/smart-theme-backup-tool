'use strict'

import mongoose from 'mongoose'
import { BackUpTypes } from '../../backups/schema'

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
    key: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    content_type: String,
    sync_type: {
      type: String,
      enum: Object.values(BackUpTypes)
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

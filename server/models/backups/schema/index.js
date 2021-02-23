'use strict'

import mongoose from 'mongoose'

export const BackUpTypes = {
  MANUAL: 'manual',
  AUTOMATIC: 'automatic'
}

const schema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    },
    type: {
      type: String,
      enum: Object.values(BackUpTypes)
    },
    theme_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theme',
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

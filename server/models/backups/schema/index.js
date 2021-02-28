'use strict'

import mongoose from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

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
    },
    is_syncing: {
      type: Boolean,
      default: true
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

schema.virtual('assets', {
  ref: 'Asset',
  foreignField: 'back_up_id',
  localField: '_id'
})

schema.plugin(aggregatePaginate)

export default schema

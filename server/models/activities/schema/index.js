'use strict'

import mongoose from 'mongoose'

export const ActivityTypes = {
  ADDED: 'added',
  UPDATED: 'updated',
  SUBSCRIBED: 'subscribed',
  DELETED: 'deleted'
}

const schema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: true
    },
    theme_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theme',
      required: true
    },
    asset_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: true
    },
    type: {
      type: String,
      enum: Object.values(ActivityTypes)
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

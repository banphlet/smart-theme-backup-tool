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
    assets: {
      type: [
        {
          asset_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Asset'
          },
          type: {
            type: String,
            enum: Object.values(ActivityTypes)
          }
        }
      ]
    },
    action: String,
    is_subscribed: Boolean
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

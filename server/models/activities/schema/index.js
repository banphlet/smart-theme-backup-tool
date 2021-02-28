'use strict'

import mongoose from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

export const ActivityTypes = {
  ADDED: 'added',
  UPDATED: 'updated',
  SUBSCRIBED: 'subscribed',
  DELETED: 'deleted'
}

const assetType = new mongoose.Schema({
  current_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    alias: 'current_asset'
  },
  previous_asset_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    alias: 'previous_asset'
  },
  type: {
    type: String,
    enum: Object.values(ActivityTypes)
  }
})

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
      type: [assetType]
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

schema.plugin(aggregatePaginate)

export default schema

import mongoose from 'mongoose';
import { ICollection } from '../types/Collection';

const collectionSchema = new mongoose.Schema<ICollection>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    itemCount: {
      type: Number,
      default: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const CollectionModel = mongoose.model<ICollection>('Collection', collectionSchema);

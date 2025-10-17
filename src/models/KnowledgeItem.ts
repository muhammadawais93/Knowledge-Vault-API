import mongoose from 'mongoose';
import { IKnowledgeItem } from '../types/KnowledgeItem';

const knowledgeItemSchema = new mongoose.Schema<IKnowledgeItem>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      immutable: true,
    },
    type: {
      type: String,
      enum: ['note', 'bookmark', 'code-snippet'],
      required: true,
      immutable: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    url: {
      type: String,
    },
    programmingLanguage: {
      type: String,
    },
    tags: {
      type: [String],
      set: (tags: string[]) => tags.map((tag) => tag.toLowerCase().trim()),
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    viewCount: {
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

knowledgeItemSchema.index(
  { title: 'text', content: 'text', tags: 'text' },
  {
    weights: { title: 10, tags: 5, content: 3 },
    name: 'KnowledgeTextIndex',
  }
);

export const KnowledgeItemModel = mongoose.model<IKnowledgeItem>('KnowledgeItem', knowledgeItemSchema);

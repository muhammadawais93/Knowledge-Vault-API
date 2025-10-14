import mongoose from 'mongoose';

export interface IKnowledgeItem {
  userId: mongoose.Schema.Types.ObjectId;
  type: 'note' | 'bookmark' | 'code-snippet';
  title: string;
  content?: string;
  url?: string;
  programmingLanguage?: string;
  tags?: string[];
  collectionId?: mongoose.Schema.Types.ObjectId;
  isPrivate: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

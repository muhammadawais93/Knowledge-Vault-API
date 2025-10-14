import mongoose from 'mongoose';

export interface ICollection {
  userId: mongoose.Schema.Types.ObjectId;
  name: string;
  description?: string;
  isPrivate: boolean;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
}

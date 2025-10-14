import { Request } from 'express';
import mongoose from 'mongoose';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export interface RequestWithLogging extends Request {
  requestId?: string;
  startTime?: number;
}

export interface queryParams {
  q: string;
  type?: string;
  tags?: string;
}

export interface MatchCriteria {
  userId: mongoose.Types.ObjectId;
  $text: { $search: string };
  type?: string;
  tags?: { $in: string[] };
}

export interface ProjectionStage {
  title: number;
  content: number;
  url: number;
  programmingLanguage: number;
  tags: number;
  type: number;
  updatedAt: number;
  score: { $meta: string };
}

export interface SortStage {
  score: { $meta: string };
}

import mongoose, { Document, Schema } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  description?: string;
  image_url: string;
  created_at: Date;
  updated_at: Date;
}

const gallerySchema = new Schema<IGallery>({
  title: { type: String, required: true },
  description: { type: String },
  image_url: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

gallerySchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export const Gallery = mongoose.model<IGallery>('Gallery', gallerySchema);

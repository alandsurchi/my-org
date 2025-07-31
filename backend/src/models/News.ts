import mongoose, { Document, Schema } from 'mongoose';

export interface INews extends Document {
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  image_url?: string;
  status: 'draft' | 'published' | 'archived';
  author_id?: string;
  date: Date;
  // Multilingual support
  title_ar?: string;
  title_ku?: string;
  description_ar?: string;
  description_ku?: string;
  created_at: Date;
  updated_at: Date;
}

const newsSchema = new Schema<INews>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  category: { type: String, required: true },
  image_url: { type: String },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
  author_id: { type: String },
  date: { type: Date, required: true },
  // Multilingual support
  title_ar: { type: String },
  title_ku: { type: String },
  description_ar: { type: String },
  description_ku: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

newsSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

// Transform _id to id when converting to JSON
newsSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete (ret as any).__v;
    return ret;
  }
});

export const News = mongoose.model<INews>('News', newsSchema);

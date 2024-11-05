import mongoose, { Schema, Document } from 'mongoose';

interface IFollow extends Document {
  follower: mongoose.Types.ObjectId;
  following: mongoose.Types.ObjectId;
  status: 'active' | 'blocked';
  createdAt: Date;
}

const followSchema = new Schema<IFollow>({
  follower: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  following: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Ensure unique follows
followSchema.index({ follower: 1, following: 1 }, { unique: true });

const Follow = mongoose.models.Follow || mongoose.model<IFollow>('Follow', followSchema);
export default Follow; 
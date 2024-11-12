import mongoose, { Schema, Document } from 'mongoose';

interface ILike extends Document {
  post: mongoose.Types.ObjectId;
  likedBy: mongoose.Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  likedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate likes
likeSchema.index({ post: 1, likedBy: 1 }, { unique: true });

const Like = mongoose.models.Like || mongoose.model<ILike>('Like', likeSchema);
export default Like; 
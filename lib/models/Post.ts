import mongoose, { Schema } from 'mongoose';

interface IPost {
  authorId: mongoose.Types.ObjectId;
  username: string;
  content: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  userAvatarUrl?: string;
  userAvatarType?: 'generated' | 'uploaded';
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>({
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String,
    required: true,
    index: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  likesCount: {
    type: Number,
    default: 0,
  },
  commentsCount: {
    type: Number,
    default: 0,
  },
  userAvatarUrl: String,
  userAvatarType: {
    type: String,
    enum: ['generated', 'uploaded'],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

// Add indexes for better performance
postSchema.index({ createdAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ isDeleted: 1 });

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', postSchema);
export default Post; 
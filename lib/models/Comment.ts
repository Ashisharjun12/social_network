import mongoose, { Schema, Document } from 'mongoose';

interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  username: string;
  content: string;
  userAvatarUrl?: string;
  isVerified?: boolean;
  likesCount: number;
  repliesCount: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>({
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
    index: true
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  userAvatarUrl: String,
  isVerified: {
    type: Boolean,
    default: false
  },
  likesCount: {
    type: Number,
    default: 0
  },
  repliesCount: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Pre-save middleware to get user verification status
commentSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('authorId')) {
    try {
      const User = mongoose.model('User');
      const user = await User.findById(this.authorId).select('isVerified avatarUrl');
      if (user) {
        this.isVerified = user.isVerified;
        this.userAvatarUrl = user.avatarUrl;
      }
    } catch (error) {
      console.error('Error getting user verification status:', error);
    }
  }
  next();
});

const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema);
export default Comment; 
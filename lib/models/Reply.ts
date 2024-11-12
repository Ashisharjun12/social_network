import mongoose, { Schema, Document } from 'mongoose';

interface IReply extends Document {
  commentId: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  username: string;
  content: string;
  userAvatarUrl?: string;
  isVerified?: boolean;
  likesCount: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const replySchema = new Schema<IReply>({
  commentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
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
  isVerified: Boolean,
  likesCount: {
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

replySchema.index({ commentId: 1, createdAt: 1 });

const Reply = mongoose.models.Reply || mongoose.model<IReply>('Reply', replySchema);
export default Reply; 
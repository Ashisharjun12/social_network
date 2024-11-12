import mongoose, { Schema, Document } from 'mongoose';

interface IPoll {
  options: {
    text: string;
    votes: number;
    voters: string[];
  }[];
  totalVotes: number;
  endsAt: Date;
}

interface IMedia {
  type: 'image';
  url: string;
  cloudinaryPublicId?: string;
}

interface IPost extends Document {
  authorId: mongoose.Types.ObjectId;
  username: string;
  content: string;
  media?: IMedia;
  poll?: IPoll;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  userAvatarUrl?: string;
  userAvatarType?: 'generated' | 'uploaded';
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  isLiked?: boolean;
  _isLiked?: boolean;
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
  media: {
    type: {
      type: String,
      enum: ['image']
    },
    url: String,
    cloudinaryPublicId: String
  },
  poll: {
    options: [{
      text: String,
      votes: { type: Number, default: 0 },
      voters: [{ type: Schema.Types.ObjectId, ref: 'User' }]
    }],
    totalVotes: { type: Number, default: 0 },
    endsAt: Date
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

// Add virtual for isLiked
postSchema.virtual('isLiked').get(function() {
  return this._isLiked || false;
});

postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

const Post = mongoose.models.Post || mongoose.model<IPost>('Post', postSchema);
export default Post; 
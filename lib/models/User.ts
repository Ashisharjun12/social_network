import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  username: string;
  avatarType: 'generated' | 'uploaded';
  avatarUrl: string;
  cloudinaryPublicId: string | null;
  college?: {
    id: string;
    name: string;
    location: string;
    type: string;
  };
  personalInfo: {
    age: number;
    gender: string;
    personality: string;
    profession: string;
  };
  interests: string[];
  recoveryEmail: string;
  isEmailVerified: boolean;
  tempId: string;
  role: 'user' | 'admin';
  karmaPoints: number;
  lastActive: Date;
  following: string[];
  followers: string[];
  isVerified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  avatarType: {
    type: String,
    enum: ['generated', 'uploaded'],
    required: true
  },
  avatarUrl: String,
  cloudinaryPublicId: String,
  personalInfo: {
    age: Number,
    gender: String,
    personality: String,
    profession: String
  },
  interests: {
    type: [String],
    default: []
  },
  recoveryEmail: {
    type: String,
    required: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  tempId: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  karmaPoints: {
    type: Number,
    default: 0
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  followers: {
    type: [String],
    default: []
  },
  following: {
    type: [String],
    default: []
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  verifiedBy: String,
  college: {
    id: { type: String },
    name: { type: String },
    location: { type: String },
    type: { type: String }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual fields for counts
userSchema.virtual('followersCount').get(function() {
  return this.followers?.length || 0;
});

userSchema.virtual('followingCount').get(function() {
  return this.following?.length || 0;
});

// Add index for college.id for faster queries
userSchema.index({ 'college.id': 1 });

// Add compound indexes for faster search
userSchema.index({ username: 'text', 'college.name': 'text', 'college.location': 'text' });
userSchema.index({ 'college.id': 1 }); // Index for college-based queries
userSchema.index({ username: 1 }); // Index for username queries

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User; 
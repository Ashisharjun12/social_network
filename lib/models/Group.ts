import mongoose, { Schema, Document } from 'mongoose';

interface IGroup extends Document {
  name: string;
  description: string;
  createdBy: string; // User ID
  college?: {
    id: string;
    name: string;
  };
  members: string[]; // Array of User IDs
  createdAt: Date;
  updatedAt: Date;
}

const groupSchema = new Schema<IGroup>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  college: {
    id: String,
    name: String
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Virtual for member count
groupSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

const Group = mongoose.models.Group || mongoose.model<IGroup>('Group', groupSchema);
export default Group; 
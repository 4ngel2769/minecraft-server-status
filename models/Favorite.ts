import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  serverHost: string;
  serverPort: number;
  serverType: 'java' | 'bedrock';
  alias?: string; // Custom name for the server
  addedAt: Date;
  lastChecked?: Date;
}

const FavoriteSchema: Schema<IFavorite> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  serverHost: {
    type: String,
    required: [true, 'Server host is required'],
    trim: true,
  },
  serverPort: {
    type: Number,
    required: [true, 'Server port is required'],
  },
  serverType: {
    type: String,
    enum: ['java', 'bedrock'],
    default: 'java',
  },
  alias: {
    type: String,
    trim: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  lastChecked: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Compound index to prevent duplicate favorites
FavoriteSchema.index({ userId: 1, serverHost: 1, serverPort: 1 }, { unique: true });

// Prevent model recompilation during development
const Favorite: Model<IFavorite> = mongoose.models.Favorite || mongoose.model<IFavorite>('Favorite', FavoriteSchema);

export default Favorite;

import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  name: string
  role: 'admin' | 'client'
  clientId?: mongoose.Types.ObjectId
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['admin', 'client'],
      required: true
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: function() {
        return this.role === 'client'
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date
    }
  },
  {
    timestamps: true
  }
)

// Indexes
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })
UserSchema.index({ clientId: 1 })

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
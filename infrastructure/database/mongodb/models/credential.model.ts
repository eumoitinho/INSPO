import mongoose, { Schema, Document } from 'mongoose'

export interface ICredential extends Document {
  clientId: mongoose.Types.ObjectId
  platform: string
  credentials: Record<string, string>
  createdAt: Date
  updatedAt: Date
}

const CredentialSchema = new Schema<ICredential>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: true
    },
    platform: {
      type: String,
      required: true,
      enum: ['google_ads', 'facebook_ads', 'google_analytics']
    },
    credentials: {
      type: Map,
      of: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

// Compound index for unique platform per client
CredentialSchema.index({ clientId: 1, platform: 1 }, { unique: true })

export const Credential = mongoose.models.Credential || mongoose.model<ICredential>('Credential', CredentialSchema)
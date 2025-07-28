import mongoose, { Schema, Document } from 'mongoose'

export interface IClient extends Document {
  name: string
  email: string
  slug: string
  status: 'active' | 'inactive' | 'suspended'
  monthlyBudget: number
  tags: string[]
  portalSettings: {
    primaryColor: string
    secondaryColor: string
    logo?: string
    customDomain?: string
    allowedSections: string[]
  }
  googleAds: {
    connected: boolean
    lastSync?: Date
    error?: string
  }
  facebookAds: {
    connected: boolean
    lastSync?: Date
    error?: string
  }
  googleAnalytics: {
    connected: boolean
    lastSync?: Date
    error?: string
  }
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

const ClientSchema = new Schema<IClient>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active'
    },
    monthlyBudget: {
      type: Number,
      required: true,
      min: 0
    },
    tags: [{
      type: String,
      trim: true
    }],
    portalSettings: {
      primaryColor: {
        type: String,
        default: '#3B82F6'
      },
      secondaryColor: {
        type: String,
        default: '#8B5CF6'
      },
      logo: String,
      customDomain: String,
      allowedSections: [{
        type: String,
        enum: ['dashboard', 'campaigns', 'reports', 'analytics']
      }]
    },
    googleAds: {
      connected: {
        type: Boolean,
        default: false
      },
      lastSync: Date,
      error: String
    },
    facebookAds: {
      connected: {
        type: Boolean,
        default: false
      },
      lastSync: Date,
      error: String
    },
    googleAnalytics: {
      connected: {
        type: Boolean,
        default: false
      },
      lastSync: Date,
      error: String
    },
    deletedAt: Date
  },
  {
    timestamps: true
  }
)

// Indexes
ClientSchema.index({ slug: 1 })
ClientSchema.index({ email: 1 })
ClientSchema.index({ status: 1 })
ClientSchema.index({ tags: 1 })
ClientSchema.index({ createdAt: -1 })

// Soft delete middleware
ClientSchema.pre('find', function() {
  this.where({ deletedAt: { $exists: false } })
})

ClientSchema.pre('findOne', function() {
  this.where({ deletedAt: { $exists: false } })
})

export const Client = mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema)
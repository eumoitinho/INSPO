/**
 * MongoDB Connection and Models for NINETWODASH
 * Handles database operations for clients, reports, and user management
 */

import mongoose from 'mongoose';

// Database connection
let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    return;
  }

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI não está definida nas variáveis de ambiente');
    }

    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('✅ Conectado ao MongoDB');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    throw error;
  }
}

// User Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'client'],
    default: 'client',
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: function() {
      return this.role === 'client';
    }
  },
  avatar: String,
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Client Schema
const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active',
  },
  monthlyBudget: {
    type: Number,
    required: true,
  },
  avatar: String,
  tags: [String],
  
  // API Configurations (credenciais são armazenadas criptografadas)
  googleAds: {
    customerId: String,
    connected: {
      type: Boolean,
      default: false,
    },
    lastSync: Date,
    // Credenciais criptografadas (developer_token, client_id, client_secret, refresh_token)
    encryptedCredentials: String,
  },
  
  facebookAds: {
    adAccountId: String,
    pixelId: String,
    connected: {
      type: Boolean,
      default: false,
    },
    lastSync: Date,
    // Credenciais criptografadas (app_id, app_secret, access_token)
    encryptedCredentials: String,
  },
  
  googleAnalytics: {
    propertyId: String,
    viewId: String,
    connected: {
      type: Boolean,
      default: false,
    },
    lastSync: Date,
    // Credenciais criptografadas (service_account_key ou client_email + private_key)
    encryptedCredentials: String,
  },
  
  // Client Portal Settings
  portalSettings: {
    logoUrl: String,
    primaryColor: {
      type: String,
      default: '#3B82F6',
    },
    secondaryColor: {
      type: String,
      default: '#8B5CF6',
    },
    allowedSections: {
      type: [String],
      default: ['dashboard', 'campaigns', 'analytics', 'charts', 'reports'],
    },
    customDomain: String,
  },
  
  // Custom Charts Configuration
  customCharts: [{
    id: String,
    name: String,
    type: {
      type: String,
      enum: ['line', 'bar', 'area', 'pie'],
    },
    metrics: [String],
    period: {
      type: String,
      enum: ['7d', '30d', '90d'],
      default: '30d',
    },
    groupBy: {
      type: String,
      enum: ['date', 'campaign', 'platform'],
      default: 'date',
    },
    filters: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    style: {
      width: {
        type: String,
        enum: ['full', 'half', 'quarter'],
        default: 'full',
      },
      height: {
        type: String,
        enum: ['small', 'medium', 'large'],
        default: 'medium',
      },
      color: {
        type: String,
        enum: ['primary', 'secondary', 'success', 'warning', 'info', 'danger'],
        default: 'primary',
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Campaign Schema
const CampaignSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  campaignId: {
    type: String,
    required: true,
  },
  campaignName: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    enum: ['google_ads', 'facebook', 'meta'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'completed'],
    required: true,
  },
  
  // Daily Metrics
  metrics: [{
    date: {
      type: Date,
      required: true,
    },
    impressions: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    cost: {
      type: Number,
      default: 0,
    },
    conversions: {
      type: Number,
      default: 0,
    },
    ctr: {
      type: Number,
      default: 0,
    },
    cpc: {
      type: Number,
      default: 0,
    },
    cpm: {
      type: Number,
      default: 0,
    },
    conversionRate: {
      type: Number,
      default: 0,
    },
    roas: {
      type: Number,
      default: 0,
    },
  }],
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Report Schema
const ReportSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'custom'],
    required: true,
  },
  period: {
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
  },
  
  // Report Data
  summary: {
    totalImpressions: Number,
    totalClicks: Number,
    totalCost: Number,
    totalConversions: Number,
    averageCTR: Number,
    averageCPC: Number,
    averageCPM: Number,
    averageConversionRate: Number,
    totalROAS: Number,
  },
  
  // Platform Breakdown
  platforms: [{
    platform: String,
    metrics: {
      impressions: Number,
      clicks: Number,
      cost: Number,
      conversions: Number,
      ctr: Number,
      cpc: Number,
      cpm: Number,
      conversionRate: Number,
      roas: Number,
    },
  }],
  
  // Charts Data
  charts: {
    dailyMetrics: [{
      date: Date,
      impressions: Number,
      clicks: Number,
      cost: Number,
      conversions: Number,
    }],
    platformDistribution: [{
      platform: String,
      value: Number,
      percentage: Number,
    }],
    deviceBreakdown: [{
      device: String,
      sessions: Number,
      percentage: Number,
    }],
  },
  
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  isShared: {
    type: Boolean,
    default: false,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Analytics Data Schema (for caching GA4 data)
const AnalyticsDataSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  
  // Google Analytics Metrics
  sessions: {
    type: Number,
    default: 0,
  },
  users: {
    type: Number,
    default: 0,
  },
  newUsers: {
    type: Number,
    default: 0,
  },
  pageviews: {
    type: Number,
    default: 0,
  },
  bounceRate: {
    type: Number,
    default: 0,
  },
  sessionDuration: {
    type: Number,
    default: 0,
  },
  
  // Traffic Sources
  trafficSources: [{
    source: String,
    medium: String,
    sessions: Number,
    users: Number,
    bounceRate: Number,
  }],
  
  // Device Data
  deviceData: [{
    deviceCategory: String,
    sessions: Number,
    users: Number,
    bounceRate: Number,
  }],
  
  // Top Pages
  topPages: [{
    page: String,
    pageTitle: String,
    pageviews: Number,
    uniquePageviews: Number,
    bounceRate: Number,
    avgTimeOnPage: Number,
  }],
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Activity Log Schema
const ActivityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  },
  action: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  ipAddress: String,
  userAgent: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create indexes for better performance
// Note: slug index is already created by unique: true in schema definition
CampaignSchema.index({ clientId: 1, platform: 1, 'metrics.date': 1 });
ReportSchema.index({ clientId: 1, type: 1, createdAt: -1 });
AnalyticsDataSchema.index({ clientId: 1, date: 1 });
ActivityLogSchema.index({ userId: 1, createdAt: -1 });
ActivityLogSchema.index({ clientId: 1, createdAt: -1 });

// Update timestamps
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

ClientSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

CampaignSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Export models
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Client = mongoose.models.Client || mongoose.model('Client', ClientSchema);
export const Campaign = mongoose.models.Campaign || mongoose.model('Campaign', CampaignSchema);
export const Report = mongoose.models.Report || mongoose.model('Report', ReportSchema);
export const AnalyticsData = mongoose.models.AnalyticsData || mongoose.model('AnalyticsData', AnalyticsDataSchema);
export const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);

// Helper functions
export async function findClientBySlug(slug: string) {
  await connectToDatabase();
  return await (Client as any).findOne({ slug, status: { $ne: 'inactive' } });
}

export async function findUserByEmail(email: string) {
  await connectToDatabase();
  return await (User as any).findOne({ email, isActive: true });
}

export async function logActivity(
  userId: string,
  action: string,
  description: string,
  metadata?: any,
  clientId?: string
) {
  await connectToDatabase();
  
  const activityLog = new ActivityLog({
    userId,
    clientId,
    action,
    description,
    metadata,
  });
  
  return await activityLog.save();
}

export async function getClientCampaigns(clientId: string, platform?: string) {
  await connectToDatabase();
  
  const filter: any = { clientId };
  if (platform) {
    filter.platform = platform;
  }
  
  return await (Campaign as any).find(filter)
    .sort({ updatedAt: -1 })
    .populate('clientId', 'name email slug');
}

export async function saveMetricsData(
  clientId: string,
  campaignId: string,
  platform: string,
  metricsData: any[]
) {
  await connectToDatabase();
  
  const campaign = await (Campaign as any).findOneAndUpdate(
    { clientId, campaignId, platform },
    {
      clientId,
      campaignId,
      campaignName: metricsData[0]?.campaignName || 'Unknown',
      platform,
      status: 'active',
      $push: {
        metrics: {
          $each: metricsData,
          $sort: { date: 1 }
        }
      }
    },
    { upsert: true, new: true }
  );
  
  return campaign;
}

export async function findRecentCampaigns(clientSlug: string, period: '7d' | '30d' | '90d') {
  await connectToDatabase();
  
  // Get client first
  const client = await (Client as any).findOne({ slug: clientSlug });
  if (!client) {
    return [];
  }
  
  // Calculate date range
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  // Find campaigns for the client in the period
  const campaigns = await (Campaign as any).find({
    clientId: client._id,
    updatedAt: { $gte: startDate },
    status: 'active'
  }).sort({ updatedAt: -1 }).lean();
  
  return campaigns.map((campaign: any) => ({
    campaignId: campaign.campaignId || campaign._id.toString(),
    campaignName: campaign.campaignName,
    platform: campaign.platform,
    status: campaign.status,
    date: campaign.updatedAt?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
    metrics: campaign.metrics?.[campaign.metrics.length - 1] || {
      impressions: 0,
      clicks: 0,
      cost: 0,
      conversions: 0,
      ctr: 0,
      cpc: 0,
      cpm: 0,
      conversionRate: 0,
      roas: 0,
    },
  }));
}
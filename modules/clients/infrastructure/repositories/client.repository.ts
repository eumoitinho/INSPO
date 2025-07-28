import { IClientRepository, ClientFilters } from '../../application/ports/client.repository'
import { ClientEntity } from '../../domain/entities/client.entity'
import { connectToDatabase } from '@/infrastructure/database/mongodb/client'
import { Client as ClientModel } from '@/infrastructure/database/mongodb/models/client.model'

export class ClientRepository implements IClientRepository {
  async findById(id: string): Promise<ClientEntity | null> {
    await connectToDatabase()
    const client = await ClientModel.findById(id).lean()
    return client ? this.mapToEntity(client) : null
  }

  async findByEmail(email: string): Promise<ClientEntity | null> {
    await connectToDatabase()
    const client = await ClientModel.findOne({ email }).lean()
    return client ? this.mapToEntity(client) : null
  }

  async findBySlug(slug: string): Promise<ClientEntity | null> {
    await connectToDatabase()
    const client = await ClientModel.findOne({ slug }).lean()
    return client ? this.mapToEntity(client) : null
  }

  async findAll(filters?: ClientFilters): Promise<{ clients: ClientEntity[]; total: number }> {
    await connectToDatabase()
    
    const query: any = {}
    
    if (filters?.status) {
      query.status = filters.status
    }
    
    if (filters?.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } }
      ]
    }
    
    if (filters?.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags }
    }

    const page = filters?.page || 1
    const limit = filters?.limit || 10
    const skip = (page - 1) * limit

    const [clients, total] = await Promise.all([
      ClientModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      ClientModel.countDocuments(query)
    ])

    return {
      clients: clients.map(this.mapToEntity),
      total
    }
  }

  async create(data: Omit<ClientEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ClientEntity> {
    await connectToDatabase()
    const client = await ClientModel.create(data)
    return this.mapToEntity(client.toObject())
  }

  async update(id: string, data: Partial<ClientEntity>): Promise<ClientEntity | null> {
    await connectToDatabase()
    const client = await ClientModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).lean()
    return client ? this.mapToEntity(client) : null
  }

  async delete(id: string): Promise<boolean> {
    await connectToDatabase()
    const result = await ClientModel.findByIdAndUpdate(
      id,
      { $set: { deletedAt: new Date() } }
    )
    return !!result
  }

  async getAllSlugs(): Promise<string[]> {
    await connectToDatabase()
    const clients = await ClientModel.find({}, { slug: 1 }).lean()
    return clients.map(c => c.slug)
  }

  async updateIntegrationStatus(
    id: string,
    platform: 'googleAds' | 'facebookAds' | 'googleAnalytics',
    status: { connected: boolean; lastSync?: Date; error?: string }
  ): Promise<void> {
    await connectToDatabase()
    await ClientModel.findByIdAndUpdate(id, {
      $set: { [platform]: status }
    })
  }

  private mapToEntity(doc: any): ClientEntity {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      slug: doc.slug,
      status: doc.status,
      monthlyBudget: doc.monthlyBudget,
      tags: doc.tags || [],
      portalSettings: doc.portalSettings,
      googleAds: doc.googleAds,
      facebookAds: doc.facebookAds,
      googleAnalytics: doc.googleAnalytics,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      deletedAt: doc.deletedAt
    }
  }
}
import { ClientEntity } from '../../domain/entities/client.entity'

export interface IClientRepository {
  findById(id: string): Promise<ClientEntity | null>
  findByEmail(email: string): Promise<ClientEntity | null>
  findBySlug(slug: string): Promise<ClientEntity | null>
  findAll(filters?: ClientFilters): Promise<{ clients: ClientEntity[]; total: number }>
  create(data: Omit<ClientEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<ClientEntity>
  update(id: string, data: Partial<ClientEntity>): Promise<ClientEntity | null>
  delete(id: string): Promise<boolean>
  getAllSlugs(): Promise<string[]>
  updateIntegrationStatus(
    id: string, 
    platform: 'googleAds' | 'facebookAds' | 'googleAnalytics',
    status: { connected: boolean; lastSync?: Date; error?: string }
  ): Promise<void>
}

export interface ClientFilters {
  status?: 'active' | 'inactive' | 'suspended'
  search?: string
  tags?: string[]
  page?: number
  limit?: number
}
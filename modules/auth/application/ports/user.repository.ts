import { UserEntity } from '../../domain/entities/user.entity'

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>
  findByEmail(email: string): Promise<UserEntity | null>
  create(user: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserEntity>
  update(id: string, data: Partial<UserEntity>): Promise<UserEntity | null>
  updateLastLogin(id: string): Promise<void>
  delete(id: string): Promise<boolean>
}
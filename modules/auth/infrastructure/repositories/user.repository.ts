import { IUserRepository } from '../../application/ports/user.repository'
import { UserEntity } from '../../domain/entities/user.entity'
import { connectToDatabase } from '@/infrastructure/database/mongodb/client'
import { User as UserModel } from '@/infrastructure/database/mongodb/models/user.model'

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<UserEntity | null> {
    await connectToDatabase()
    const user = await UserModel.findById(id).lean()
    return user ? this.mapToEntity(user) : null
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    await connectToDatabase()
    const user = await UserModel.findOne({ email }).lean()
    return user ? this.mapToEntity(user) : null
  }

  async create(data: Omit<UserEntity, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserEntity> {
    await connectToDatabase()
    const user = await UserModel.create(data)
    return this.mapToEntity(user.toObject())
  }

  async update(id: string, data: Partial<UserEntity>): Promise<UserEntity | null> {
    await connectToDatabase()
    const user = await UserModel.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    ).lean()
    return user ? this.mapToEntity(user) : null
  }

  async updateLastLogin(id: string): Promise<void> {
    await connectToDatabase()
    await UserModel.findByIdAndUpdate(id, {
      $set: { lastLogin: new Date() }
    })
  }

  async delete(id: string): Promise<boolean> {
    await connectToDatabase()
    const result = await UserModel.findByIdAndDelete(id)
    return !!result
  }

  private mapToEntity(doc: any): UserEntity {
    return {
      id: doc._id.toString(),
      email: doc.email,
      password: doc.password,
      name: doc.name,
      role: doc.role,
      clientId: doc.clientId?.toString(),
      isActive: doc.isActive ?? true,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      lastLogin: doc.lastLogin
    }
  }
}
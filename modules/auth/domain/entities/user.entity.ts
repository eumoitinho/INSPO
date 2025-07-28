import { z } from 'zod'

export const UserRoleEnum = z.enum(['admin', 'client'])
export type UserRole = z.infer<typeof UserRoleEnum>

export const UserEntitySchema = z.object({
  id: z.string(),
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
  role: UserRoleEnum,
  clientId: z.string().optional(),
  isActive: z.boolean().default(true),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastLogin: z.date().optional()
})

export type UserEntity = z.infer<typeof UserEntitySchema>

export class User {
  constructor(private props: UserEntity) {}

  get id() { return this.props.id }
  get email() { return this.props.email }
  get name() { return this.props.name }
  get role() { return this.props.role }
  get clientId() { return this.props.clientId }
  get isActive() { return this.props.isActive }
  
  isAdmin(): boolean {
    return this.props.role === 'admin'
  }

  isClient(): boolean {
    return this.props.role === 'client'
  }

  canAccessClient(clientId: string): boolean {
    if (this.isAdmin()) return true
    return this.props.clientId === clientId
  }

  toJSON(): UserEntity {
    return this.props
  }
}
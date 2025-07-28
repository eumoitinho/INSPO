import { CreateClientDTO, type CreateClientInput } from '../dtos/client.dto'
import { IClientRepository } from '../ports/client.repository'
import { IUserRepository } from '@ninetwodash/auth'
import { ISlugService } from '../../domain/services/slug.service'
import { generateRandomPassword, EncryptionService } from '@ninetwodash/auth'
import { ClientEntity } from '../../domain/entities/client.entity'

export interface ICreateClientUseCase {
  execute(input: CreateClientInput): Promise<CreateClientResult>
}

export type CreateClientResult = 
  | { success: true; client: ClientEntity; credentials: { email: string; password: string; portalUrl: string } }
  | { success: false; error: string }

export class CreateClientUseCase implements ICreateClientUseCase {
  constructor(
    private clientRepository: IClientRepository,
    private userRepository: IUserRepository,
    private slugService: ISlugService,
    private encryptionService: EncryptionService
  ) {}

  async execute(input: CreateClientInput): Promise<CreateClientResult> {
    try {
      // Validate input
      const validated = CreateClientDTO.parse(input)

      // Check if email already exists
      const existingClient = await this.clientRepository.findByEmail(validated.email)
      if (existingClient) {
        return { success: false, error: 'Email já cadastrado' }
      }

      // Generate unique slug
      const baseSlug = this.slugService.generate(validated.name)
      const existingSlugs = await this.clientRepository.getAllSlugs()
      const uniqueSlug = this.slugService.ensureUnique(baseSlug, existingSlugs)

      // Create client
      const client = await this.clientRepository.create({
        name: validated.name,
        email: validated.email,
        slug: uniqueSlug,
        status: 'active',
        monthlyBudget: validated.monthlyBudget,
        tags: validated.tags,
        portalSettings: {
          primaryColor: '#3B82F6',
          secondaryColor: '#8B5CF6',
          allowedSections: ['dashboard', 'campaigns', 'reports']
        },
        googleAds: { connected: false },
        facebookAds: { connected: false },
        googleAnalytics: { connected: false }
      })

      // Generate password
      const password = generateRandomPassword()
      const hashedPassword = await this.encryptionService.hashPassword(password)

      // Create user for client
      await this.userRepository.create({
        email: validated.email,
        password: hashedPassword,
        name: validated.name,
        role: 'client',
        clientId: client.id,
        isActive: true
      })

      return {
        success: true,
        client,
        credentials: {
          email: validated.email,
          password,
          portalUrl: `${process.env.NEXTAUTH_URL}/portal/${uniqueSlug}`
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message }
      }
      return { success: false, error: 'Erro ao criar cliente' }
    }
  }
}
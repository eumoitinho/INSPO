import { ClientCredentialsDTO, type ClientCredentialsInput } from '../dtos/client.dto'
import { IClientRepository } from '../ports/client.repository'
import { ICredentialRepository } from '../ports/credential.repository'
import { IEncryptionService } from '@ninetwodash/auth'

export interface IUpdateCredentialsUseCase {
  execute(clientId: string, input: ClientCredentialsInput): Promise<UpdateCredentialsResult>
}

export type UpdateCredentialsResult = 
  | { success: true; message: string }
  | { success: false; error: string }

export class UpdateCredentialsUseCase implements IUpdateCredentialsUseCase {
  constructor(
    private clientRepository: IClientRepository,
    private credentialRepository: ICredentialRepository,
    private encryptionService: IEncryptionService
  ) {}

  async execute(clientId: string, input: ClientCredentialsInput): Promise<UpdateCredentialsResult> {
    try {
      // Validate input
      const validated = ClientCredentialsDTO.parse(input)

      // Check if client exists
      const client = await this.clientRepository.findById(clientId)
      if (!client) {
        return { success: false, error: 'Cliente não encontrado' }
      }

      // Encrypt credentials
      const encryptedCredentials: Record<string, string> = {}
      for (const [key, value] of Object.entries(validated.credentials)) {
        encryptedCredentials[key] = this.encryptionService.encrypt(value)
      }

      // Save credentials
      await this.credentialRepository.save({
        clientId,
        platform: validated.platform,
        credentials: encryptedCredentials
      })

      // Update integration status
      const integrationField = this.mapPlatformToField(validated.platform)
      await this.clientRepository.updateIntegrationStatus(clientId, integrationField, {
        connected: true,
        lastSync: new Date()
      })

      return {
        success: true,
        message: `Credenciais ${validated.platform} salvas com sucesso`
      }
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message }
      }
      return { success: false, error: 'Erro ao salvar credenciais' }
    }
  }

  private mapPlatformToField(platform: string): 'googleAds' | 'facebookAds' | 'googleAnalytics' {
    const mapping: Record<string, 'googleAds' | 'facebookAds' | 'googleAnalytics'> = {
      'google_ads': 'googleAds',
      'facebook_ads': 'facebookAds',
      'google_analytics': 'googleAnalytics'
    }
    return mapping[platform] || 'googleAds'
  }
}
import { SignInDTO, type SignInInput } from '../dtos/auth.dto'
import { IUserRepository } from '../ports/user.repository'
import { IEncryptionService } from '../../domain/services/encryption.service'

export interface ISignInUseCase {
  execute(input: SignInInput): Promise<SignInResult>
}

export type SignInResult = 
  | { success: true; user: { id: string; email: string; name: string; role: string; clientId?: string } }
  | { success: false; error: string }

export class SignInUseCase implements ISignInUseCase {
  constructor(
    private userRepository: IUserRepository,
    private encryptionService: IEncryptionService
  ) {}

  async execute(input: SignInInput): Promise<SignInResult> {
    try {
      // Validate input
      const validated = SignInDTO.parse(input)

      // Find user by email
      const user = await this.userRepository.findByEmail(validated.email)
      if (!user) {
        return { success: false, error: 'Credenciais inválidas' }
      }

      // Verify password
      const isValidPassword = await this.encryptionService.comparePassword(
        validated.password,
        user.password
      )
      if (!isValidPassword) {
        return { success: false, error: 'Credenciais inválidas' }
      }

      // Check if user is active
      if (!user.isActive) {
        return { success: false, error: 'Usuário inativo' }
      }

      // Update last login
      await this.userRepository.updateLastLogin(user.id)

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          clientId: user.clientId
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message }
      }
      return { success: false, error: 'Erro ao realizar login' }
    }
  }
}
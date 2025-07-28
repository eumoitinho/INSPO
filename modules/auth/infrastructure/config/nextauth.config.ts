import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { SignInUseCase } from '../../application/use-cases/sign-in.use-case'
import { UserRepository } from '../repositories/user.repository'
import { EncryptionService } from '../../domain/services/encryption.service'

const encryptionKey = process.env.ENCRYPTION_KEY || 'default-key-change-in-production'
const encryptionService = new EncryptionService(encryptionKey)
const userRepository = new UserRepository()
const signInUseCase = new SignInUseCase(userRepository, encryptionService)

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e senha são obrigatórios')
        }

        const result = await signInUseCase.execute({
          email: credentials.email,
          password: credentials.password
        })

        if (result.success) {
          return {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            role: result.user.role,
            clientId: result.user.clientId || null,
            clientSlug: null,
            avatar: null,
          }
        }

        throw new Error(result.error)
      }
    })
  ],
  
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as { role?: string; clientId?: string; clientSlug?: string; avatar?: string }
        token.role = customUser.role
        token.clientId = customUser.clientId
        token.clientSlug = customUser.clientSlug
        token.avatar = customUser.avatar
      }
      return token
    },
    
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).clientId = token.clientId;
        (session.user as any).clientSlug = token.clientSlug;
        (session.user as any).avatar = token.avatar;
      }
      return session
    },
  },
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-here',
  debug: process.env.NODE_ENV === 'development',
}
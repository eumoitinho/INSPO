import { z } from 'zod'

export const SignInDTO = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  rememberMe: z.boolean().optional()
})

export type SignInInput = z.infer<typeof SignInDTO>

export const SignUpDTO = z.object({
  email: z.string().email('Email inválido'),
  password: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Senha deve conter pelo menos um número'),
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  role: z.enum(['admin', 'client']).optional(),
  clientId: z.string().optional()
})

export type SignUpInput = z.infer<typeof SignUpDTO>

export const SessionDTO = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    role: z.enum(['admin', 'client']),
    clientId: z.string().optional()
  }),
  expires: z.string()
})

export type SessionData = z.infer<typeof SessionDTO>
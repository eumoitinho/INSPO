import { z } from 'zod'

export const CreateClientDTO = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  monthlyBudget: z.number().positive('Orçamento deve ser positivo'),
  tags: z.array(z.string()).optional().default([])
})

export type CreateClientInput = z.infer<typeof CreateClientDTO>

export const UpdateClientDTO = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  monthlyBudget: z.number().positive().optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
  tags: z.array(z.string()).optional(),
  portalSettings: z.object({
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    logo: z.string().optional(),
    customDomain: z.string().optional(),
    allowedSections: z.array(z.enum(['dashboard', 'campaigns', 'reports', 'analytics'])).optional()
  }).optional()
})

export type UpdateClientInput = z.infer<typeof UpdateClientDTO>

export const ClientCredentialsDTO = z.object({
  platform: z.enum(['google_ads', 'facebook_ads', 'google_analytics']),
  credentials: z.record(z.string())
})

export type ClientCredentialsInput = z.infer<typeof ClientCredentialsDTO>

export const TestConnectionDTO = z.object({
  platform: z.enum(['google_ads', 'facebook_ads', 'google_analytics']),
  credentials: z.record(z.string())
})

export type TestConnectionInput = z.infer<typeof TestConnectionDTO>
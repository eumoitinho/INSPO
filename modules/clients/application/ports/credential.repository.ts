export interface ClientCredential {
  clientId: string
  platform: string
  credentials: Record<string, string>
  createdAt?: Date
  updatedAt?: Date
}

export interface ICredentialRepository {
  save(credential: ClientCredential): Promise<void>
  find(clientId: string, platform: string): Promise<ClientCredential | null>
  findAll(clientId: string): Promise<ClientCredential[]>
  delete(clientId: string, platform: string): Promise<boolean>
}
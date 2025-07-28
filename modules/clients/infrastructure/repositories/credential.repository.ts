import { ICredentialRepository, ClientCredential } from '../../application/ports/credential.repository'
import { connectToDatabase } from '@/infrastructure/database/mongodb/client'
import { Credential as CredentialModel } from '@/infrastructure/database/mongodb/models/credential.model'
import mongoose from 'mongoose'

export class CredentialRepository implements ICredentialRepository {
  async save(credential: ClientCredential): Promise<void> {
    await connectToDatabase()
    
    const clientObjectId = new mongoose.Types.ObjectId(credential.clientId)
    
    await CredentialModel.findOneAndUpdate(
      { 
        clientId: clientObjectId,
        platform: credential.platform 
      },
      {
        $set: {
          credentials: credential.credentials,
          updatedAt: new Date()
        },
        $setOnInsert: {
          clientId: clientObjectId,
          platform: credential.platform,
          createdAt: new Date()
        }
      },
      { upsert: true }
    )
  }

  async find(clientId: string, platform: string): Promise<ClientCredential | null> {
    await connectToDatabase()
    
    const credential = await CredentialModel.findOne({
      clientId: new mongoose.Types.ObjectId(clientId),
      platform
    }).lean()
    
    return credential ? this.mapToCredential(credential) : null
  }

  async findAll(clientId: string): Promise<ClientCredential[]> {
    await connectToDatabase()
    
    const credentials = await CredentialModel.find({
      clientId: new mongoose.Types.ObjectId(clientId)
    }).lean()
    
    return credentials.map(this.mapToCredential)
  }

  async delete(clientId: string, platform: string): Promise<boolean> {
    await connectToDatabase()
    
    const result = await CredentialModel.deleteOne({
      clientId: new mongoose.Types.ObjectId(clientId),
      platform
    })
    
    return result.deletedCount > 0
  }

  private mapToCredential(doc: any): ClientCredential {
    const credentials: Record<string, string> = {}
    
    // Convert Map to plain object
    if (doc.credentials instanceof Map) {
      doc.credentials.forEach((value: string, key: string) => {
        credentials[key] = value
      })
    } else {
      Object.assign(credentials, doc.credentials)
    }
    
    return {
      clientId: doc.clientId.toString(),
      platform: doc.platform,
      credentials,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    }
  }
}
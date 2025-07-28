#!/usr/bin/env node

/**
 * Script para criar um cliente de teste com usuário
 * Uso: node scripts/create-test-client.js
 * 
 * Cria um cliente chamado "Empresa Teste" com usuário de acesso
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '..', 'apps', 'web', '.env.local') });

// Definir os esquemas (copiados do mongodb.ts)
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'client'],
    default: 'client',
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active',
  },
  monthlyBudget: {
    type: Number,
    required: true,
  },
  tags: [String],
  
  googleAds: {
    customerId: String,
    connected: {
      type: Boolean,
      default: false,
    },
    lastSync: Date,
    encryptedCredentials: String,
  },
  
  facebookAds: {
    adAccountId: String,
    pixelId: String,
    connected: {
      type: Boolean,
      default: false,
    },
    lastSync: Date,
    encryptedCredentials: String,
  },
  
  googleAnalytics: {
    propertyId: String,
    viewId: String,
    connected: {
      type: Boolean,
      default: false,
    },
    lastSync: Date,
    encryptedCredentials: String,
  },
  
  portalSettings: {
    logoUrl: String,
    primaryColor: {
      type: String,
      default: '#3B82F6',
    },
    secondaryColor: {
      type: String,
      default: '#8B5CF6',
    },
    allowedSections: {
      type: [String],
      default: ['dashboard', 'campaigns', 'analytics', 'charts', 'reports'],
    },
    customDomain: String,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Client = mongoose.models.Client || mongoose.model('Client', ClientSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createTestClient() {
  try {
    // Conectar ao MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ninetwodash';
    console.log('🔄 Conectando ao MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB');

    // Dados do cliente teste
    const clientData = {
      name: 'Empresa Teste',
      email: 'contato@empresateste.com',
      slug: 'empresa-teste',
      status: 'active',
      monthlyBudget: 5000,
      tags: ['teste', 'demo'],
      portalSettings: {
        primaryColor: '#3B82F6',
        secondaryColor: '#8B5CF6',
        allowedSections: ['dashboard', 'campaigns', 'reports', 'analytics']
      },
      googleAds: { connected: false },
      facebookAds: { connected: false },
      googleAnalytics: { connected: false }
    };

    // Verificar se já existe
    const existingClient = await Client.findOne({ email: clientData.email });
    if (existingClient) {
      console.log('⚠️  Cliente teste já existe!');
      console.log(`   Email: ${existingClient.email}`);
      console.log(`   Portal: /portal/${existingClient.slug}`);
      
      // Verificar usuário
      const existingUser = await User.findOne({ clientId: existingClient._id });
      if (existingUser) {
        console.log(`   Usuário: ${existingUser.email}`);
      }
      
      return;
    }

    // Criar cliente
    console.log('\n📝 Criando cliente teste...');
    const client = await Client.create(clientData);
    console.log('✅ Cliente criado com sucesso!');

    // Dados do usuário
    const password = 'cliente123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userData = {
      email: 'usuario@empresateste.com',
      password: hashedPassword,
      name: 'Usuário Teste',
      role: 'client',
      clientId: client._id,
      isActive: true
    };

    // Criar usuário
    console.log('\n🔐 Criando usuário de acesso...');
    const user = await User.create(userData);
    console.log('✅ Usuário criado com sucesso!');

    // Exibir informações
    console.log('\n========================================');
    console.log('🎉 CLIENTE DE TESTE CRIADO COM SUCESSO!');
    console.log('========================================\n');
    
    console.log('📊 Informações do Cliente:');
    console.log(`   Nome: ${client.name}`);
    console.log(`   Email: ${client.email}`);
    console.log(`   Slug: ${client.slug}`);
    console.log(`   Orçamento: R$ ${client.monthlyBudget.toLocaleString('pt-BR')}`);
    console.log(`   Tags: ${client.tags.join(', ')}`);
    
    console.log('\n👤 Informações de Login:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Senha: ${password}`);
    console.log(`   Portal: http://localhost:3000/portal/${client.slug}`);
    
    console.log('\n📱 Como acessar:');
    console.log('   1. Acesse http://localhost:3000/login');
    console.log(`   2. Use o email: ${user.email}`);
    console.log(`   3. Use a senha: ${password}`);
    console.log('   4. Você será redirecionado para o portal do cliente');

    // Criar mais alguns clientes de teste
    console.log('\n🔄 Criando clientes adicionais para demonstração...');
    
    const additionalClients = [
      {
        name: 'Motin Films',
        email: 'contato@motinfilms.com',
        slug: 'motin-films',
        monthlyBudget: 10000,
        tags: ['produtora', 'video', 'premium']
      },
      {
        name: 'Tech Solutions',
        email: 'contato@techsolutions.com',
        slug: 'tech-solutions',
        monthlyBudget: 7500,
        tags: ['tecnologia', 'b2b', 'saas']
      },
      {
        name: 'Fashion Store',
        email: 'contato@fashionstore.com',
        slug: 'fashion-store',
        monthlyBudget: 3500,
        tags: ['ecommerce', 'moda', 'varejo']
      }
    ];

    for (const clientInfo of additionalClients) {
      const exists = await Client.findOne({ email: clientInfo.email });
      if (!exists) {
        const newClient = await Client.create({
          ...clientInfo,
          status: 'active',
          portalSettings: clientData.portalSettings,
          googleAds: { connected: Math.random() > 0.5 },
          facebookAds: { connected: Math.random() > 0.5 },
          googleAnalytics: { connected: Math.random() > 0.5 }
        });
        
        // Criar usuário para o cliente
        const userEmail = clientInfo.email.replace('contato@', 'usuario@');
        await User.create({
          email: userEmail,
          password: hashedPassword,
          name: `Usuário ${clientInfo.name}`,
          role: 'client',
          clientId: newClient._id,
          isActive: true
        });
        
        console.log(`✓ ${clientInfo.name} criado (${userEmail} / cliente123)`);
      }
    }

  } catch (error) {
    console.error('❌ Erro ao criar cliente teste:', error);
  } finally {
    // Desconectar do MongoDB
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado do MongoDB');
  }
}

// Executar
createTestClient();
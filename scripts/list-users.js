#!/usr/bin/env node

/**
 * Script para listar todos os usuários do sistema
 * Uso: node scripts/list-users.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '..', 'apps', 'web', '.env.local') });

// Definir o esquema do usuário
const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  role: String,
  clientId: mongoose.Schema.Types.ObjectId,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date,
});

const ClientSchema = new mongoose.Schema({
  name: String,
  slug: String,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Client = mongoose.models.Client || mongoose.model('Client', ClientSchema);

async function listUsers() {
  try {
    // Conectar ao MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ninetwodash';
    console.log('🔄 Conectando ao MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB\n');

    // Buscar todos os usuários
    const users = await User.find().lean();
    
    if (users.length === 0) {
      console.log('⚠️  Nenhum usuário encontrado no banco de dados');
      return;
    }

    console.log(`📊 Total de usuários: ${users.length}\n`);

    // Separar por tipo
    const admins = users.filter(u => u.role === 'admin');
    const clients = users.filter(u => u.role === 'client');

    // Listar administradores
    if (admins.length > 0) {
      console.log('👔 ADMINISTRADORES:');
      console.log('==================');
      for (const admin of admins) {
        console.log(`Email: ${admin.email}`);
        console.log(`Nome: ${admin.name}`);
        console.log(`Ativo: ${admin.isActive ? 'Sim' : 'Não'}`);
        console.log(`Último login: ${admin.lastLogin ? new Date(admin.lastLogin).toLocaleString('pt-BR') : 'Nunca'}`);
        console.log('---');
      }
      console.log('');
    }

    // Listar clientes
    if (clients.length > 0) {
      console.log('👥 CLIENTES:');
      console.log('============');
      for (const client of clients) {
        console.log(`Email: ${client.email}`);
        console.log(`Nome: ${client.name}`);
        console.log(`Ativo: ${client.isActive ? 'Sim' : 'Não'}`);
        
        // Buscar dados da empresa
        if (client.clientId) {
          const company = await Client.findById(client.clientId).lean();
          if (company) {
            console.log(`Empresa: ${company.name}`);
            console.log(`Portal: /portal/${company.slug}`);
          }
        }
        
        console.log(`Último login: ${client.lastLogin ? new Date(client.lastLogin).toLocaleString('pt-BR') : 'Nunca'}`);
        console.log('---');
      }
    }

    console.log('\n💡 Dica: A senha padrão para clientes é "cliente123"');

  } catch (error) {
    console.error('❌ Erro ao listar usuários:', error);
  } finally {
    // Desconectar do MongoDB
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado do MongoDB');
  }
}

// Executar
listUsers();
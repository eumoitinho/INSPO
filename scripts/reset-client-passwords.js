#!/usr/bin/env node

/**
 * Script para resetar a senha de todos os clientes
 * Uso: node scripts/reset-client-passwords.js
 * 
 * ATENÇÃO: Este script deve ser usado apenas em desenvolvimento!
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '..', 'apps', 'web', '.env.local') });

// Definir o esquema do usuário (deve corresponder ao seu schema)
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

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function resetClientPasswords() {
  try {
    // Conectar ao MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ninetwodash';
    console.log('🔄 Conectando ao MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB');

    // Nova senha
    const newPassword = 'cliente123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Buscar todos os usuários com role 'client'
    const clients = await User.find({ role: 'client' });
    console.log(`\n📊 Encontrados ${clients.length} clientes`);

    if (clients.length === 0) {
      console.log('⚠️  Nenhum cliente encontrado no banco de dados');
      return;
    }

    // Atualizar senha de cada cliente
    console.log('\n🔐 Atualizando senhas...\n');
    
    for (const client of clients) {
      await User.updateOne(
        { _id: client._id },
        { 
          $set: { 
            password: hashedPassword,
            updatedAt: new Date()
          }
        }
      );
      
      console.log(`✓ ${client.email} - senha atualizada para: ${newPassword}`);
    }

    console.log('\n✅ Todas as senhas foram atualizadas com sucesso!');
    console.log('\n📝 Informações de login:');
    console.log('   Email: [email do cliente]');
    console.log('   Senha: cliente123');
    
    // Listar todos os clientes atualizados
    console.log('\n📋 Lista de clientes atualizados:');
    console.log('================================');
    
    for (const client of clients) {
      console.log(`Email: ${client.email}`);
      console.log(`Nome: ${client.name}`);
      if (client.clientId) {
        console.log(`Cliente ID: ${client.clientId}`);
      }
      console.log('--------------------------------');
    }

  } catch (error) {
    console.error('❌ Erro ao resetar senhas:', error);
  } finally {
    // Desconectar do MongoDB
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado do MongoDB');
  }
}

// Confirmação antes de executar
console.log('⚠️  ATENÇÃO: Este script irá alterar a senha de TODOS os clientes!');
console.log('⚠️  Use apenas em ambiente de desenvolvimento!\n');

// Executar diretamente
resetClientPasswords();
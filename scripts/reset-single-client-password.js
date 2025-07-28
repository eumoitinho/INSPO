#!/usr/bin/env node

/**
 * Script para resetar a senha de um cliente específico
 * Uso: node scripts/reset-single-client-password.js [email]
 * 
 * Exemplo: node scripts/reset-single-client-password.js cliente@exemplo.com
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '..', 'apps', 'web', '.env.local') });

// Definir os esquemas
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
  name: String,
  slug: String,
  email: String
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Client = mongoose.models.Client || mongoose.model('Client', ClientSchema);

async function resetSingleClientPassword(email) {
  try {
    // Validar email
    if (!email) {
      console.error('❌ Por favor, forneça o email do cliente');
      console.log('\nUso: node scripts/reset-single-client-password.js [email]');
      console.log('Exemplo: node scripts/reset-single-client-password.js cliente@exemplo.com');
      return;
    }

    // Conectar ao MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ninetwodash';
    console.log('🔄 Conectando ao MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB');

    // Buscar usuário
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      console.error(`❌ Usuário com email "${email}" não encontrado`);
      return;
    }

    if (user.role !== 'client') {
      console.error(`❌ O usuário "${email}" não é um cliente (role: ${user.role})`);
      return;
    }

    // Nova senha
    const newPassword = 'cliente123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Atualizar senha
    await User.updateOne(
      { _id: user._id },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );
    
    console.log('\n✅ Senha atualizada com sucesso!');
    console.log('\n📝 Informações de login:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Senha: ${newPassword}`);
    console.log(`   Nome: ${user.name}`);
    
    // Se tiver clientId, buscar informações do cliente
    if (user.clientId) {
      const client = await Client.findById(user.clientId);
      
      if (client) {
        console.log(`   Empresa: ${client.name}`);
        console.log(`   Portal: /portal/${client.slug}`);
      }
    }

  } catch (error) {
    console.error('❌ Erro ao resetar senha:', error);
  } finally {
    // Desconectar do MongoDB
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado do MongoDB');
  }
}

// Pegar email do argumento da linha de comando
const email = process.argv[2];

// Executar
resetSingleClientPassword(email);
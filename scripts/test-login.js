#!/usr/bin/env node

/**
 * Script para testar login e verificar hash de senha
 * Uso: node scripts/test-login.js [email]
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config({ path: path.join(__dirname, '..', 'apps', 'web', '.env.local') });

// Definir o esquema do usuário
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
  clientId: mongoose.Schema.Types.ObjectId,
  isActive: Boolean,
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function testLogin(email) {
  try {
    // Conectar ao MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ninetwodash';
    console.log('🔄 Conectando ao MongoDB...');
    
    await mongoose.connect(mongoUri);
    console.log('✅ Conectado ao MongoDB\n');

    // Email para testar
    const testEmail = email || 'admin@ninetwodash.com';
    
    // Buscar usuário
    const user = await User.findOne({ email: testEmail });
    
    if (!user) {
      console.log(`❌ Usuário ${testEmail} não encontrado`);
      return;
    }

    console.log(`📧 Email: ${user.email}`);
    console.log(`👤 Nome: ${user.name}`);
    console.log(`🔑 Role: ${user.role}`);
    console.log(`✅ Ativo: ${user.isActive}`);
    console.log(`🔐 Hash atual: ${user.password ? user.password.substring(0, 20) + '...' : 'SENHA VAZIA!'}`);
    
    // Testar algumas senhas comuns
    const testPasswords = ['cliente123', 'admin123', '123456', 'password'];
    
    console.log('\n🔍 Testando senhas...');
    for (const pwd of testPasswords) {
      if (user.password) {
        const match = await bcrypt.compare(pwd, user.password);
        if (match) {
          console.log(`✅ SENHA CORRETA: ${pwd}`);
          return;
        } else {
          console.log(`❌ ${pwd} - incorreta`);
        }
      }
    }
    
    console.log('\n⚠️  Nenhuma senha padrão funcionou!');
    console.log('💡 Vamos resetar a senha para "cliente123"...\n');
    
    // Resetar senha
    const newPassword = 'cliente123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await User.updateOne(
      { _id: user._id },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    );
    
    console.log('✅ Senha resetada com sucesso!');
    console.log(`📧 Email: ${user.email}`);
    console.log(`🔑 Nova senha: ${newPassword}`);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Desconectado do MongoDB');
  }
}

// Pegar email do argumento
const email = process.argv[2];

// Executar
testLogin(email);
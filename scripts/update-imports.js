#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'

// Mapeamento de imports antigos para novos
const importMappings = {
  // Auth
  '@/lib/auth': '@ninetwodash/auth',
  '../../../lib/auth': '@ninetwodash/auth',
  '../../lib/auth': '@ninetwodash/auth',
  '../lib/auth': '@ninetwodash/auth',
  
  // Encryption
  '@/lib/encryption': '@ninetwodash/auth',
  
  // MongoDB
  '@/lib/mongodb': '@/infrastructure/database/mongodb/client',
  
  // UI Components
  '@/components/ui/': '@ninetwodash/ui/',
  '../components/ui/': '@ninetwodash/ui/',
  '../../components/ui/': '@ninetwodash/ui/',
  
  // Types
  '@/types/': '@ninetwodash/shared/types/',
  '../types/': '@ninetwodash/shared/types/',
  
  // Utils
  '@/lib/utils': '@ninetwodash/shared/utils/utils',
  
  // Client related
  '@/lib/api/clients': '@ninetwodash/clients',
  '@/lib/db/models/Client': '@/infrastructure/database/mongodb/models/client.model',
  
  // Integrations
  '@/lib/google-ads': '@ninetwodash/integrations',
  '@/lib/facebook-ads': '@ninetwodash/integrations',
  '@/lib/google-analytics': '@ninetwodash/integrations',
}

// Função para atualizar imports em um arquivo
async function updateFileImports(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf-8')
    let hasChanges = false
    
    // Atualiza cada import
    for (const [oldImport, newImport] of Object.entries(importMappings)) {
      const regex = new RegExp(
        `(import\\s+.*?\\s+from\\s+['"])${escapeRegex(oldImport)}(['"])`,
        'g'
      )
      
      if (content.match(regex)) {
        content = content.replace(regex, `$1${newImport}$2`)
        hasChanges = true
      }
      
      // Também verifica require statements
      const requireRegex = new RegExp(
        `(require\\(['"])${escapeRegex(oldImport)}(['"]\\))`,
        'g'
      )
      
      if (content.match(requireRegex)) {
        content = content.replace(requireRegex, `$1${newImport}$2`)
        hasChanges = true
      }
    }
    
    // Atualiza imports relativos de UI components
    const uiRegex = /(import\s+.*?\s+from\s+['"])(?:\.\.\/)*components\/ui\/([^'"]+)(['"])/g
    if (content.match(uiRegex)) {
      content = content.replace(uiRegex, '$1@ninetwodash/ui/$2$3')
      hasChanges = true
    }
    
    if (hasChanges) {
      await fs.writeFile(filePath, content)
      console.log(`✓ Updated: ${path.relative(process.cwd(), filePath)}`)
      return true
    }
    
    return false
  } catch (error) {
    console.error(`✗ Error updating ${filePath}:`, error.message)
    return false
  }
}

// Função auxiliar para escapar regex
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Função principal
async function main() {
  const targetDir = process.argv[2] || 'apps/web/src'
  
  console.log(`Updating imports in ${targetDir}...`)
  
  // Encontra todos os arquivos TypeScript e JavaScript
  const files = await glob(`${targetDir}/**/*.{ts,tsx,js,jsx}`, {
    ignore: ['**/node_modules/**', '**/.next/**']
  })
  
  console.log(`Found ${files.length} files to process`)
  
  let updatedCount = 0
  
  for (const file of files) {
    const updated = await updateFileImports(file)
    if (updated) updatedCount++
  }
  
  console.log(`\n✅ Updated ${updatedCount} files`)
  
  // Sugestões adicionais
  if (updatedCount > 0) {
    console.log('\n📝 Next steps:')
    console.log('1. Run TypeScript check: pnpm typecheck')
    console.log('2. Run build to verify: pnpm build')
    console.log('3. Fix any remaining import issues manually')
  }
}

// Executa o script
main().catch(console.error)
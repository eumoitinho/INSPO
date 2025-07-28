#!/usr/bin/env node
import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'

// Analyze: Extrai informações do código
async function analyzeModule(modulePath) {
  const files = await glob(`${modulePath}/**/*.{ts,tsx}`)
  const analysis = {
    module: path.basename(modulePath),
    structure: {},
    dependencies: new Set(),
    patterns: []
  }

  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8')
    
    // Detecta camada DDD
    const layer = file.includes('/domain/') ? 'domain' :
                  file.includes('/application/') ? 'application' :
                  file.includes('/infrastructure/') ? 'infrastructure' :
                  'presentation'
    
    analysis.structure[layer] = (analysis.structure[layer] || 0) + 1
    
    // Extrai imports
    const imports = content.match(/import .* from ['"](.+)['"]/g) || []
    imports.forEach(imp => {
      const match = imp.match(/from ['"](.+)['"]/)
      if (match && !match[1].startsWith('.')) {
        analysis.dependencies.add(match[1])
      }
    })
    
    // Detecta patterns
    if (content.includes('Repository')) analysis.patterns.push('Repository')
    if (content.includes('UseCase')) analysis.patterns.push('UseCase')
    if (content.includes('Factory')) analysis.patterns.push('Factory')
    if (content.includes('Service')) analysis.patterns.push('Service')
    if (content.includes('Entity')) analysis.patterns.push('Entity')
    if (content.includes('ValueObject')) analysis.patterns.push('ValueObject')
  }

  // Remove duplicates from patterns
  analysis.patterns = [...new Set(analysis.patterns)]

  return analysis
}

// Compress: Gera resumo para IA
async function compressContext(modulePath) {
  const contextFile = path.join(modulePath, '.context.md')
  const analysis = await analyzeModule(modulePath)
  
  const compressed = {
    module: analysis.module,
    purpose: await extractPurpose(contextFile),
    structure: analysis.structure,
    mainDependencies: Array.from(analysis.dependencies).slice(0, 10),
    patterns: analysis.patterns,
    conventions: await extractConventions(contextFile)
  }

  // Salva versão comprimida
  await fs.writeFile(
    path.join(modulePath, '.context.compressed.json'),
    JSON.stringify(compressed, null, 2)
  )

  return compressed
}

// Generate: Cria .context.md base
async function generateContext(modulePath) {
  const analysis = await analyzeModule(modulePath)
  const moduleName = path.basename(modulePath)
  
  const context = `# ${capitalizeFirst(moduleName)} Domain Context

## Visão
[Descreva o propósito principal deste módulo]

## Responsabilidades
- [Responsabilidade 1]
- [Responsabilidade 2]
- [Responsabilidade 3]

## Estrutura
${Object.entries(analysis.structure)
  .map(([layer, count]) => `- \`${layer}/\`: ${count} arquivos`)
  .join('\n')}

## Patterns Identificados
${analysis.patterns.map(p => `- ${p} Pattern`).join('\n')}

## Convenções
- [Convenção 1]
- [Convenção 2]

## Dependências Principais
${Array.from(analysis.dependencies)
  .slice(0, 5)
  .map(d => `- ${d}`)
  .join('\n')}

## Problemas Comuns
- [Problema 1]: [Solução]
- [Problema 2]: [Solução]`

  await fs.writeFile(
    path.join(modulePath, '.context.md'),
    context
  )

  return context
}

// Helpers
async function extractPurpose(contextFile) {
  try {
    const content = await fs.readFile(contextFile, 'utf-8')
    const match = content.match(/## Visão\n(.+)/)
    return match ? match[1] : 'No purpose defined'
  } catch {
    return 'Context file not found'
  }
}

async function extractConventions(contextFile) {
  try {
    const content = await fs.readFile(contextFile, 'utf-8')
    const match = content.match(/## Convenções\n([\s\S]+?)##/)
    return match ? match[1].trim().split('\n').map(l => l.replace('- ', '')) : []
  } catch {
    return []
  }
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// CLI
const command = process.argv[2]
const target = process.argv[3]

if (!command || !target) {
  console.log(`
Usage: node context-tools.js [command] <module-path>

Commands:
  analyze    - Analyze module structure and patterns
  compress   - Generate compressed context for AI
  generate   - Generate base .context.md file

Example:
  node context-tools.js analyze modules/auth
  node context-tools.js compress modules/clients
  node context-tools.js generate modules/campaigns
`)
  process.exit(1)
}

try {
  switch (command) {
    case 'analyze':
      const analysisResult = await analyzeModule(target)
      console.log(JSON.stringify(analysisResult, null, 2))
      break
      
    case 'compress':
      const compressResult = await compressContext(target)
      console.log(`Compressed context saved for: ${compressResult.module}`)
      console.log(JSON.stringify(compressResult, null, 2))
      break
      
    case 'generate':
      await generateContext(target)
      console.log(`Generated .context.md for: ${path.basename(target)}`)
      break
      
    default:
      console.error(`Unknown command: ${command}`)
      process.exit(1)
  }
} catch (error) {
  console.error(`Error: ${error.message}`)
  process.exit(1)
}
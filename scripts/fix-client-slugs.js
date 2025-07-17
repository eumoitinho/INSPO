const { MongoClient } = require('mongodb');

async function fixClientSlugs() {
  const uri = process.env.DATABASE_URL;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Conectado ao MongoDB');

    const db = client.db();
    const clientsCollection = db.collection('clients');

    // Buscar todos os clientes
    const clients = await clientsCollection.find({}).toArray();
    console.log(`📊 Encontrados ${clients.length} clientes`);

    let updatedCount = 0;
    let errorCount = 0;

    for (const client of clients) {
      try {
        // Verificar se o slug está definido
        if (!client.slug || client.slug === 'undefined' || client.slug === 'null') {
          // Gerar slug baseado no nome
          const slug = client.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();

          // Verificar se o slug já existe
          const existingClient = await clientsCollection.findOne({ slug });
          if (existingClient && existingClient._id.toString() !== client._id.toString()) {
            // Adicionar timestamp para tornar único
            const uniqueSlug = `${slug}-${Date.now()}`;
            await clientsCollection.updateOne(
              { _id: client._id },
              { $set: { slug: uniqueSlug, updatedAt: new Date() } }
            );
            console.log(`✅ Cliente "${client.name}" atualizado com slug: ${uniqueSlug}`);
          } else {
            await clientsCollection.updateOne(
              { _id: client._id },
              { $set: { slug, updatedAt: new Date() } }
            );
            console.log(`✅ Cliente "${client.name}" atualizado com slug: ${slug}`);
          }
          updatedCount++;
        } else {
          console.log(`ℹ️ Cliente "${client.name}" já tem slug válido: ${client.slug}`);
        }
      } catch (error) {
        console.error(`❌ Erro ao processar cliente "${client.name}":`, error.message);
        errorCount++;
      }
    }

    console.log(`\n📈 Resumo:`);
    console.log(`✅ ${updatedCount} clientes atualizados`);
    console.log(`❌ ${errorCount} erros encontrados`);

  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
  } finally {
    await client.close();
  }
}

// Executar o script
fixClientSlugs().catch(console.error); 
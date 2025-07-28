const { connectToDatabase, Client } = require('../apps/web/src/lib/mongodb');

async function checkClientConnections(clientId) {
  try {
    await connectToDatabase();
    
    const client = await Client.findById(clientId);
    
    if (!client) {
      console.log('Cliente não encontrado!');
      return;
    }
    
    console.log(`\nCliente: ${client.name} (${client._id})`);
    console.log('\n=== Status das Conexões ===');
    
    // Google Ads
    console.log('\nGoogle Ads:');
    console.log('- connected:', client.googleAds?.connected || false);
    console.log('- customerId:', client.googleAds?.customerId || 'N/A');
    console.log('- lastSync:', client.googleAds?.lastSync || 'N/A');
    console.log('- hasCredentials:', !!client.googleAds?.credentials);
    
    // Facebook Ads
    console.log('\nFacebook Ads:');
    console.log('- connected:', client.facebookAds?.connected || false);
    console.log('- adAccountId:', client.facebookAds?.adAccountId || 'N/A');
    console.log('- pixelId:', client.facebookAds?.pixelId || 'N/A');
    console.log('- lastSync:', client.facebookAds?.lastSync || 'N/A');
    console.log('- hasCredentials:', !!client.facebookAds?.credentials);
    
    // Google Analytics
    console.log('\nGoogle Analytics:');
    console.log('- connected:', client.googleAnalytics?.connected || false);
    console.log('- propertyId:', client.googleAnalytics?.propertyId || 'N/A');
    console.log('- lastSync:', client.googleAnalytics?.lastSync || 'N/A');
    console.log('- hasCredentials:', !!client.googleAnalytics?.credentials);
    
    console.log('\n=== Estrutura completa dos dados ===');
    console.log(JSON.stringify({
      googleAds: client.googleAds,
      facebookAds: client.facebookAds,
      googleAnalytics: client.googleAnalytics
    }, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

// Pegar o clientId do argumento
const clientId = process.argv[2];

if (!clientId) {
  console.log('Uso: node check-client-connections.js <clientId>');
  console.log('Exemplo: node check-client-connections.js 68774640d826d4e6ecb645d7');
  process.exit(1);
}

checkClientConnections(clientId);
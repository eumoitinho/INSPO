import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Meta Test Request Body:', body);
    
    // Usuario só informa o Ad Account ID
    const adAccountId = body.adAccountId || body.credentials?.adAccountId;
    
    // Credenciais vêm do .env (suas credenciais de API)
    const appId = process.env.FACEBOOK_APP_ID;
    const appSecret = process.env.FACEBOOK_APP_SECRET;
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;

    if (!adAccountId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Ad Account ID é obrigatório',
          details: 'Informe o Ad Account ID do Meta'
        },
        { status: 400 }
      );
    }

    // Verificar se as credenciais estão configuradas no .env
    if (!appId || !appSecret || !accessToken) {
      return NextResponse.json({
        success: false,
        error: 'Credenciais do Meta não configuradas',
        details: 'Configure FACEBOOK_* no .env.local'
      }, { status: 500 });
    }

    // Tentar conexão real com Meta
    try {
      // Testar conexão com Meta Marketing API
      const testUrl = `https://graph.facebook.com/v18.0/me?access_token=${accessToken}`;
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Meta API Error: ${errorData.error?.message || 'Conexão falhou'}`);
      }

      const userData = await response.json();

      // Testar acesso às campanhas da conta específica
      const campaignsUrl = `https://graph.facebook.com/v18.0/act_${adAccountId}/campaigns?fields=id,name,status&limit=1&access_token=${accessToken}`;
      const campaignsResponse = await fetch(campaignsUrl);
      
      let campaignData = null;
      if (campaignsResponse.ok) {
        const campaignsData = await campaignsResponse.json();
        campaignData = {
          success: true,
          campaignCount: campaignsData.data?.length || 0
        };
      } else {
        campaignData = {
          success: false,
          error: 'Não foi possível acessar campanhas'
        };
      }

      return NextResponse.json({
        success: true,
        message: 'Conexão com Meta estabelecida com sucesso',
        data: {
          adAccountId,
          user: {
            id: userData.id,
            name: userData.name
          },
          campaignTest: campaignData
        },
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao conectar com Meta',
        details: error.message
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erro ao testar conexão Meta:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Falha na conexão com Meta',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Use POST para testar conexão Meta',
      requiredFields: ['appId', 'appSecret', 'accessToken'],
      optionalFields: ['adAccountId']
    },
    { status: 405 }
  );
}
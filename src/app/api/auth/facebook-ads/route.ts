import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, Client } from '@/lib/mongodb';

/**
 * GET /api/auth/facebook-ads?clientSlug=client-name
 * Inicia o fluxo OAuth para Facebook Ads
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientSlug = searchParams.get('clientSlug');

    if (!clientSlug) {
      return NextResponse.json({
        error: 'CLIENT_SLUG_REQUIRED',
        message: 'Client slug é obrigatório'
      }, { status: 400 });
    }

    // Verificar se o cliente existe
    await connectToDatabase();
    const client = await (Client as any).findOne({ slug: clientSlug });

    if (!client) {
      return NextResponse.json({
        error: 'CLIENT_NOT_FOUND',
        message: 'Cliente não encontrado'
      }, { status: 404 });
    }

    // Validar configuração do Facebook
    if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
      return NextResponse.json({
        error: 'FACEBOOK_CONFIG_MISSING',
        message: 'Configuração do Facebook não encontrada'
      }, { status: 500 });
    }

    // Gerar URL de autorização para Facebook Ads
    const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/facebook-ads/callback`;
    const scope = 'ads_management,ads_read,read_insights,business_management';
    
    const authUrl = new URL('https://www.facebook.com/v19.0/dialog/oauth');
    authUrl.searchParams.append('client_id', process.env.FACEBOOK_APP_ID);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('scope', scope);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('state', clientSlug);

    return NextResponse.json({
      success: true,
      authUrl: authUrl.toString(),
      message: 'Redirecione o usuário para a URL de autorização do Facebook Ads'
    });

  } catch (error: any) {
    console.error('Erro ao iniciar OAuth Facebook Ads:', error);
    
    return NextResponse.json({
      error: 'OAUTH_INIT_ERROR',
      message: error.message || 'Erro ao iniciar autorização'
    }, { status: 500 });
  }
}

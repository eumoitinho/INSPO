import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { connectToDatabase, findClientBySlug } from '@/lib/mongodb';

// OAuth2 setup for Google Ads
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_ADS_CLIENT_ID,
  process.env.GOOGLE_ADS_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/auth/google-ads/callback`
);

/**
 * GET /api/auth/google-ads?clientSlug=client-name
 * Inicia o fluxo OAuth para Google Ads
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

    await connectToDatabase();
    
    // Verificar se o cliente existe no banco de dados
    const client = await findClientBySlug(clientSlug);

    if (!client) {
      return NextResponse.json({
        error: 'CLIENT_NOT_FOUND',
        message: 'Cliente não encontrado'
      }, { status: 404 });
    }

    // Gerar URL de autorização para Google Ads
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/adwords'
      ],
      state: clientSlug, // Passar o client slug no state para recuperar no callback
      prompt: 'consent' // Força a tela de consentimento para garantir refresh token
    });

    return NextResponse.json({
      success: true,
      authUrl,
      message: 'Redirecione o usuário para a URL de autorização do Google Ads'
    });

  } catch (error: any) {
    console.error('Erro ao iniciar OAuth Google Ads:', error);
    
    return NextResponse.json({
      error: 'OAUTH_INIT_ERROR',
      message: error.message || 'Erro ao iniciar autorização'
    }, { status: 500 });
  }
}
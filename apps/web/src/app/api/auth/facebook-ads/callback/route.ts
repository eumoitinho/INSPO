import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, Client } from '@/lib/mongodb';
import { encryptData } from '@/lib/encryption';
import { validateFacebookToken } from '@/lib/facebook-ads';

/**
 * GET /api/auth/facebook-ads/callback?code=...&state=client-slug
 * Callback do OAuth para Facebook Ads
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // client slug
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    // Verificar se houve erro no OAuth
    if (error) {
      console.error('Facebook OAuth error:', error, errorDescription);
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/clients?error=facebook_oauth_error&message=${encodeURIComponent(errorDescription || error)}`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/clients?error=missing_parameters&message=Código ou estado ausente`
      );
    }

    // Validar configuração do Facebook
    if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/clients?error=facebook_config_missing&message=Configuração do Facebook não encontrada`
      );
    }

    // Trocar código por access token
    const tokenUrl = new URL('https://graph.facebook.com/v19.0/oauth/access_token');
    tokenUrl.searchParams.append('client_id', process.env.FACEBOOK_APP_ID);
    tokenUrl.searchParams.append('client_secret', process.env.FACEBOOK_APP_SECRET);
    tokenUrl.searchParams.append('redirect_uri', `${process.env.NEXTAUTH_URL}/api/auth/facebook-ads/callback`);
    tokenUrl.searchParams.append('code', code);

    const tokenResponse = await fetch(tokenUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      console.error('Facebook token exchange error:', errorData);
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/clients?error=token_exchange_failed&message=Falha ao trocar código por token`
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Validar token
    const isValidToken = await validateFacebookToken(accessToken);
    if (!isValidToken) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/clients?error=invalid_token&message=Token do Facebook inválido`
      );
    }

    // Conectar ao banco e buscar cliente
    await connectToDatabase();
    const client = await (Client as any).findOne({ slug: state });

    if (!client) {
      return NextResponse.redirect(
        `${process.env.NEXTAUTH_URL}/clients?error=client_not_found&message=Cliente não encontrado`
      );
    }

    // Obter informações do usuário e contas de anúncios
    const userResponse = await fetch(`https://graph.facebook.com/v19.0/me?access_token=${accessToken}&fields=id,name,email`);
    const userData = await userResponse.json();

    const accountsResponse = await fetch(`https://graph.facebook.com/v19.0/me/adaccounts?access_token=${accessToken}&fields=id,name,account_status`);
    const accountsData = await accountsResponse.json();

    // Salvar credenciais criptografadas
    const credentials = {
      accessToken,
      tokenType: tokenData.token_type || 'bearer',
      expiresIn: tokenData.expires_in,
      user: userData,
      accounts: accountsData.data || [],
      obtainedAt: new Date().toISOString(),
    };

    const encryptedCredentials = encryptData(JSON.stringify(credentials));

    // Atualizar cliente com as credenciais do Facebook
    await (Client as any).updateOne(
      { slug: state },
      {
        $set: {
          'facebookAds.credentials': encryptedCredentials,
          'facebookAds.connected': true,
          'facebookAds.lastSync': new Date(),
          'facebookAds.user': userData,
          'facebookAds.accounts': accountsData.data || [],
          updatedAt: new Date(),
        },
      }
    );

    console.log(`Facebook Ads OAuth successful for client: ${state}`);

    // Redirecionar para página de sucesso
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/clients?success=facebook_connected&message=Facebook Ads conectado com sucesso`
    );

  } catch (error: any) {
    console.error('Facebook OAuth callback error:', error);
    
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/clients?error=oauth_callback_error&message=${encodeURIComponent(error.message || 'Erro no callback do OAuth')}`
    );
  }
}

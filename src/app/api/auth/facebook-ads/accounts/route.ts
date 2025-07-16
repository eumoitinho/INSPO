import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, Client } from '@/lib/mongodb';
import { decryptData } from '@/lib/encryption';
import type { APIResponse } from '@/types/dashboard';

/**
 * GET /api/auth/facebook-ads/accounts?clientSlug=client-name
 * Listar contas de anúncios do Facebook para um cliente
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientSlug = searchParams.get('clientSlug');

    if (!clientSlug) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'CLIENT_SLUG_REQUIRED',
        message: 'Client slug é obrigatório',
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    // Conectar ao banco e buscar cliente
    await connectToDatabase();
    const client = await (Client as any).findOne({ slug: clientSlug });

    if (!client) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'CLIENT_NOT_FOUND',
        message: 'Cliente não encontrado',
        timestamp: new Date().toISOString(),
      }, { status: 404 });
    }

    // Verificar se o Facebook Ads está conectado
    if (!client.facebookAds?.credentials) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'FACEBOOK_NOT_CONNECTED',
        message: 'Facebook Ads não conectado para este cliente',
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    // Descriptografar credenciais
    const credentials = JSON.parse(decryptData(client.facebookAds.credentials));

    // Buscar contas de anúncios atualizadas
    const accountsResponse = await fetch(
      `https://graph.facebook.com/v19.0/me/adaccounts?access_token=${credentials.accessToken}&fields=id,name,account_status,currency,business_country_code,timezone_name`
    );

    if (!accountsResponse.ok) {
      const errorData = await accountsResponse.json().catch(() => ({}));
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'FACEBOOK_API_ERROR',
        message: `Erro ao buscar contas: ${errorData.error?.message || 'Erro desconhecido'}`,
        timestamp: new Date().toISOString(),
      }, { status: 500 });
    }

    const accountsData = await accountsResponse.json();
    const accounts = accountsData.data || [];

    // Atualizar contas no banco
    await (Client as any).updateOne(
      { slug: clientSlug },
      {
        $set: {
          'facebookAds.accounts': accounts,
          'facebookAds.lastSync': new Date(),
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json<APIResponse<any[]>>({
      success: true,
      data: accounts,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Error fetching Facebook Ads accounts:', error);
    
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: 'FACEBOOK_ACCOUNTS_ERROR',
      message: error.message || 'Erro ao buscar contas do Facebook Ads',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

/**
 * POST /api/auth/facebook-ads/accounts
 * Configurar conta de anúncios do Facebook para um cliente
 */
export async function POST(request: NextRequest) {
  try {
    const { clientSlug, accountId, pixelId } = await request.json();

    if (!clientSlug || !accountId) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'MISSING_PARAMETERS',
        message: 'Client slug e account ID são obrigatórios',
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    // Conectar ao banco e buscar cliente
    await connectToDatabase();
    const client = await (Client as any).findOne({ slug: clientSlug });

    if (!client) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'CLIENT_NOT_FOUND',
        message: 'Cliente não encontrado',
        timestamp: new Date().toISOString(),
      }, { status: 404 });
    }

    // Verificar se o Facebook Ads está conectado
    if (!client.facebookAds?.credentials) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'FACEBOOK_NOT_CONNECTED',
        message: 'Facebook Ads não conectado para este cliente',
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    // Verificar se a conta existe nas contas disponíveis
    const availableAccounts = client.facebookAds.accounts || [];
    const selectedAccount = availableAccounts.find((acc: any) => acc.id === `act_${accountId}` || acc.id === accountId);

    if (!selectedAccount) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'ACCOUNT_NOT_FOUND',
        message: 'Conta de anúncios não encontrada nas contas disponíveis',
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    // Extrair o ID da conta (remover prefixo "act_" se existir)
    const cleanAccountId = accountId.replace('act_', '');

    // Atualizar configuração do Facebook Ads
    await (Client as any).updateOne(
      { slug: clientSlug },
      {
        $set: {
          'facebookAds.accountId': cleanAccountId,
          'facebookAds.pixelId': pixelId || null,
          'facebookAds.selectedAccount': selectedAccount,
          'facebookAds.configured': true,
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json<APIResponse<{ accountId: string; pixelId?: string }>>({
      success: true,
      data: {
        accountId: cleanAccountId,
        pixelId: pixelId || undefined,
      },
      message: 'Conta do Facebook Ads configurada com sucesso',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Error configuring Facebook Ads account:', error);
    
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: 'FACEBOOK_CONFIG_ERROR',
      message: error.message || 'Erro ao configurar conta do Facebook Ads',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

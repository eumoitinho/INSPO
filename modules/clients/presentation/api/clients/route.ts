import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, Client } from '@/lib/mongodb';
import type { APIResponse } from '@/types/dashboard';

/**
 * GET /api/admin/clients
 * List all clients from database
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectToDatabase();
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : null;
    
    // Get all clients with basic info
    let query = (Client as any).find({}, {
      name: 1,
      email: 1,
      slug: 1,
      status: 1,
      monthlyBudget: 1,
      avatar: 1,
      tags: 1,
      'googleAds.connected': 1,
      'googleAds.lastSync': 1,
      'facebookAds.connected': 1,
      'facebookAds.lastSync': 1,
      'googleAnalytics.connected': 1,
      'googleAnalytics.lastSync': 1,
      createdAt: 1,
      updatedAt: 1
    }).sort({ createdAt: -1 });

    if (limit) {
      query = query.limit(limit);
    }

    const clients = await query;

    return NextResponse.json<APIResponse<any[]>>({
      success: true,
      data: clients,
      message: `${clients.length} clientes encontrados`,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Erro ao buscar clientes:', error);
    
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: 'FETCH_CLIENTS_ERROR',
      message: error.message || 'Erro ao buscar clientes',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

/**
 * POST /api/admin/clients
 * Create a new client
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    
    await connectToDatabase();
    
    // Validate required fields
    if (!body.name || !body.email || !body.slug || !body.monthlyBudget) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'MISSING_REQUIRED_FIELDS',
        message: 'Nome, email, slug e orçamento mensal são obrigatórios',
        timestamp: new Date().toISOString(),
      }, { status: 400 });
    }

    // Check if client with same slug already exists
    const existingClient = await (Client as any).findOne({ slug: body.slug });
    if (existingClient) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'SLUG_ALREADY_EXISTS',
        message: 'Já existe um cliente com este slug',
        timestamp: new Date().toISOString(),
      }, { status: 409 });
    }

    // Create new client
    const newClient = await (Client as any).create({
      name: body.name,
      email: body.email,
      slug: body.slug,
      status: body.status || 'active',
      monthlyBudget: body.monthlyBudget,
      avatar: body.avatar,
      tags: body.tags || [],
      portalSettings: body.portalSettings || {
        primaryColor: '#3B82F6',
        secondaryColor: '#8B5CF6',
        allowedSections: ['dashboard', 'campanhas', 'analytics', 'relatorios']
      },
      googleAds: {
        connected: false,
        customerId: body.googleAds?.customerId,
        lastSync: null,
      },
      facebookAds: {
        connected: false,
        accountId: body.facebookAds?.accountId,
        pixelId: body.facebookAds?.pixelId,
        lastSync: null,
      },
      googleAnalytics: {
        connected: false,
        propertyId: body.googleAnalytics?.propertyId,
        viewId: body.googleAnalytics?.viewId,
        lastSync: null,
      },
    });

    return NextResponse.json<APIResponse<any>>({
      success: true,
      data: newClient,
      message: 'Cliente criado com sucesso',
      timestamp: new Date().toISOString(),
    }, { status: 201 });

  } catch (error: any) {
    console.error('Erro ao criar cliente:', error);
    
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: 'CREATE_CLIENT_ERROR',
      message: error.message || 'Erro ao criar cliente',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
} 
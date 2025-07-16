import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, Client } from '@/lib/mongodb';
import type { APIResponse } from '@/types/dashboard';

/**
 * GET /api/admin/clients/[clientId]
 * Get a specific client by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
): Promise<NextResponse> {
  try {
    const { clientId } = await params;
    
    await connectToDatabase();
    
    // Buscar por slug em vez de ID
    const client = await (Client as any).findOne({ slug: clientId });
    
    if (!client) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'CLIENT_NOT_FOUND',
        message: `Cliente '${clientId}' não encontrado`,
        timestamp: new Date().toISOString(),
      }, { status: 404 });
    }

    return NextResponse.json<APIResponse<any>>({
      success: true,
      data: client,
      message: 'Cliente encontrado com sucesso',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Erro ao buscar cliente:', error);
    
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: 'FETCH_CLIENT_ERROR',
      message: error.message || 'Erro ao buscar cliente',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

/**
 * PUT /api/admin/clients/[clientId]
 * Update a specific client by slug
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
): Promise<NextResponse> {
  try {
    const { clientId } = await params;
    const body = await request.json();
    
    await connectToDatabase();
    
    // Check if client exists by slug
    const existingClient = await (Client as any).findOne({ slug: clientId });
    if (!existingClient) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'CLIENT_NOT_FOUND',
        message: `Cliente '${clientId}' não encontrado`,
        timestamp: new Date().toISOString(),
      }, { status: 404 });
    }

    // Update client by slug
    const updatedClient = await (Client as any).findOneAndUpdate(
      { slug: clientId },
      { 
        ...body,
        updatedAt: new Date()
      },
      { new: true }
    );

    return NextResponse.json<APIResponse<any>>({
      success: true,
      data: updatedClient,
      message: 'Cliente atualizado com sucesso',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Erro ao atualizar cliente:', error);
    
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: 'UPDATE_CLIENT_ERROR',
      message: error.message || 'Erro ao atualizar cliente',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/clients/[clientId]
 * Delete a specific client by slug
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
): Promise<NextResponse> {
  try {
    const { clientId } = await params;
    
    await connectToDatabase();
    
    // Check if client exists by slug
    const existingClient = await (Client as any).findOne({ slug: clientId });
    if (!existingClient) {
      return NextResponse.json<APIResponse<null>>({
        success: false,
        error: 'CLIENT_NOT_FOUND',
        message: `Cliente '${clientId}' não encontrado`,
        timestamp: new Date().toISOString(),
      }, { status: 404 });
    }

    // Delete client by slug
    await (Client as any).findOneAndDelete({ slug: clientId });

    return NextResponse.json<APIResponse<null>>({
      success: true,
      message: 'Cliente removido com sucesso',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('Erro ao remover cliente:', error);
    
    return NextResponse.json<APIResponse<null>>({
      success: false,
      error: 'DELETE_CLIENT_ERROR',
      message: error.message || 'Erro ao remover cliente',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
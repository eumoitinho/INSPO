import { NextRequest, NextResponse } from 'next/server';
import { Client, findClientBySlug, connectToDatabase } from '@/lib/mongodb';

export async function POST(request: NextRequest, { params }: { params: Promise<{ clientId: string }> }) {
  try {
    await connectToDatabase();
    
    const resolvedParams = await params;
    const { clientId } = resolvedParams;
    const { platform, connected, lastSync, connectionData } = await request.json();

    if (!platform) {
      return NextResponse.json(
        { success: false, message: 'Platform é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar cliente por slug
    const client = await findClientBySlug(clientId);
    
    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    // Preparar dados para atualização baseado na plataforma
    const updateData: any = {};
    
    if (platform === 'googleAnalytics') {
      updateData['googleAnalytics.connected'] = connected;
      if (lastSync) updateData['googleAnalytics.lastSync'] = new Date(lastSync);
    } else if (platform === 'googleAds') {
      updateData['googleAds.connected'] = connected;
      if (lastSync) updateData['googleAds.lastSync'] = new Date(lastSync);
    } else if (platform === 'facebookAds') {
      updateData['facebookAds.connected'] = connected;
      if (lastSync) updateData['facebookAds.lastSync'] = new Date(lastSync);
    }
    
    // Atualizar cliente no banco
    const updatedClient = await (Client as any).findOneAndUpdate(
      { _id: client._id },
      updateData,
      { new: true }
    );

    console.log(`✅ Conexão ${platform} salva para cliente ${clientId}:`, {
      connected,
      lastSync,
      connectionData
    });

    return NextResponse.json({
      success: true,
      message: `Status de conexão ${platform} atualizado com sucesso`,
      data: {
        clientId,
        platform,
        connected,
        lastSync,
        connectionData
      }
    });

  } catch (error) {
    console.error('Erro ao salvar conexão:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
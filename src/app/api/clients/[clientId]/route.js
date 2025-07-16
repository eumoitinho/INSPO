import { NextResponse } from 'next/server';
import { connectToDatabase, findClientBySlug } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { slug } = await params;
    
    // Connect to database
    await connectToDatabase();
    
    // Find client by slug
    const client = await findClientBySlug(slug);
    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Cliente não encontrado' },
        { status: 404 }
      );
    }

    // Check if user has access to this client
    if (session.user.role !== 'admin' && session.user.clientSlug !== slug) {
      return NextResponse.json(
        { success: false, message: 'Acesso negado a este cliente' },
        { status: 403 }
      );
    }

    // Return client data (excluding sensitive information)
    const clientData = {
      slug: client.slug,
      name: client.name,
      email: client.email,
      avatar: client.avatar,
      monthlyBudget: client.monthlyBudget,
      tags: client.tags,
      portalSettings: client.portalSettings,
      googleAds: {
        connected: client.googleAds?.connected || false,
        lastSync: client.googleAds?.lastSync,
      },
      facebookAds: {
        connected: client.facebookAds?.connected || false,
        lastSync: client.facebookAds?.lastSync,
      },
      googleAnalytics: {
        connected: client.googleAnalytics?.connected || false,
        lastSync: client.googleAnalytics?.lastSync,
      },
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };

    return NextResponse.json({
      success: true,
      data: clientData,
    });

  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { success: false, message: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
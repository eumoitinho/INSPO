import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../../../../lib/mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientSlug: string }> }
) {
  try {
    const resolvedParams = await params
    const { clientSlug } = resolvedParams

    if (!clientSlug) {
      return NextResponse.json(
        { error: 'Client slug é obrigatório' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // Buscar relatórios do cliente no banco de dados
    const reports = await db.collection('reports')
      .find({ clientSlug })
      .sort({ createdAt: -1 })
      .toArray()

    // Se não há relatórios no banco, retornar array vazio
    if (!reports || reports.length === 0) {
      return NextResponse.json({ 
        data: [],
        message: 'Nenhum relatório encontrado para este cliente' 
      }, { status: 200 })
    }

    return NextResponse.json({ data: reports }, { status: 200 })
  } catch (error: any) {
    console.error('Erro ao buscar relatórios:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientSlug: string }> }
) {
  try {
    const resolvedParams = await params
    const { clientSlug } = resolvedParams
    const body = await request.json()

    if (!clientSlug) {
      return NextResponse.json(
        { error: 'Client slug é obrigatório' },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()

    // Criar novo relatório
    const newReport = {
      ...body,
      clientSlug,
      status: 'processing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const result = await db.collection('reports').insertOne(newReport)

    return NextResponse.json({ 
      data: { ...newReport, _id: result.insertedId },
      message: 'Relatório criado com sucesso' 
    }, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao criar relatório:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
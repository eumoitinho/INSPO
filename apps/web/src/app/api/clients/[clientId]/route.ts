import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase, Client } from "@/lib/mongodb"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    await connectToDatabase()
    
    const { clientId } = await params
    
    const client = await Client.findOne({ slug: clientId }).select('-googleAds.refreshToken -facebookAds.accessToken -googleAnalytics.refreshToken')
    
    if (!client) {
      return NextResponse.json(
        { error: "Cliente não encontrado" },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: client
    })
  } catch (error) {
    console.error('Erro ao buscar cliente:', error)
    return NextResponse.json(
      { error: "Erro ao buscar dados do cliente" },
      { status: 500 }
    )
  }
}
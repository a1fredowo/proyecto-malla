// app/api/gemini/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getChatbotResponse } from '../../../services/api/gemini';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (!message) {
    return NextResponse.json({ error: 'No se proporcionó un mensaje' }, { status: 400 });
  }

  try {
    const reply = await getChatbotResponse(message);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error al obtener respuesta del chatbot:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // Validar entrada
    const { username, password } = body;
    if (!username || !password) {
      return NextResponse.json(
        { error: 'El nombre de usuario y la contraseña son obligatorios' },
        { status: 400 }
      );
    }

    // Verificar si el usuario existe
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Validar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
    }

    // Retornar respuesta de éxito
    return NextResponse.json({ message: 'Inicio de sesión exitoso' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}

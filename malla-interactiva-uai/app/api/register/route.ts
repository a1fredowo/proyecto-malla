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

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: 'El usuario ya existe' }, { status: 409 });
    }

    // Cifrar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Retornar respuesta de éxito
    return NextResponse.json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
  }
}

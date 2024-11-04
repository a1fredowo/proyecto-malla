// app/register/page.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Obtener usuarios existentes de localStorage
      const usersData = localStorage.getItem('usuarios');
      const users = usersData ? JSON.parse(usersData) : [];

      // Verificar si el usuario ya existe
      const existingUser = users.find((user: { usuario: string }) => user.usuario === username);
      if (existingUser) {
        setError('El usuario ya existe');
        return;
      }

      // Guardar el nuevo usuario en localStorage
      const newUser = { usuario: username, contraseña: password };
      users.push(newUser);
      localStorage.setItem('usuarios', JSON.stringify(users));

      // Redirigir al usuario a la página de login
      router.push('/login');
    } catch {
      setError('Error al registrar el usuario');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <form onSubmit={handleRegister} className="bg-gray-800 p-10 rounded shadow-lg w-80">
        <h2 className="text-xl font-bold mb-5">Registrarse</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <div className="mb-4">
          <label className="block mb-1">Nombre de usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-bold"
        >
          Registrarse
        </button>
        <p className="mt-4 text-sm">
          ¿Ya tienes una cuenta?{' '}
          <span
            onClick={() => router.push('/login')}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Inicia sesión
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;

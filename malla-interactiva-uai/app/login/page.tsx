// app/login/page.tsx
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Obtener usuarios de localStorage
      const usersData = localStorage.getItem('usuarios');
      const users = usersData ? JSON.parse(usersData) : [];

      // Verificar si el usuario y la contraseña son correctos
      const user = users.find(
        (user: { usuario: string; contraseña: string }) =>
          user.usuario === username && user.contraseña === password
      );

      if (user) {
        // Guardar el estado de autenticación en localStorage
        localStorage.setItem('isAuthenticated', 'true');
        router.push('/'); // Redirigir a la página principal
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch {
      setError('Error al iniciar sesión');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <form onSubmit={handleLogin} className="bg-gray-800 p-10 rounded shadow-lg w-80">
        <h2 className="text-xl font-bold mb-5">Iniciar sesión</h2>
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
          Iniciar sesión
        </button>
        <p className="mt-4 text-sm">
          ¿No tienes una cuenta?{' '}
          <span
            onClick={() => router.push('/register')}
            className="text-blue-400 cursor-pointer hover:underline"
          >
            Regístrate
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;

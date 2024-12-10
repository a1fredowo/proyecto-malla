"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Importa useRouter
import Link from "next/link";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter(); // Inicializa el hook useRouter

  // useEffect para verificar si el usuario ya está autenticado
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      router.push("/"); // Redirige a la página principal si ya está autenticado
    }
  }, [router]); // Se ejecuta una vez al cargar la página

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      setSuccess("Inicio de sesión exitoso");

      // Verifica si la respuesta es correcta antes de redirigir
      if (res.ok) {
        localStorage.setItem("isAuthenticated", "true"); // Marca al usuario como autenticado
        router.push("/"); // Redirige a la página principal
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error en el servidor");
      } else {
        setError("Error en el servidor");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <form onSubmit={handleLogin} className="bg-gray-800 p-10 rounded shadow-lg w-80">
        <h2 className="text-xl font-bold mb-5">Iniciar Sesión</h2>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        {success && <p className="text-green-500 mb-3">{success}</p>}
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
          Iniciar Sesión
        </button>
        {/* Enlace para redirigir al registro */}
        <p className="mt-4 text-center text-gray-400">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="text-blue-500 hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Importa useRouter
import Link from "next/link"; // Importa Link para la navegación

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter(); // Inicializa el hook useRouter

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrar");

      setSuccess("Usuario registrado correctamente");

      // Redirigir al usuario a la página de login
      router.push("/login"); // Redirige al login

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
      <form onSubmit={handleRegister} className="bg-gray-800 p-10 rounded shadow-lg w-80">
        <h2 className="text-xl font-bold mb-5">Registrarse</h2>
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
          Registrarse
        </button>

        {/* Enlace para redirigir al login */}
        <p className="mt-4 text-center text-gray-400">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

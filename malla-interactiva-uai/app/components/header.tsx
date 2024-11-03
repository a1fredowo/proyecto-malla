"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  mallas: string[];
  selectedMalla: string;
  onSelectMalla: (malla: string) => void;
}

const Header: React.FC<HeaderProps> = ({ mallas, selectedMalla, onSelectMalla }) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <header className="bg-gray-800 p-5 w-full flex justify-between items-center border-b-2 border-blue-400">
      <nav className="flex space-x-6 items-center">
        <h1 className="text-lg font-bold">Malla {selectedMalla}</h1>
        <div className="relative">
          <button
            className="hover:text-blue-400 focus:outline-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Carreras
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-40 bg-gray-900 text-white rounded shadow-lg z-10">
              <ul>
                {mallas.map((malla) => (
                  <li
                    key={malla}
                    className="py-2 cursor-pointer hover:bg-gray-700"
                    onClick={() => {
                      onSelectMalla(malla);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {malla}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Link href="/crear-malla" className="hover:text-blue-400">
          Crear malla
        </Link>
        <Link href="/contacto" className="hover:text-blue-400">
          Contacto
        </Link>
      </nav>
      <Link href="https://ingenieria.uai.cl">
        <Image
          src="/logo.png"
          alt="Logo"
          className="cursor-pointer"
          width={256}
          height={100}
          style={{ height: '50px' }} // Estilo en lÃ­nea para asegurar el cambio
        />
      </Link>
    </header>
  );
};

export default Header;
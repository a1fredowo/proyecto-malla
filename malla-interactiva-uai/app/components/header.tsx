"use client";
import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useLanguage } from './LanguageContext';
import { translations } from '../data/translations';

interface HeaderProps {
  mallas: string[];
  selectedMalla: string;
  onSelectMalla: (malla: string) => void;
}

const Header: React.FC<HeaderProps> = ({ mallas, selectedMalla, onSelectMalla }) => {
  const { language, setLanguage } = useLanguage() as { language: 'es' | 'en', setLanguage: (lang: 'es' | 'en') => void };
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  return (
    <header className="bg-gray-800 p-5 w-full flex flex-col md:flex-row justify-between items-center border-b-2 border-blue-400">
      <nav className="flex space-x-6 items-center">
        <h1 className="text-lg font-bold">Malla {selectedMalla}</h1>
        <div className="relative">
          <button
            className="hover:text-blue-400 focus:outline-none flex items-center"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {translations[language].header.carreras}
            <FontAwesomeIcon icon={faChevronDown} className="ml-2 text-xs" />
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
          {translations[language].header.crearMalla}
        </Link>
        <Link href="/contacto" className="hover:text-blue-400">
          {translations[language].header.contacto}
        </Link>
      </nav>
      <div className="flex items-center space-x-4">
        <span>{translations[language].header.idioma}:</span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'es' | 'en')}
          className="bg-gray-800 text-white border border-blue-400 p-1 rounded"
        >
          <option value="es">ES</option>
          <option value="en">EN</option>
        </select>
      </div>
    </header>
  );
};

export default Header;
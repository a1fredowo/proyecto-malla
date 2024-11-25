"use client";
import React from 'react';
import Header from '../../components/header';
import { LanguageProvider, useLanguage } from '../../components/LanguageContext';
import { translations } from '../../data/translations';
import '../../styles/styles.css';

const Contacto: React.FC = () => {
  const { language } = useLanguage() as { language: 'es' | 'en' };

  return (
    <div className="text-center bg-black text-white min-h-screen flex flex-col items-center font-sans">
      <Header
        mallas={[]} // No se necesitan mallas en la página de contacto
        selectedMalla=""
        onSelectMalla={() => {}} // No se necesita cambiar la malla en la página de contacto
      />
        <div className="bg-gray-800 p-10 rounded shadow-lg w-full max-w-md mb-10">
            <h3 className="text-xl font-bold mb-5">Información de los Creadores</h3>
            <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                <img src="/icons/user1.svg" alt="Imagen 1" className="w-10 h-10 mr-4" />
                <p>Alfredo Hernández</p>
                </div>
                <div className="flex items-center">
                <img src="/icons/user2.svg" alt="Creador 2" className="w-10 h-10 mr-4" />
                <p>Valentina Manríquez</p>
                </div>
                <div className="flex items-center">
                <img src="/icons/user3.svg" alt="Creador 3" className="w-10 h-10 mr-4" />
                <p>Simón Jiménez</p>
                </div>
            </div>
            </div>
            <div className="bg-gray-800 p-10 rounded shadow-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-5">Dudas o Consultas</h3>
            <p className="mb-3">Escribir a este email:</p>
            <div className="flex items-center justify-center">
                <a href="mailto:contacto@example.com" className="flex items-center text-blue-400 hover:underline">
                <img src="/icons/email.svg" alt="Email" className="w-6 h-6 mr-2" />
                contacto@example.com
                </a>
            </div>
        </div>
    </div>
  );
};

const ContactoWrapper: React.FC = () => (
  <LanguageProvider>
    <Contacto />
  </LanguageProvider>
);

export default ContactoWrapper;

"use client";
import React, { useState } from 'react';
import Header from '../../components/header';
import { useLanguage, LanguageProvider } from '../../components/LanguageContext';
import { translations } from '../../data/translations';
import '../../styles/styles.css';

const Contacto: React.FC = () => {
  const { language } = useLanguage();
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ sender: string; message: string }[]>([]);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    // Agrega el mensaje del usuario al historial
    setChatHistory(prev => [...prev, { sender: 'user', message: userMessage }]);

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();

      if (response.ok) {
        // Agrega la respuesta del chatbot al historial
        setChatHistory(prev => [...prev, { sender: 'bot', message: data.reply }]);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error al enviar el mensaje:', error);
    }

    // Limpia el input del usuario
    setUserMessage('');
  };

  return (
    <div className="text-center bg-black bg-no-repeat bg-cover text-white min-h-screen flex flex-col items-center font-sans" style={{ backgroundImage: "url('img/uai1.jpeg')", backgroundPosition: 'center', opacity:1 }}>
      <Header
        mallas={[]}
        selectedMalla="Ingeniería UAI"
        onSelectMalla={() => {}}
      />
      <div className="bg-gray-800 p-10 rounded shadow-lg w-full max-w-md mb-10">
        <h3 className="text-xl font-bold mb-5">{translations[language].contacto.informacionCreadores}</h3>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            <img src="/img/alfredowo.jpg" alt="Imagen 1" className="w-10 h-10 mr-4" />
            <p>Alfredo Hernández</p>
          </div>
          <div className="flex items-center">
            <img src="/img/wbyvale.jpg" alt="Creador 2" className="w-10 h-10 mr-4" />
            <p>Valentina Manríquez</p>
          </div>
          <div className="flex items-center">
            <img src="img/menu.png" alt="Creador 3" className="w-10 h-10 mr-4" />
            <p>Simón Jiménez</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 p-10 rounded shadow-lg w-full max-w-md">
        <h3 className="text-xl font-bold mb-5">{translations[language].contacto.dudasConsultas}</h3>
        <div className="mb-4">
          <div className="h-64 overflow-y-auto bg-gray-700 p-4 rounded">
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`mb-2 text-left ${chat.sender === 'user' ? 'text-blue-400' : 'text-green-400'}`}
              >
                <strong>{chat.sender === 'user' ? 'Tú' : 'Xiaopang'}:</strong> {chat.message}
              </div>
            ))}
          </div>
        </div>
        <textarea
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-4"
          placeholder="Escribe tu mensaje"
        />
        <button
          onClick={handleSendMessage}
          className="w-full p-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-bold"
        >
          Enviar
        </button>
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
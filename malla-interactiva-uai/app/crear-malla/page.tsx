"use client";
import React, { useState } from 'react';
import mallasData from '../../data/mallas';
import { translations } from '../../data/translations';
import { LanguageProvider, useLanguage } from '../../components/LanguageContext';
import Header from '../../components/header';

interface Course {
  id: number;
  name: string;
  semester: number;
  credits: number;
  core: boolean;
  code: string;
  prerequisites: number[];
}

const CrearMalla: React.FC = () => {
  const { language } = useLanguage() as { language: 'es' | 'en' };
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [semester, setSemester] = useState(5); // Starting from the 5th semester
  const [nextId, setNextId] = useState(1);
  const [selectedMalla, setSelectedMalla] = useState<string>('Ing. Civil Informática');

  const mallas = mallasData;
  const predefinedCourses = mallas[selectedMalla as keyof typeof mallasData].filter(course => course.semester <= 4);
  const availableCourses = mallas[selectedMalla as keyof typeof mallasData];

  const handleAddCourse = () => {
    if (selectedCourseId !== null) {
      const selectedCourse = availableCourses.find(course => course.id === selectedCourseId);
      if (selectedCourse) {
        const newCourse: Course = {
          ...selectedCourse,
          id: nextId,
          semester,
        };
        setCourses([...courses, newCourse]);
        setNextId(nextId + 1);
        setSelectedCourseId(null);
      }
    }
  };

  const handleAddYear = () => {
    setSemester(semester + 2); // Each year has 2 semesters
  };

  return (
    <div className="text-center bg-black text-white min-h-screen flex flex-col items-center font-sans">
      <Header
        mallas={Object.keys(mallas)}
        selectedMalla={selectedMalla}
        onSelectMalla={setSelectedMalla} // Permite cambiar la malla seleccionada
      />

      <div className="grid grid-cols-9 gap-px justify-start w-11/12 overflow-x-auto transition-all duration-300 mt-10">
        {Array.from({ length: semester }, (_, i) => i + 1).map((sem) => (
          <div key={sem} className="border border-blue-400 bg-gray-800 p-1">
            <h2 className="mb-2 text-xs">{translations[language].malla.semestre} {sem}</h2>
            <div className="flex flex-col items-center">
              {predefinedCourses
                .filter(course => course.semester === sem)
                .map(course => (
                  <div
                    key={course.id}
                    className={`relative w-full p-2 mb-2 text-sm rounded border cursor-pointer hover:bg-gray-600 hover:shadow-lg
                      ${course.core ? 'bg-gray-700' : 'bg-gray-800'}`}
                  >
                    <div className="flex justify-between text-xs text-blue-400">
                      <span>{course.code}</span>
                      <span>{course.credits} {translations[language].malla.creditos}</span>
                    </div>
                    <div className="text-center mt-1 mb-1 text-blue-300 font-semibold text-sm">
                      {course.name}
                    </div>
                    <div className="text-xs mt-1 text-blue-400">Prerequisitos: {course.prerequisites.length}</div>
                  </div>
                ))}
              {courses
                .filter(course => course.semester === sem)
                .map(course => (
                  <div
                    key={course.id}
                    className={`relative w-full p-2 mb-2 text-sm rounded border cursor-pointer hover:bg-gray-600 hover:shadow-lg
                      ${course.core ? 'bg-gray-700' : 'bg-gray-800'}`}
                  >
                    <div className="flex justify-between text-xs text-blue-400">
                      <span>{course.code}</span>
                      <span>{course.credits} {translations[language].malla.creditos}</span>
                    </div>
                    <div className="text-center mt-1 mb-1 text-blue-300 font-semibold text-sm">
                      {course.name}
                    </div>
                    <div className="text-xs mt-1 text-blue-400">Prerequisitos: {course.prerequisites.length}</div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full max-w-md mt-8">
        <div className="mb-4">
          <label className="block mb-1">Seleccionar Curso</label>
          <select
            value={selectedCourseId ?? ''}
            onChange={(e) => setSelectedCourseId(Number(e.target.value))}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
          >
            <option value="" disabled>Selecciona un curso</option>
            {availableCourses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name} ({course.code})
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAddCourse}
          className="w-full p-2 bg-blue-500 hover:bg-blue-600 rounded text-white font-bold mb-4"
        >
          Agregar Curso
        </button>
        <button
          onClick={handleAddYear}
          className="w-full p-2 bg-green-500 hover:bg-green-600 rounded text-white font-bold"
        >
          Agregar Año
        </button>
      </div>
    </div>
  );
};

const CrearMallaWrapper: React.FC = () => (
  <LanguageProvider>
    <CrearMalla />
  </LanguageProvider>
);

export default CrearMallaWrapper;
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/header';
import ProgressSummary from '../components/progress';
import mallasData from '../data/mallas';
import '../styles/styles.css';
import { LanguageProvider, useLanguage } from '../components/LanguageContext';
import { translations } from '../data/translations';

const years = ["Año 1", "Año 1", "Año 2", "Año 2", "Año 3", "Año 3", "Año 4", "Año 4", "Año 5"];

type MallaKey = keyof typeof mallasData;

const MainContent: React.FC<{ selectedMalla: string; setSelectedMalla: (malla: string) => void }> = ({
  selectedMalla,
  setSelectedMalla,
}) => {
  const { language } = useLanguage() as { language: keyof typeof translations };
  const [completedCourses, setCompletedCourses] = useState<number[]>([]);
  const [unlockedCourses, setUnlockedCourses] = useState<number[]>([]);
  const [approvedCredits, setApprovedCredits] = useState(0);
  const [totalCreditsPercentage, setTotalCreditsPercentage] = useState(0);
  const [totalCoursesCompleted, setTotalCoursesCompleted] = useState(0);
  const [totalCoursesPercentage, setTotalCoursesPercentage] = useState(0);

  const mallas = mallasData;
  const courses = mallas[selectedMalla as MallaKey];

  useEffect(() => {
    const initiallyUnlockedCourses = courses
      .filter(course => course.prerequisites.length === 0)
      .map(course => course.id);
    setUnlockedCourses(initiallyUnlockedCourses);
  }, [selectedMalla, courses]);

  const calculateProgress = (completedCourses: number[]) => {
    const approvedCredits = completedCourses.reduce((sum, courseId) => {
      const course = courses.find(course => course.id === courseId);
      return sum + (course ? course.credits : 0);
    }, 0);

    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const totalCreditsPercentage = (approvedCredits / totalCredits) * 100;

    const totalCoursesCompleted = completedCourses.length;
    const totalCoursesPercentage = (totalCoursesCompleted / courses.length) * 100;

    setApprovedCredits(approvedCredits);
    setTotalCreditsPercentage(totalCreditsPercentage);
    setTotalCoursesCompleted(totalCoursesCompleted);
    setTotalCoursesPercentage(totalCoursesPercentage);
  };

  const toggleCourseCompletion = (id: number) => {
    const newCompletedCourses = completedCourses.includes(id)
      ? completedCourses.filter(courseId => courseId !== id)
      : [...completedCourses, id];

    setCompletedCourses(newCompletedCourses);

    const newUnlockedCourses = courses
      .filter(course =>
        course.prerequisites.every(prereq => newCompletedCourses.includes(prereq))
      )
      .map(course => course.id);

    setUnlockedCourses(newUnlockedCourses);
    calculateProgress(newCompletedCourses);
  };

  return (
    <div className="text-center bg-black text-white min-h-screen flex flex-col items-center font-sans">
      <Header
        mallas={Object.keys(mallas)}
        selectedMalla={selectedMalla}
        onSelectMalla={setSelectedMalla} // Permite cambiar la malla seleccionada
      />

      <div className="grid grid-cols-9 gap-px justify-start w-11/12 overflow-x-auto transition-all duration-300 mt-10">
        {years.map((year, index) => (
          <div key={index} className="text-center bg-gray-800 p-px text-white border border-blue-400">
            {translations[language].malla.año} {Math.floor(index / 2) + 1}
          </div>
        ))}
        {[...Array(9)].map((_, semester) => (
          <div key={semester} className="border border-blue-400 bg-gray-800 p-1">
            <h2 className="mb-2 text-xs">{translations[language].malla.semestre} {semester + 1}</h2>
            <div className="flex flex-col items-center">
              {courses
                .filter(course => course.semester === semester + 1)
                .map(course => (
                  <div
                    key={course.id}
                    className={`relative w-full p-2 mb-2 text-sm rounded border cursor-pointer hover:bg-gray-600 hover:shadow-lg
                      ${course.core ? 'bg-gray-700' : 'bg-gray-800'} 
                      ${completedCourses.includes(course.id) ? 'completed' : ''} 
                      ${unlockedCourses.includes(course.id) ? 'opacity-100' : 'opacity-50'}`}
                    onClick={() => toggleCourseCompletion(course.id)}
                  >
                    <div className="flex justify-between text-xs text-blue-400">
                      <span>{course.code}</span>
                      <span>{course.credits} {translations[language].malla.creditos}</span>
                    </div>
                    <div className="text-center mt-1 mb-1 text-blue-300 font-semibold text-sm">
                      {course.name}
                    </div>
                    <div className="text-xs mt-1 text-blue-400">Prerequisitos: {course.prerequisites.length}</div>
                    {completedCourses.includes(course.id) && <div className="strike-through"></div>}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <ProgressSummary
        approvedCredits={approvedCredits}
        totalCreditsPercentage={totalCreditsPercentage}
        totalCoursesCompleted={totalCoursesCompleted}
        totalCoursesPercentage={totalCoursesPercentage}
      />
    </div>
  );
};

const App: React.FC = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedMalla, setSelectedMalla] = useState<string>('Ing. Civil Informática');

  // Verificar autenticación al cargar la página
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    if (!authStatus) {
      router.push('/login'); // Redirige a /login si no está autenticado
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return null; // Evita renderizar MainContent mientras redirige
  }

  return <MainContent selectedMalla={selectedMalla} setSelectedMalla={setSelectedMalla} />;
};

const AppWrapper: React.FC = () => (
  <LanguageProvider>
    <App />
  </LanguageProvider>
);

export default AppWrapper;

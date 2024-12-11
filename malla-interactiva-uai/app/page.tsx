"use client";
import React, { useEffect, useState, useMemo } from 'react';
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const mallas = mallasData;

  // Memoizar el array 'courses' para que solo cambie cuando 'selectedMalla' cambie
  const courses = useMemo(() => mallas[selectedMalla as MallaKey], [selectedMalla]);

  // Cargar cursos completados desde localStorage cuando el componente se monta o 'selectedMalla' cambia
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCompletedCourses = localStorage.getItem(`completedCourses_${selectedMalla}`);
      if (savedCompletedCourses) {
        const parsedCompletedCourses = JSON.parse(savedCompletedCourses);
        setCompletedCourses(parsedCompletedCourses);
      } else {
        setCompletedCourses([]);
      }
      setIsInitialLoad(false); // Marcamos que la carga inicial ha terminado
    }
  }, [selectedMalla]);

  // Guardar cursos completados en localStorage cuando cambian, pero solo después de la carga inicial
  useEffect(() => {
    if (isInitialLoad) return; // Evitamos guardar durante la carga inicial
    if (typeof window !== 'undefined') {
      localStorage.setItem(`completedCourses_${selectedMalla}`, JSON.stringify(completedCourses));
    }
  }, [completedCourses, selectedMalla, isInitialLoad]);

  // Actualizar cursos desbloqueados cuando 'completedCourses' o 'courses' cambian
  useEffect(() => {
    const initiallyUnlockedCourses = courses
      .filter(course => course.prerequisites.length === 0)
      .map(course => course.id);

    const newUnlockedCourses = courses
      .filter(course =>
        course.prerequisites.every(prereq => completedCourses.includes(prereq))
      )
      .map(course => course.id);

    setUnlockedCourses([...new Set([...initiallyUnlockedCourses, ...newUnlockedCourses])]);
  }, [completedCourses, courses]);

  const toggleCourseCompletion = (id: number) => {
    setCompletedCourses(prevCompletedCourses => {
      const isCompleted = prevCompletedCourses.includes(id);
      const updatedCompletedCourses = isCompleted
        ? prevCompletedCourses.filter(courseId => courseId !== id)
        : [...prevCompletedCourses, id];
      return updatedCompletedCourses;
    });
  };

  // Calcular progreso cuando 'completedCourses' o 'courses' cambian
  useEffect(() => {
    const approvedCredits = completedCourses.reduce((sum, courseId) => {
      const course = courses.find(course => course.id === courseId);
      return sum + (course ? course.credits : 0);
    }, 0);
    setApprovedCredits(approvedCredits);

    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0) || 1; // Evitar división por cero
    setTotalCreditsPercentage((approvedCredits / totalCredits) * 100);

    const totalCoursesCompleted = completedCourses.length;
    setTotalCoursesCompleted(totalCoursesCompleted);

    const totalCourses = courses.length || 1; // Evitar división por cero
    setTotalCoursesPercentage((totalCoursesCompleted / totalCourses) * 100);
  }, [completedCourses, courses]);

  return (
    <div className="text-center bg-black bg-no-repeat bg-cover text-white min-h-screen flex flex-col items-center font-sans" style={{ backgroundImage: "url('img/uai1.jpeg')", backgroundPosition: 'center', opacity:1 }}>
      <Header
        mallas={Object.keys(mallas)}
        selectedMalla={selectedMalla}
        onSelectMalla={setSelectedMalla} // Permite cambiar la malla seleccionada
      />

      <div className="grid grid-cols-9 gap-px justify-start w-11/12 overflow-x-auto transition-all duration-300 mt-10 rounded-lg">
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
                    <div className="text-xs mt-1 text-blue-400">{translations[language].malla.prerrequisitos}: {course.prerequisites.length}</div>
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

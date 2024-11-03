"use client";
import React, { useState, useEffect } from 'react';
import Header from './components/header';
import Progress from './components/progress';
import mallasData from './data/mallas';
import './styles.css';

interface Course {
  id: number;
  semester: number;
  name: string;
  core: boolean;
  code: string;
  credits: number;
  prerequisites: number[];
}

interface Mallas {
  [key: string]: Course[];
}

const years = ["Año 1", "Año 1", "Año 2", "Año 2", "Año 3", "Año 3", "Año 4", "Año 4", "Año 5"];

const App: React.FC = () => {
  const [completedCourses, setCompletedCourses] = useState<number[]>([]);
  const [unlockedCourses, setUnlockedCourses] = useState<number[]>([]);
  const [approvedCredits, setApprovedCredits] = useState(0);
  const [totalCreditsPercentage, setTotalCreditsPercentage] = useState(0);
  const [totalCoursesCompleted, setTotalCoursesCompleted] = useState(0);
  const [totalCoursesPercentage, setTotalCoursesPercentage] = useState(0);
  const [selectedMalla, setSelectedMalla] = useState<string>('Ing. Civil Informática');

  const mallas: Mallas = mallasData;
  const courses = mallas[selectedMalla];

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

  const handleMallaChange = (malla: string) => {
    setSelectedMalla(malla);
    setCompletedCourses([]);
    const initiallyUnlockedCourses = mallas[malla]
      .filter(course => course.prerequisites.length === 0)
      .map(course => course.id);
    setUnlockedCourses(initiallyUnlockedCourses);
    setApprovedCredits(0);
    setTotalCreditsPercentage(0);
    setTotalCoursesCompleted(0);
    setTotalCoursesPercentage(0);
  };

  return (
    <div className="text-center bg-black text-white min-h-screen flex flex-col items-center font-sans">
      <Header mallas={Object.keys(mallas)} selectedMalla={selectedMalla} onSelectMalla={handleMallaChange} />

      {/* Malla interactiva directamente en App.tsx */}
      <div className="grid grid-cols-9 gap-px justify-start w-11/12 overflow-x-auto transition-all duration-300 mt-4">
        {years.map((year, index) => (
          <div key={index} className="text-center bg-gray-800 p-px text-white border border-blue-400">{year}</div>
        ))}
        {[...Array(9)].map((_, semester) => (
          <div key={semester} className="border border-blue-400 bg-gray-800 p-1">
            <h2 className="mb-2 text-xs">Semestre {semester + 1}</h2>
            <div className="flex flex-col items-center">
              {courses
                .filter(course => course.semester === semester + 1)
                .map(course => (
                  <div
                    key={course.id}
                    className={`w-full p-2 mb-2 text-sm rounded border cursor-pointer hover:bg-gray-600 hover:shadow-lg
                      ${course.core ? 'bg-gray-700' : 'bg-gray-800'} 
                      ${completedCourses.includes(course.id) ? 'line-through' : ''} 
                      ${unlockedCourses.includes(course.id) ? 'opacity-100' : 'opacity-50'}`}
                    onClick={() => toggleCourseCompletion(course.id)}
                  >
                    {/* Código del curso y créditos en tamaño pequeño */}
                    <div className="flex justify-between text-xs text-blue-400">
                      <span>{course.code}</span>
                      <span>{course.credits} Créditos</span>
                    </div>

                    {/* Nombre del curso en un tamaño mayor para resaltar */}
                    <div className="text-center mt-1 mb-1 text-blue-300 font-semibold text-base">
                      {course.name}
                    </div>

                    {/* Prerrequisitos en tamaño pequeño */}
                    <div className="text-xs mt-1 text-blue-400">Prerequisitos: {course.prerequisites.length}</div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <Progress
        approvedCredits={approvedCredits}
        totalCreditsPercentage={totalCreditsPercentage}
        totalCoursesCompleted={totalCoursesCompleted}
        totalCoursesPercentage={totalCoursesPercentage}
      />
    </div>
  );
};

export default App;

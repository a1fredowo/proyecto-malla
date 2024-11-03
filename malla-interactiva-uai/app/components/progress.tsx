import React from 'react';
import { useLanguage } from './LanguageContext';
import { translations } from '../data/translations';

interface ProgressSummaryProps {
  approvedCredits: number;
  totalCreditsPercentage: number;
  totalCoursesCompleted: number;
  totalCoursesPercentage: number;
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({
  approvedCredits,
  totalCreditsPercentage,
  totalCoursesCompleted,
  totalCoursesPercentage,
}) => {
  const { language } = useLanguage() as { language: 'es' | 'en' };

  return (
    <div className="text-center w-full md:w-11/12 mt-8 text-sm md:text-base">
      <p>
        {translations[language].progress.approvedCredits}: {approvedCredits} ({Math.round(totalCreditsPercentage)}%), {translations[language].progress.totalCoursesCompleted}: {totalCoursesCompleted} ({Math.round(totalCoursesPercentage)}%)
      </p>
    </div>
  );
};

export default ProgressSummary;
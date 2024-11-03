import React from 'react';

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
}) => (
  <div className="text-center w-11/12 mt-8">
    <p>
      Créditos aprobados: {approvedCredits} ({Math.round(totalCreditsPercentage)}%), Total ramos: {totalCoursesCompleted} ({Math.round(totalCoursesPercentage)}%)
    </p>
  </div>
);

export default ProgressSummary;
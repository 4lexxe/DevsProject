import React from 'react';
import { Assignment } from '../type';
import { Calendar, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface AssignmentListProps {
  assignments: Assignment[];
}

const AssignmentList: React.FC<AssignmentListProps> = ({ assignments }) => {
  const getDaysRemaining = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day remaining';
    return `${diffDays} days remaining`;
  };

  const getGradingProgress = (submitted: number, graded: number) => {
    if (submitted === 0) return 0;
    return Math.round((graded / submitted) * 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Assignment Overview</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {assignments.length === 0 ? (
          <p className="p-4 text-center text-gray-500">No assignments found</p>
        ) : (
          assignments.map((assignment) => (
            <div key={assignment.id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                  <p className="text-sm text-gray-500">{assignment.courseName}</p>
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <Calendar size={14} className="mr-1" />
                    <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>{getDaysRemaining(assignment.dueDate)}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center text-sm">
                    {assignment.gradedCount === assignment.submissionsCount ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <AlertCircle size={16} className="text-yellow-500" />
                    )}
                    <span className="ml-1 font-medium">
                      {assignment.gradedCount}/{assignment.submissionsCount} Graded
                    </span>
                  </div>
                  <div className="mt-2 w-32">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Grading Progress</span>
                      <span>{getGradingProgress(assignment.submissionsCount, assignment.gradedCount)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${getGradingProgress(assignment.submissionsCount, assignment.gradedCount)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex space-x-2">
                <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  <FileText size={14} className="mr-1" />
                  View Submissions
                </button>
                <button className="text-sm text-gray-600 hover:text-gray-800 flex items-center">
                  Edit Assignment
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        <a href="#" className="text-sm text-blue-600 hover:text-blue-800 block text-center">
          View All Assignments
        </a>
      </div>
    </div>
  );
};

export default AssignmentList;
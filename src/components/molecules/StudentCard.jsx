import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const StudentCard = ({ student, onClick }) => {
  const getStatusVariant = (status) => {
    switch (status) {
      case "active": return "success";
      case "inactive": return "error";
      case "pending": return "warning";
      default: return "default";
    }
  };

  const getGradeAverage = () => {
    // Mock grade calculation
    return Math.floor(Math.random() * 30) + 70;
  };

  const gradeAverage = getGradeAverage();
  
  return (
    <Card 
      hover 
      onClick={onClick}
      className="cursor-pointer transition-all duration-200 hover:shadow-lg"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/30 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {student.firstName} {student.lastName}
            </h3>
            <p className="text-sm text-gray-600">Grade {student.grade}</p>
          </div>
        </div>
        <Badge variant={getStatusVariant(student.status)}>
          {student.status}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Grade Average</span>
          <div className="flex items-center space-x-2">
            <div className={`w-16 h-2 rounded-full bg-gray-200 overflow-hidden`}>
              <div 
                className={`h-full bg-gradient-to-r ${
                  gradeAverage >= 90 ? "from-success to-emerald-500" :
                  gradeAverage >= 80 ? "from-warning to-yellow-500" :
                  gradeAverage >= 70 ? "from-info to-blue-500" :
                  "from-error to-red-500"
                }`}
                style={{ width: `${gradeAverage}%` }}
              />
            </div>
            <span className="text-sm font-medium text-gray-900">{gradeAverage}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Mail" className="w-4 h-4 mr-1" />
            <span className="truncate">{student.email}</span>
          </div>
          <ApperIcon name="ChevronRight" className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </Card>
  );
};

export default StudentCard;
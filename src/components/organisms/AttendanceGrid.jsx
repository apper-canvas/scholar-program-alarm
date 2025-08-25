import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";

const AttendanceGrid = ({ students, attendanceData, selectedDate, onMarkAttendance }) => {
  const getAttendanceStatus = (studentId, date) => {
    const record = attendanceData.find(
      record => record.studentId === studentId && 
      new Date(record.date).toDateString() === new Date(date).toDateString()
    );
    return record?.status || "unmarked";
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "present": return "success";
      case "absent": return "error";
      case "late": return "warning";
      case "excused": return "info";
      default: return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present": return "Check";
      case "absent": return "X";
      case "late": return "Clock";
      case "excused": return "FileText";
      default: return "Minus";
    }
  };

  const handleStatusClick = (studentId, currentStatus) => {
    const statuses = ["present", "absent", "late", "excused"];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    onMarkAttendance(studentId, selectedDate, nextStatus);
  };

  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Attendance - {new Date(selectedDate).toLocaleDateString()}
          </h3>
          <div className="text-sm text-gray-600">
            Click status to change
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Grade
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Notes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => {
              const status = getAttendanceStatus(student.Id, selectedDate);
              const attendanceRecord = attendanceData.find(
                record => record.studentId === student.Id && 
                new Date(record.date).toDateString() === new Date(selectedDate).toDateString()
              );
              
              return (
                <tr 
                  key={student.Id} 
                  className="grid-row hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <ApperIcon name="User" className="w-5 h-5 text-primary" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {student.Id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      Grade {student.grade}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleStatusClick(student.Id, status)}
                      className="inline-flex items-center space-x-2"
                    >
                      <ApperIcon name={getStatusIcon(status)} className="w-4 h-4" />
                      <Badge variant={getStatusVariant(status)}>
                        {status}
                      </Badge>
                    </Button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {attendanceRecord?.reason || "-"}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default AttendanceGrid;
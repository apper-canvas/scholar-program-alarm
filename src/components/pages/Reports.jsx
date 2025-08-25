import React, { useState, useEffect } from "react";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Card from "@/components/atoms/Card";
import StatCard from "@/components/molecules/StatCard";
import ApperIcon from "@/components/ApperIcon";
import { studentsService } from "@/services/api/studentsService";
import { attendanceService } from "@/services/api/attendanceService";
import { gradesService } from "@/services/api/gradesService";
import { assignmentsService } from "@/services/api/assignmentsService";

const Reports = () => {
  const [reportData, setReportData] = useState({
    students: [],
    attendance: [],
    grades: [],
    assignments: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReportData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [students, attendance, grades, assignments] = await Promise.all([
        studentsService.getAll(),
        attendanceService.getAll(),
        gradesService.getAll(),
        assignmentsService.getAll()
      ]);

      setReportData({ students, attendance, grades, assignments });
    } catch (err) {
      setError(err.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  const getOverallStats = () => {
    const { students, attendance, grades, assignments } = reportData;

    // Total students by grade
    const gradeDistribution = students.reduce((acc, student) => {
      acc[student.grade] = (acc[student.grade] || 0) + 1;
      return acc;
    }, {});

    // Overall attendance rate
    const totalAttendanceRecords = attendance.length;
    const presentRecords = attendance.filter(record => record.status === "present").length;
    const overallAttendanceRate = totalAttendanceRecords > 0 ? 
      Math.round((presentRecords / totalAttendanceRecords) * 100) : 0;

    // Average grades
    const totalGrades = grades.reduce((sum, grade) => sum + grade.score, 0);
    const totalPossiblePoints = grades.reduce((sum, grade) => {
      const assignment = assignments.find(a => a.Id === grade.assignmentId);
      return sum + (assignment?.totalPoints || 100);
    }, 0);
    const overallGradeAverage = totalPossiblePoints > 0 ? 
      Math.round((totalGrades / totalPossiblePoints) * 100) : 0;

    // Assignment completion rate
    const totalPossibleSubmissions = students.length * assignments.length;
    const actualSubmissions = grades.length;
    const completionRate = totalPossibleSubmissions > 0 ? 
      Math.round((actualSubmissions / totalPossibleSubmissions) * 100) : 0;

    return {
      gradeDistribution,
      overallAttendanceRate,
      overallGradeAverage,
      completionRate
    };
  };

  const getTopPerformers = () => {
    const { students, grades, assignments } = reportData;
    
    const studentAverages = students.map(student => {
      const studentGrades = grades.filter(g => g.studentId === student.Id);
      if (studentGrades.length === 0) return { student, average: 0 };

      const totalScore = studentGrades.reduce((sum, grade) => sum + grade.score, 0);
      const totalPossible = studentGrades.reduce((sum, grade) => {
        const assignment = assignments.find(a => a.Id === grade.assignmentId);
        return sum + (assignment?.totalPoints || 100);
      }, 0);

      const average = totalPossible > 0 ? (totalScore / totalPossible) * 100 : 0;
      return { student, average: Math.round(average) };
    });

    return studentAverages
      .sort((a, b) => b.average - a.average)
      .slice(0, 5);
  };

  const getAttendanceIssues = () => {
    const { students, attendance } = reportData;
    
    const studentAttendance = students.map(student => {
      const studentRecords = attendance.filter(a => a.studentId === student.Id);
      const totalRecords = studentRecords.length;
      const presentRecords = studentRecords.filter(r => r.status === "present").length;
      
      const rate = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 100;
      return { student, rate };
    });

    return studentAttendance
      .filter(item => item.rate < 90)
      .sort((a, b) => a.rate - b.rate);
  };

  const handleRetry = () => {
    loadReportData();
  };

  if (loading) {
    return <Loading className="p-6" />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={handleRetry} />
      </div>
    );
  }

  const stats = getOverallStats();
  const topPerformers = getTopPerformers();
  const attendanceIssues = getAttendanceIssues();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-text">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">
          Comprehensive insights into your classroom performance
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall Grade Average"
          value={`${stats.overallGradeAverage}%`}
          icon="BookOpen"
          trend={stats.overallGradeAverage >= 80 ? "up" : "down"}
          trendValue={`Class average`}
          gradient="from-success to-emerald-500"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.overallAttendanceRate}%`}
          icon="Calendar"
          trend={stats.overallAttendanceRate >= 90 ? "up" : "down"}
          trendValue={`Overall rate`}
          gradient="from-info to-blue-500"
        />
        <StatCard
          title="Assignment Completion"
          value={`${stats.completionRate}%`}
          icon="CheckCircle"
          trend={stats.completionRate >= 80 ? "up" : "down"}
          trendValue={`Submission rate`}
          gradient="from-warning to-yellow-500"
        />
        <StatCard
          title="Total Students"
          value={reportData.students.length}
          icon="Users"
          trend="neutral"
          trendValue={`Active students`}
          gradient="from-primary to-secondary"
        />
      </div>

      {/* Grade Distribution */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <ApperIcon name="BarChart3" className="w-5 h-5 mr-2 text-primary" />
            Students by Grade Level
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Object.entries(stats.gradeDistribution).map(([grade, count]) => (
              <div key={grade} className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                <div className="text-2xl font-bold text-primary">Grade {grade}</div>
                <div className="text-sm text-gray-600">{count} students</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Top Performers and Attendance Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <ApperIcon name="Trophy" className="w-5 h-5 mr-2 text-warning" />
              Top Performers
            </h3>
            <div className="space-y-3">
              {topPerformers.map((item, index) => (
                <div key={item.student.Id} className="flex items-center justify-between p-3 bg-gradient-to-r from-success/5 to-emerald-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-success/20 to-emerald-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-success">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.student.firstName} {item.student.lastName}
                      </div>
                      <div className="text-sm text-gray-600">Grade {item.student.grade}</div>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-success">{item.average}%</div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Attendance Issues */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <ApperIcon name="AlertTriangle" className="w-5 h-5 mr-2 text-error" />
              Attendance Concerns
            </h3>
            {attendanceIssues.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="CheckCircle" className="w-12 h-12 text-success mx-auto mb-2" />
                <p className="text-gray-600">No attendance issues found!</p>
                <p className="text-sm text-gray-500">All students have good attendance.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {attendanceIssues.map((item) => (
                  <div key={item.student.Id} className="flex items-center justify-between p-3 bg-gradient-to-r from-error/5 to-red-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-error/20 to-red-300 rounded-full flex items-center justify-center">
                        <ApperIcon name="AlertCircle" className="w-4 h-4 text-error" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {item.student.firstName} {item.student.lastName}
                        </div>
                        <div className="text-sm text-gray-600">Grade {item.student.grade}</div>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-error">{item.rate}%</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Assignment Overview */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <ApperIcon name="FileText" className="w-5 h-5 mr-2 text-info" />
            Assignment Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportData.assignments.map((assignment) => {
              const assignmentGrades = reportData.grades.filter(g => g.assignmentId === assignment.Id);
              const average = assignmentGrades.length > 0 
                ? Math.round(assignmentGrades.reduce((sum, g) => sum + g.score, 0) / assignmentGrades.length / assignment.totalPoints * 100)
                : 0;
              const completionRate = Math.round((assignmentGrades.length / reportData.students.length) * 100);

              return (
                <div key={assignment.Id} className="p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{assignment.title}</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Average Score:</span>
                      <span className="font-medium text-gray-900">{average}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completion:</span>
                      <span className="font-medium text-gray-900">{completionRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium text-gray-900">{assignment.category}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Reports;
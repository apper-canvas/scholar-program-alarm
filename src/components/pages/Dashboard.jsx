import React, { useEffect, useState } from "react";
import StatCard from "@/components/molecules/StatCard";
import StudentCard from "@/components/molecules/StudentCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Icon from "@/components/ui/Icon";
import { studentsService } from "@/services/api/studentsService";
import { attendanceService } from "@/services/api/attendanceService";
import { gradesService } from "@/services/api/gradesService";
import { assignmentsService } from "@/services/api/assignmentsService";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageGrade: 0,
    attendanceRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [studentsData, attendanceData, gradesData, assignmentsData] = await Promise.all([
        studentsService.getAll(),
        attendanceService.getAll(),
        gradesService.getAll(),
        assignmentsService.getAll()
      ]);

      setStudents(studentsData);
      setRecentStudents(studentsData.slice(0, 6));

      // Calculate stats
      const totalStudents = studentsData.length;
      
      // Calculate average grade
      const totalGrades = gradesData.reduce((sum, grade) => sum + grade.score, 0);
      const totalPossiblePoints = gradesData.reduce((sum, grade) => {
        const assignment = assignmentsData.find(a => a.Id === grade.assignmentId);
        return sum + (assignment?.totalPoints || 100);
      }, 0);
      const averageGrade = totalPossiblePoints > 0 ? Math.round((totalGrades / totalPossiblePoints) * 100) : 0;

      // Calculate attendance rate
      const totalAttendanceRecords = attendanceData.length;
      const presentRecords = attendanceData.filter(record => record.status === "present").length;
      const attendanceRate = totalAttendanceRecords > 0 ? Math.round((presentRecords / totalAttendanceRecords) * 100) : 0;

      setStats({
        totalStudents,
        averageGrade,
        attendanceRate
      });

    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleStudentClick = (student) => {
    navigate(`/students/${student.Id}`);
  };

  const handleRetry = () => {
    loadDashboardData();
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

  if (students.length === 0) {
    return (
      <div className="p-6">
        <Empty
          title="No students found"
          description="Start by adding your first student to begin managing your classroom."
          actionLabel="Add Student"
          onAction={() => navigate("/students")}
          icon="Users"
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening in your classroom today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Students"
          value={stats.totalStudents}
          icon="Users"
          trend="up"
          trendValue="+2 this week"
          gradient="from-primary to-secondary"
        />
        <StatCard
          title="Average Grade"
          value={`${stats.averageGrade}%`}
          icon="BookOpen"
          trend={stats.averageGrade >= 80 ? "up" : "down"}
          trendValue={stats.averageGrade >= 80 ? "+3% from last month" : "-2% from last month"}
          gradient="from-success to-emerald-500"
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon="Calendar"
          trend={stats.attendanceRate >= 90 ? "up" : "down"}
          trendValue={stats.attendanceRate >= 90 ? "Great!" : "Needs attention"}
          gradient="from-info to-blue-500"
        />
      </div>

      {/* Recent Students */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Recent Students</h2>
          <button
            onClick={() => navigate("/students")}
            className="text-primary hover:text-secondary font-medium text-sm"
          >
            View all students →
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentStudents.map((student) => (
            <StudentCard
              key={student.Id}
              student={student}
              onClick={() => handleStudentClick(student)}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {[
          { title: "Add Student", icon: "UserPlus", action: () => navigate("/students") },
          { title: "Take Attendance", icon: "Calendar", action: () => navigate("/attendance") },
          { title: "Enter Grades", icon: "BookOpen", action: () => navigate("/grades") },
          { title: "View Reports", icon: "FileText", action: () => navigate("/reports") }
        ].map((item) => (
          <button
            key={item.title}
            onClick={item.action}
            className="p-4 bg-white rounded-lg card-shadow hover-scale text-left transition-all duration-200 hover:shadow-lg group"
          >
<div className="flex items-center space-x-3">
<div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
<Icon name={item.icon} className="w-5 h-5 text-primary" />
</div>
<span className="font-medium text-gray-900">{item.title}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
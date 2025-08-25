import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import AttendanceGrid from "@/components/organisms/AttendanceGrid";
import ApperIcon from "@/components/ApperIcon";
import { studentsService } from "@/services/api/studentsService";
import { attendanceService } from "@/services/api/attendanceService";

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, attendanceDataResult] = await Promise.all([
        studentsService.getAll(),
        attendanceService.getAll()
      ]);

      setStudents(studentsData);
      setAttendanceData(attendanceDataResult);
    } catch (err) {
      setError(err.message || "Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkAttendance = async (studentId, date, status) => {
    try {
      const existingRecord = attendanceData.find(
        record => record.studentId === studentId && 
        new Date(record.date).toDateString() === new Date(date).toDateString()
      );

      const attendanceRecord = {
        studentId,
        date,
        status,
        reason: status === "excused" ? "Excused absence" : 
                status === "late" ? "Late arrival" : ""
      };

      if (existingRecord) {
        await attendanceService.update(existingRecord.Id, attendanceRecord);
        toast.success("Attendance updated");
      } else {
        await attendanceService.create(attendanceRecord);
        toast.success("Attendance recorded");
      }

      // Reload attendance data
      const updatedAttendance = await attendanceService.getAll();
      setAttendanceData(updatedAttendance);
    } catch (err) {
      toast.error("Failed to update attendance");
    }
  };

  const markAllPresent = async () => {
    try {
      const promises = students.map(student => {
        const existingRecord = attendanceData.find(
          record => record.studentId === student.Id && 
          new Date(record.date).toDateString() === new Date(selectedDate).toDateString()
        );

        const attendanceRecord = {
          studentId: student.Id,
          date: selectedDate,
          status: "present",
          reason: ""
        };

        return existingRecord 
          ? attendanceService.update(existingRecord.Id, attendanceRecord)
          : attendanceService.create(attendanceRecord);
      });

      await Promise.all(promises);
      toast.success("All students marked as present");

      // Reload attendance data
      const updatedAttendance = await attendanceService.getAll();
      setAttendanceData(updatedAttendance);
    } catch (err) {
      toast.error("Failed to mark all present");
    }
  };

  const getAttendanceStats = () => {
    const todayRecords = attendanceData.filter(
      record => new Date(record.date).toDateString() === new Date(selectedDate).toDateString()
    );

    const present = todayRecords.filter(r => r.status === "present").length;
    const absent = todayRecords.filter(r => r.status === "absent").length;
    const late = todayRecords.filter(r => r.status === "late").length;
    const excused = todayRecords.filter(r => r.status === "excused").length;

    return { present, absent, late, excused };
  };

  const handleRetry = () => {
    loadData();
  };

  const stats = getAttendanceStats();

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
          description="Add students to your class before taking attendance."
          actionLabel="Add Students"
          onAction={() => {/* Would navigate to students */}}
          icon="Users"
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Attendance Tracking</h1>
          <p className="text-gray-600 mt-1">
            Track daily attendance for your students
          </p>
        </div>
        <Button
          onClick={markAllPresent}
          className="inline-flex items-center space-x-2"
        >
          <ApperIcon name="CheckCircle" className="w-5 h-5" />
          <span>Mark All Present</span>
        </Button>
      </div>

      {/* Date Selection and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg card-shadow p-6">
          <Input
            type="date"
            label="Select Date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg card-shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Attendance Summary - {new Date(selectedDate).toLocaleDateString()}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{stats.present}</div>
                <div className="text-sm text-gray-600">Present</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-error">{stats.absent}</div>
                <div className="text-sm text-gray-600">Absent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">{stats.late}</div>
                <div className="text-sm text-gray-600">Late</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-info">{stats.excused}</div>
                <div className="text-sm text-gray-600">Excused</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Grid */}
      <AttendanceGrid
        students={students}
        attendanceData={attendanceData}
        selectedDate={selectedDate}
        onMarkAttendance={handleMarkAttendance}
      />
    </div>
  );
};

export default Attendance;
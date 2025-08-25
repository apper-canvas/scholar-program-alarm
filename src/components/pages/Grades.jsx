import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import GradeEntry from "@/components/molecules/GradeEntry";
import ApperIcon from "@/components/ApperIcon";
import { studentsService } from "@/services/api/studentsService";
import { assignmentsService } from "@/services/api/assignmentsService";
import { gradesService } from "@/services/api/gradesService";

const Grades = () => {
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [studentsData, assignmentsData, gradesData] = await Promise.all([
        studentsService.getAll(),
        assignmentsService.getAll(),
        gradesService.getAll()
      ]);

      setStudents(studentsData);
      setAssignments(assignmentsData);
      setGrades(gradesData);
      
      if (assignmentsData.length > 0 && !selectedAssignment) {
        setSelectedAssignment(assignmentsData[0].Id.toString());
      }
    } catch (err) {
      setError(err.message || "Failed to load grades data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveGrade = async (gradeData) => {
    try {
      const existingGrade = grades.find(
        g => g.studentId === gradeData.studentId && g.assignmentId === gradeData.assignmentId
      );

      if (existingGrade) {
        await gradesService.update(existingGrade.Id, gradeData);
        toast.success("Grade updated successfully");
      } else {
        await gradesService.create(gradeData);
        toast.success("Grade saved successfully");
      }
      
      // Reload grades
      const updatedGrades = await gradesService.getAll();
      setGrades(updatedGrades);
    } catch (err) {
      toast.error("Failed to save grade");
    }
  };

  const getGradeForStudent = (studentId, assignmentId) => {
    return grades.find(
      g => g.studentId === studentId && g.assignmentId === parseInt(assignmentId)
    );
  };

  const calculateClassAverage = (assignmentId) => {
    const assignmentGrades = grades.filter(g => g.assignmentId === parseInt(assignmentId));
    if (assignmentGrades.length === 0) return 0;
    
    const assignment = assignments.find(a => a.Id === parseInt(assignmentId));
    if (!assignment) return 0;

    const total = assignmentGrades.reduce((sum, grade) => sum + grade.score, 0);
    const average = (total / assignmentGrades.length / assignment.totalPoints) * 100;
    return Math.round(average);
  };

  const handleRetry = () => {
    loadData();
  };

  const selectedAssignmentData = assignments.find(a => a.Id === parseInt(selectedAssignment));

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

  if (assignments.length === 0) {
    return (
      <div className="p-6">
        <Empty
          title="No assignments found"
          description="Create assignments first before entering grades for students."
          actionLabel="Create Assignment"
          onAction={() => {/* Would navigate to create assignment */}}
          icon="BookOpen"
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Grade Management</h1>
          <p className="text-gray-600 mt-1">
            Enter and manage student grades for assignments
          </p>
        </div>
        <Button className="inline-flex items-center space-x-2">
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>New Assignment</span>
        </Button>
      </div>

      {/* Assignment Selection */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Select Assignment"
            value={selectedAssignment}
            onChange={(e) => setSelectedAssignment(e.target.value)}
          >
            {assignments.map(assignment => (
              <option key={assignment.Id} value={assignment.Id}>
                {assignment.title} ({assignment.totalPoints} points)
              </option>
            ))}
          </Select>
          
          {selectedAssignmentData && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Assignment Details
              </label>
              <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                <h3 className="font-semibold text-gray-900">{selectedAssignmentData.title}</h3>
                <p className="text-sm text-gray-600">Category: {selectedAssignmentData.category}</p>
                <p className="text-sm text-gray-600">
                  Due: {new Date(selectedAssignmentData.dueDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">Class Average: {calculateClassAverage(selectedAssignment)}%</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Grade Entry */}
      {selectedAssignmentData && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Enter Grades - {selectedAssignmentData.title}
          </h2>
          
          {students.length === 0 ? (
            <Empty
              title="No students found"
              description="Add students to your class before entering grades."
              actionLabel="Add Students"
              onAction={() => {/* Would navigate to students */}}
              icon="Users"
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {students.map(student => (
                <GradeEntry
                  key={student.Id}
                  student={student}
                  assignment={selectedAssignmentData}
                  grade={getGradeForStudent(student.Id, selectedAssignment)}
                  onSave={handleSaveGrade}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Grades;
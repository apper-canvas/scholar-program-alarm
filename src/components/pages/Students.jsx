import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StudentTable from "@/components/organisms/StudentTable";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentsService } from "@/services/api/studentsService";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const navigate = useNavigate();

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentsService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    let filtered = students;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.Id.toString().includes(searchTerm)
      );
    }

    // Apply grade filter
    if (gradeFilter) {
      filtered = filtered.filter(student => student.grade === gradeFilter);
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(student => student.status === statusFilter);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, gradeFilter, statusFilter]);

  const handleView = (student) => {
    navigate(`/students/${student.Id}`);
  };

  const handleEdit = (student) => {
    navigate(`/students/${student.Id}/edit`);
  };

  const handleDelete = async (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}?`)) {
      try {
        await studentsService.delete(student.Id);
        toast.success("Student deleted successfully");
        loadStudents();
      } catch (err) {
        toast.error("Failed to delete student");
      }
    }
  };

  const handleAddStudent = () => {
    navigate("/students/new");
  };

  const handleRetry = () => {
    loadStudents();
  };

  const getUniqueGrades = () => {
    return [...new Set(students.map(s => s.grade))].sort();
  };

  const getUniqueStatuses = () => {
    return [...new Set(students.map(s => s.status))];
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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Student Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your student roster and track their information
          </p>
        </div>
        <Button
          onClick={handleAddStudent}
          className="inline-flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="w-5 h-5" />
          <span>Add Student</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg card-shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or ID..."
              className="w-full"
            />
          </div>
          <Select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            label="Filter by Grade"
          >
            <option value="">All Grades</option>
            {getUniqueGrades().map(grade => (
              <option key={grade} value={grade}>Grade {grade}</option>
            ))}
          </Select>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Filter by Status"
          >
            <option value="">All Statuses</option>
            {getUniqueStatuses().map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </Select>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredStudents.length} of {students.length} students
          </span>
          {(searchTerm || gradeFilter || statusFilter) && (
            <button
              onClick={() => {
                setSearchTerm("");
                setGradeFilter("");
                setStatusFilter("");
              }}
              className="text-primary hover:text-secondary font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <Empty
          title="No students found"
          description={
            searchTerm || gradeFilter || statusFilter
              ? "No students match your current filters. Try adjusting your search criteria."
              : "Start building your classroom by adding your first student."
          }
          actionLabel={
            searchTerm || gradeFilter || statusFilter
              ? "Clear Filters"
              : "Add Student"
          }
          onAction={
            searchTerm || gradeFilter || statusFilter
              ? () => {
                  setSearchTerm("");
                  setGradeFilter("");
                  setStatusFilter("");
                }
              : handleAddStudent
          }
          icon="Users"
        />
      ) : (
        <StudentTable
          students={filteredStudents}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default Students;
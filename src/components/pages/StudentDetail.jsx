import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import CommunicationLog from "@/components/organisms/CommunicationLog";
import { studentsService } from "@/services/api/studentsService";

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStudent = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentsService.getById(id);
      setStudent(data);
    } catch (err) {
      setError(err.message || "Failed to load student details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudent();
  }, [id]);

  const getStatusVariant = (status) => {
    switch (status) {
      case "active": return "success";
      case "inactive": return "error";
      case "pending": return "warning";
      default: return "default";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBack = () => {
    navigate('/students');
  };

  const handleEdit = () => {
    navigate(`/students/${id}/edit`);
  };

  if (loading) {
    return <Loading className="p-6" />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadStudent} />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6">
        <Error message="Student not found" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="inline-flex items-center space-x-2"
          >
            <ApperIcon name="ArrowLeft" className="w-5 h-5" />
            <span>Back to Students</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-gray-600 mt-1">Student Profile & Communication</p>
          </div>
        </div>
        <Button
          onClick={handleEdit}
          className="inline-flex items-center space-x-2"
        >
          <ApperIcon name="Edit" className="w-5 h-5" />
          <span>Edit Student</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Information */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Info Card */}
          <Card>
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="User" className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {student.firstName} {student.lastName}
              </h3>
              <p className="text-gray-600">Grade {student.grade}</p>
              <div className="mt-3">
                <Badge variant={getStatusVariant(student.status)}>
                  {student.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Hash" className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Student ID</p>
                  <p className="text-sm text-gray-600">{student.Id}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ApperIcon name="Calendar" className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Date of Birth</p>
                  <p className="text-sm text-gray-600">{formatDate(student.dateOfBirth)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <ApperIcon name="GraduationCap" className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Enrollment Date</p>
                  <p className="text-sm text-gray-600">{formatDate(student.enrollmentDate)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <ApperIcon name="MapPin" className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Address</p>
                  <p className="text-sm text-gray-600">{student.address}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Student Contact Card */}
          <Card>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Student Contact
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <ApperIcon name="Mail" className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{student.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ApperIcon name="Phone" className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">{student.phone}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Parent Contact Card */}
          <Card>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Parent/Guardian Contact
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <ApperIcon name="User" className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Name</p>
                  <p className="text-sm text-gray-600">{student.parentName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ApperIcon name="Mail" className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">{student.parentEmail}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ApperIcon name="Phone" className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Phone</p>
                  <p className="text-sm text-gray-600">{student.parentPhone}</p>
                </div>
              </div>

              <div className="pt-4 flex space-x-2">
                <Button
                  variant="outline"
                  size="small"
                  className="flex-1 inline-flex items-center justify-center space-x-2"
                  onClick={() => window.open(`mailto:${student.parentEmail}`)}
                >
                  <ApperIcon name="Mail" className="w-4 h-4" />
                  <span>Email</span>
                </Button>
                <Button
                  variant="outline"
                  size="small"
                  className="flex-1 inline-flex items-center justify-center space-x-2"
                  onClick={() => window.open(`tel:${student.parentPhone}`)}
                >
                  <ApperIcon name="Phone" className="w-4 h-4" />
                  <span>Call</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Communication Log */}
        <div className="lg:col-span-2">
          <CommunicationLog studentId={student.Id} />
        </div>
      </div>
    </div>
  );
};

export default StudentDetail;
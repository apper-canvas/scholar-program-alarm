import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { communicationService } from "@/services/api/communicationService";

const CommunicationLog = ({ studentId }) => {
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: "phone",
    subject: "",
    notes: "",
    followUpRequired: false
  });

  const loadCommunications = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await communicationService.getByStudentId(studentId);
      setCommunications(data);
    } catch (err) {
      setError(err.message || "Failed to load communications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      loadCommunications();
    }
  }, [studentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.notes.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const communicationData = {
        ...formData,
        studentId: parseInt(studentId),
        teacherId: 1, // Mock teacher ID
        teacherName: "Current Teacher" // Mock teacher name
      };

      if (editingId) {
        await communicationService.update(editingId, communicationData);
        toast.success("Communication updated successfully");
      } else {
        await communicationService.create(communicationData);
        toast.success("Communication recorded successfully");
      }

      loadCommunications();
      resetForm();
    } catch (err) {
      toast.error(editingId ? "Failed to update communication" : "Failed to record communication");
    }
  };

  const handleEdit = (communication) => {
    setFormData({
      date: communication.date,
      type: communication.type,
      subject: communication.subject,
      notes: communication.notes,
      followUpRequired: communication.followUpRequired
    });
    setEditingId(communication.Id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this communication record?")) {
      return;
    }

    try {
      await communicationService.delete(id);
      toast.success("Communication deleted successfully");
      loadCommunications();
    } catch (err) {
      toast.error("Failed to delete communication");
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: "phone",
      subject: "",
      notes: "",
      followUpRequired: false
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "phone": return "Phone";
      case "email": return "Mail";
      case "meeting": return "Users";
      case "note": return "FileText";
      default: return "MessageSquare";
    }
  };

  const getTypeVariant = (type) => {
    switch (type) {
      case "phone": return "info";
      case "email": return "default";
      case "meeting": return "success";
      case "note": return "warning";
      default: return "default";
    }
  };

  if (loading) {
    return <Loading className="p-6" />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Error message={error} onRetry={loadCommunications} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Communication Log
          </h3>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center space-x-2"
          >
            <ApperIcon name={showAddForm ? "X" : "Plus"} className="w-5 h-5" />
            <span>{showAddForm ? "Cancel" : "Add Communication"}</span>
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="date"
                label="Date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Communication Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="phone">Phone Call</option>
                  <option value="email">Email</option>
                  <option value="meeting">In-Person Meeting</option>
                  <option value="note">General Note</option>
                </select>
              </div>
            </div>

            <Input
              label="Subject"
              placeholder="Brief subject or topic discussed..."
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Detailed notes about the communication..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="followUp"
                checked={formData.followUpRequired}
                onChange={(e) => setFormData({ ...formData, followUpRequired: e.target.checked })}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="followUp" className="ml-2 text-sm text-gray-700">
                Follow-up required
              </label>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingId ? "Update Communication" : "Record Communication"}
              </Button>
            </div>
          </form>
        )}

        {/* Communications List */}
        {communications.length === 0 ? (
          <Empty
            title="No communications recorded"
            description="Start building a communication history by recording your first interaction with the student's parents or guardians."
            actionLabel="Add Communication"
            onAction={() => setShowAddForm(true)}
            icon="MessageSquare"
          />
        ) : (
          <div className="space-y-4">
            {communications.map((communication) => (
              <div
                key={communication.Id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/30 rounded-full flex items-center justify-center">
                      <ApperIcon 
                        name={getTypeIcon(communication.type)} 
                        className="w-5 h-5 text-primary" 
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">
                          {communication.subject}
                        </h4>
                        <Badge variant={getTypeVariant(communication.type)}>
                          {communication.type}
                        </Badge>
                        {communication.followUpRequired && (
                          <Badge variant="warning">Follow-up required</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDate(communication.date)} • by {communication.teacherName}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleEdit(communication)}
                      className="inline-flex items-center"
                    >
                      <ApperIcon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      onClick={() => handleDelete(communication.Id)}
                      className="inline-flex items-center text-error hover:bg-error/10"
                    >
                      <ApperIcon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm leading-relaxed pl-13">
                  {communication.notes}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default CommunicationLog;
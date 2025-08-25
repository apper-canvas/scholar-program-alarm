import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const GradeEntry = ({ assignment, student, grade, onSave }) => {
  const [score, setScore] = useState(grade?.score || "");
  const [comments, setComments] = useState(grade?.comments || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        studentId: student.Id,
        assignmentId: assignment.Id,
        score: parseFloat(score),
        comments,
        submittedDate: new Date().toISOString()
      });
    } finally {
      setIsSaving(false);
    }
  };

  const percentage = score ? Math.round((parseFloat(score) / assignment.totalPoints) * 100) : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900">
            {student.firstName} {student.lastName}
          </h4>
          <p className="text-sm text-gray-600">{assignment.title}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">
            {score ? `${score}/${assignment.totalPoints}` : "Not graded"}
          </div>
          {score && (
            <div className={`text-sm font-medium ${
              percentage >= 90 ? "text-success" :
              percentage >= 80 ? "text-warning" :
              percentage >= 70 ? "text-info" :
              "text-error"
            }`}>
              {percentage}%
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          label="Score"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder="Enter score"
          min="0"
          max={assignment.totalPoints}
        />
        <Input
          label="Comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder="Optional feedback"
        />
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={!score || isSaving}
          className="inline-flex items-center space-x-2"
        >
          {isSaving ? (
            <ApperIcon name="Loader" className="w-4 h-4 animate-spin" />
          ) : (
            <ApperIcon name="Save" className="w-4 h-4" />
          )}
          <span>Save Grade</span>
        </Button>
      </div>
    </div>
  );
};

export default GradeEntry;
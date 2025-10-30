import React, { useState } from "react";
import { toast } from "react-toastify";
import { format, parseISO } from "date-fns";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Modal from "@/components/molecules/Modal";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";
import SearchBar from "@/components/molecules/SearchBar";
import FilterBar from "@/components/molecules/FilterBar";
import Pagination from "@/components/molecules/Pagination";
import DataTable from "@/components/organisms/DataTable";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useData } from "@/hooks/useData";
import { useSearch } from "@/hooks/useSearch";
import { usePagination } from "@/hooks/usePagination";
import { activityService } from "@/services/api/activityService";
import { departmentService } from "@/services/api/departmentService";
import { studentService } from "@/services/api/studentService";
import { teacherService } from "@/services/api/teacherService";

const Activities = () => {
  const { data: activities, loading, error, reload, setData } = useData(() => activityService.getAll());
  const { data: departments } = useData(() => departmentService.getAll());
  const { data: students } = useData(() => studentService.getAll());
  const { data: teachers } = useData(() => teacherService.getAll());
  
  const [filters, setFilters] = useState({
    department: "",
    status: ""
  });

  // Apply filters first
  const filteredByFilters = activities.filter(activity => {
    if (filters.department && activity.departmentId !== filters.department) return false;
    if (filters.status && activity.status !== filters.status) return false;
    return true;
  });

  // Then apply search
  const { searchQuery, setSearchQuery, filteredData } = useSearch(filteredByFilters, ["name", "activityId", "description"]);
  const { currentPage, totalPages, paginatedData, goToPage } = usePagination(filteredData);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [formData, setFormData] = useState({
    activityId: "",
    name: "",
    date: "",
    departmentId: "",
    description: "",
    participants: [],
    status: "Planned"
  });

  const [participantType, setParticipantType] = useState("");
  const [participantId, setParticipantId] = useState("");

  const resetForm = () => {
    setFormData({
      activityId: "",
      name: "",
      date: "",
      departmentId: "",
      description: "",
      participants: [],
      status: "Planned"
    });
    setParticipantType("");
    setParticipantId("");
    setSelectedActivity(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (activity) => {
    setSelectedActivity(activity);
    setFormData({
      activityId: activity.activityId,
      name: activity.name,
      date: activity.date,
      departmentId: activity.departmentId,
      description: activity.description,
      participants: activity.participants || [],
      status: activity.status
    });
    setShowModal(true);
  };

  const handleDelete = (activity) => {
    setSelectedActivity(activity);
    setShowDeleteDialog(true);
  };

  const addParticipant = () => {
    if (participantType && participantId && 
        !formData.participants.find(p => p.type === participantType && p.id === participantId)) {
      setFormData(prev => ({
        ...prev,
        participants: [...prev.participants, { type: participantType, id: participantId }]
      }));
      setParticipantType("");
      setParticipantId("");
    }
  };

  const removeParticipant = (participant) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.filter(p => !(p.type === participant.type && p.id === participant.id))
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedActivity) {
        const updated = await activityService.update(selectedActivity.Id, formData);
        setData(prev => prev.map(a => a.Id === selectedActivity.Id ? updated : a));
        toast.success("Activity updated successfully!");
      } else {
        const created = await activityService.create(formData);
        setData(prev => [...prev, created]);
        toast.success("Activity added successfully!");
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      toast.error(err.message || "Failed to save activity");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await activityService.delete(selectedActivity.Id);
      setData(prev => prev.filter(a => a.Id !== selectedActivity.Id));
      toast.success("Activity deleted successfully!");
      setShowDeleteDialog(false);
      setSelectedActivity(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete activity");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ department: "", status: "" });
  };

  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.Id === parseInt(deptId));
    return dept ? dept.name : "-";
  };

  const getParticipantName = (participant) => {
    if (participant.type === "student") {
      const student = students.find(s => s.Id === parseInt(participant.id));
      return student ? student.name : `Student ${participant.id}`;
    } else if (participant.type === "teacher") {
      const teacher = teachers.find(t => t.Id === parseInt(participant.id));
      return teacher ? teacher.name : `Teacher ${participant.id}`;
    }
    return "Unknown";
  };

  const getAvailableParticipants = () => {
    if (participantType === "student") return students;
    if (participantType === "teacher") return teachers;
    return [];
  };

  const columns = [
    { key: "activityId", title: "Activity ID" },
    { key: "name", title: "Activity Name" },
    { 
      key: "date", 
      title: "Date",
      render: (value) => format(parseISO(value), "PP")
    },
    { 
      key: "departmentId", 
      title: "Department",
      render: (value) => getDepartmentName(value)
    },
    { key: "status", title: "Status" },
    { 
      key: "participants", 
      title: "Participants",
      render: (value) => (
        <span className="text-sm text-gray-600">
          {value ? value.length : 0} participants
        </span>
      )
    }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={reload} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Management</h1>
          <p className="text-gray-600">Schedule and manage school activities and events</p>
        </div>
        <Button onClick={handleAdd}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search activities..."
          className="w-full lg:w-96"
        />
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {paginatedData.length} of {filteredData.length} activities
      </div>

      {/* Table */}
      {filteredData.length === 0 ? (
        <Empty
          title="No activities found"
          description="Start by scheduling your first school activity or event."
          icon="Calendar"
          action={
            <Button onClick={handleAdd}>
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          }
        />
      ) : (
        <>
          <DataTable
            columns={columns}
            data={paginatedData}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </>
      )}

      {/* Activity Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedActivity ? "Edit Activity" : "Add New Activity"}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Activity ID"
              id="activityId"
              value={formData.activityId}
              onChange={(e) => setFormData(prev => ({ ...prev, activityId: e.target.value }))}
              required
            />
            <Input
              label="Activity Name"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <Input
              label="Date"
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
            <Select
              label="Department"
              id="departmentId"
              value={formData.departmentId}
              onChange={(e) => setFormData(prev => ({ ...prev, departmentId: e.target.value }))}
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.Id} value={dept.Id}>{dept.name}</option>
              ))}
            </Select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              placeholder="Enter activity description..."
              required
            />
          </div>

          <Select
            label="Status"
            id="status"
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
            required
          >
            <option value="Planned">Planned</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </Select>

          {/* Participants Section */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Participants</h3>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Select
                value={participantType}
                onChange={(e) => {
                  setParticipantType(e.target.value);
                  setParticipantId("");
                }}
              >
                <option value="">Select Type</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </Select>
              <Select
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
                disabled={!participantType}
              >
                <option value="">Select Participant</option>
                {getAvailableParticipants().map(person => (
                  <option key={person.Id} value={person.Id}>
                    {person.name} ({participantType === "student" ? person.studentId : person.teacherId})
                  </option>
                ))}
              </Select>
              <Button type="button" onClick={addParticipant} disabled={!participantType || !participantId}>
                <ApperIcon name="Plus" className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.participants.length > 0 && (
              <div className="space-y-2">
                {formData.participants.map((participant, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                    <div className="flex items-center gap-2">
                      <Badge variant={participant.type === "student" ? "primary" : "success"}>
                        {participant.type}
                      </Badge>
                      <span className="text-sm">{getParticipantName(participant)}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeParticipant(participant)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <ApperIcon name="X" className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedActivity ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Activity"
        message={`Are you sure you want to delete "${selectedActivity?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Activities;
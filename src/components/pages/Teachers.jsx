import React, { useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
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
import { teacherService } from "@/services/api/teacherService";
import { departmentService } from "@/services/api/departmentService";

const Teachers = () => {
  const { data: teachers, loading, error, reload, setData } = useData(() => teacherService.getAll());
  const { data: departments } = useData(() => departmentService.getAll());
  
  const [filters, setFilters] = useState({
    department: ""
  });

  // Apply filters first
  const filteredByFilters = teachers.filter(teacher => {
    if (filters.department && teacher.departmentId !== filters.department) return false;
    return true;
  });

  // Then apply search
  const { searchQuery, setSearchQuery, filteredData } = useSearch(filteredByFilters, ["name", "teacherId", "email", "subjects"]);
  const { currentPage, totalPages, paginatedData, goToPage } = usePagination(filteredData);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [formData, setFormData] = useState({
    teacherId: "",
    name: "",
    gender: "",
    departmentId: "",
    subjects: [],
    contact: "",
    email: "",
    joiningDate: "",
    qualification: ""
  });

  const [subjectInput, setSubjectInput] = useState("");

  const resetForm = () => {
    setFormData({
      teacherId: "",
      name: "",
      gender: "",
      departmentId: "",
      subjects: [],
      contact: "",
      email: "",
      joiningDate: "",
      qualification: ""
    });
    setSubjectInput("");
    setSelectedTeacher(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      teacherId: teacher.teacherId,
      name: teacher.name,
      gender: teacher.gender,
      departmentId: teacher.departmentId,
      subjects: teacher.subjects || [],
      contact: teacher.contact,
      email: teacher.email,
      joiningDate: teacher.joiningDate,
      qualification: teacher.qualification
    });
    setShowModal(true);
  };

  const handleDelete = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDeleteDialog(true);
  };

  const addSubject = () => {
    if (subjectInput.trim() && !formData.subjects.includes(subjectInput.trim())) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, subjectInput.trim()]
      }));
      setSubjectInput("");
    }
  };

  const removeSubject = (subject) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedTeacher) {
        const updated = await teacherService.update(selectedTeacher.Id, formData);
        setData(prev => prev.map(t => t.Id === selectedTeacher.Id ? updated : t));
        toast.success("Teacher updated successfully!");
      } else {
        const created = await teacherService.create(formData);
        setData(prev => [...prev, created]);
        toast.success("Teacher added successfully!");
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      toast.error(err.message || "Failed to save teacher");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await teacherService.delete(selectedTeacher.Id);
      setData(prev => prev.filter(t => t.Id !== selectedTeacher.Id));
      toast.success("Teacher deleted successfully!");
      setShowDeleteDialog(false);
      setSelectedTeacher(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete teacher");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ department: "" });
  };

  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.Id === parseInt(deptId));
    return dept ? dept.name : "-";
  };

  const columns = [
    { key: "teacherId", title: "Teacher ID" },
    { key: "name", title: "Name" },
    { 
      key: "departmentId", 
      title: "Department",
      render: (value) => getDepartmentName(value)
    },
    { key: "subjects", title: "Subjects" },
    { key: "email", title: "Email" },
    { key: "contact", title: "Contact" },
    { 
      key: "joiningDate", 
      title: "Joining Date",
      render: (value) => format(new Date(value), "PP")
    }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={reload} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Management</h1>
          <p className="text-gray-600">Manage teacher profiles and subject assignments</p>
        </div>
        <Button onClick={handleAdd}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search teachers..."
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
        Showing {paginatedData.length} of {filteredData.length} teachers
      </div>

      {/* Table */}
      {filteredData.length === 0 ? (
        <Empty
          title="No teachers found"
          description="Start by adding your first teacher to the system."
          icon="UserCheck"
          action={
            <Button onClick={handleAdd}>
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Teacher
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

      {/* Teacher Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedTeacher ? "Edit Teacher" : "Add New Teacher"}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Teacher ID"
              id="teacherId"
              value={formData.teacherId}
              onChange={(e) => setFormData(prev => ({ ...prev, teacherId: e.target.value }))}
              required
            />
            <Input
              label="Full Name"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <Select
              label="Gender"
              id="gender"
              value={formData.gender}
              onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Select>
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
            <Input
              label="Email"
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
            <Input
              label="Contact Number"
              id="contact"
              value={formData.contact}
              onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
              required
            />
            <Input
              label="Joining Date"
              id="joiningDate"
              type="date"
              value={formData.joiningDate}
              onChange={(e) => setFormData(prev => ({ ...prev, joiningDate: e.target.value }))}
              required
            />
          </div>

          <Input
            label="Qualification"
            id="qualification"
            value={formData.qualification}
            onChange={(e) => setFormData(prev => ({ ...prev, qualification: e.target.value }))}
            required
          />

          {/* Subjects Section */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Subjects</h3>
            <div className="flex gap-2 mb-4">
              <Input
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                placeholder="Enter subject name"
                className="flex-1"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSubject())}
              />
              <Button type="button" onClick={addSubject}>
                <ApperIcon name="Plus" className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.subjects.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.subjects.map((subject, index) => (
                  <div key={index} className="flex items-center bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                    {subject}
                    <button
                      type="button"
                      onClick={() => removeSubject(subject)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      <ApperIcon name="X" className="h-3 w-3" />
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
              {selectedTeacher ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Teacher"
        message={`Are you sure you want to delete "${selectedTeacher?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Teachers;
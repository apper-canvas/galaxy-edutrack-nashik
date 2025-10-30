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
import { studentService } from "@/services/api/studentService";
import { departmentService } from "@/services/api/departmentService";

const Students = () => {
  const { data: students, loading, error, reload, setData } = useData(() => studentService.getAll());
  const { data: departments } = useData(() => departmentService.getAll());
  
  const [filters, setFilters] = useState({
    class: "",
    department: ""
  });

  // Apply filters first
const filteredByFilters = (students || []).filter(student => {
    if (filters.class && student?.class !== filters.class) return false;
    if (filters.department && student?.departmentId !== filters.department) return false;
    return true;
  });

  // Then apply search
  const { searchQuery, setSearchQuery, filteredData } = useSearch(filteredByFilters, ["name", "studentId", "contact"]);
  const { currentPage, totalPages, paginatedData, goToPage } = usePagination(filteredData);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    gender: "",
    dob: "",
    class: "",
    departmentId: "",
    contact: "",
    address: "",
    guardianName: "",
    guardianContact: "",
    guardianRelation: "",
    admissionDate: "",
    profilePhoto: ""
  });

  const resetForm = () => {
    setFormData({
      studentId: "",
      name: "",
      gender: "",
      dob: "",
      class: "",
      departmentId: "",
      contact: "",
      address: "",
      guardianName: "",
      guardianContact: "",
      guardianRelation: "",
      admissionDate: "",
      profilePhoto: ""
    });
    setSelectedStudent(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      gender: student.gender,
      dob: student.dob,
      class: student.class,
      departmentId: student.departmentId,
      contact: student.contact,
      address: student.address,
      guardianName: student.guardianName,
      guardianContact: student.guardianContact,
      guardianRelation: student.guardianRelation,
      admissionDate: student.admissionDate,
      profilePhoto: student.profilePhoto || ""
    });
    setShowModal(true);
  };

  const handleDelete = (student) => {
    setSelectedStudent(student);
    setShowDeleteDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedStudent) {
        const updated = await studentService.update(selectedStudent.Id, formData);
        setData(prev => prev.map(s => s.Id === selectedStudent.Id ? updated : s));
        toast.success("Student updated successfully!");
      } else {
        const created = await studentService.create(formData);
        setData(prev => [...prev, created]);
        toast.success("Student added successfully!");
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      toast.error(err.message || "Failed to save student");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await studentService.delete(selectedStudent.Id);
      setData(prev => prev.filter(s => s.Id !== selectedStudent.Id));
      toast.success("Student deleted successfully!");
      setShowDeleteDialog(false);
      setSelectedStudent(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete student");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ class: "", department: "" });
  };

  const getDepartmentName = (deptId) => {
    const dept = departments.find(d => d.Id === parseInt(deptId));
    return dept ? dept.name : "-";
  };

  const columns = [
    { key: "profilePhoto", title: "Photo" },
    { key: "studentId", title: "Student ID" },
    { key: "name", title: "Name" },
    { key: "class", title: "Class" },
    { 
      key: "departmentId", 
      title: "Department",
      render: (value) => getDepartmentName(value)
    },
    { key: "contact", title: "Contact" },
    { 
      key: "admissionDate", 
      title: "Admission Date",
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
          <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600">Manage student profiles and academic information</p>
        </div>
        <Button onClick={handleAdd}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search students..."
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
        Showing {paginatedData.length} of {filteredData.length} students
      </div>

      {/* Table */}
      {filteredData.length === 0 ? (
        <Empty
          title="No students found"
          description="Start by adding your first student to the system."
          icon="Users"
          action={
            <Button onClick={handleAdd}>
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Student
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

      {/* Student Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedStudent ? "Edit Student" : "Add New Student"}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Student ID"
              id="studentId"
              value={formData.studentId}
              onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
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
            <Input
              label="Date of Birth"
              id="dob"
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
              required
            />
            <Select
              label="Class"
              id="class"
              value={formData.class}
              onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
              required
            >
              <option value="">Select Class</option>
              <option value="10th">10th</option>
              <option value="11th">11th</option>
              <option value="12th">12th</option>
            </Select>
            <Select
              label="Department"
              id="departmentId"
              value={formData.departmentId}
              onChange={(e) => setFormData(prev => ({ ...prev, departmentId: e.target.value }))}
required
            >
              <option value="">Select Department</option>
              {departments?.map(dept => (
                <option key={dept.Id} value={dept.Id}>{dept.name}</option>
              )) || <option disabled>No departments available</option>}
            </Select>
            <Input
              label="Contact Number"
              id="contact"
              value={formData.contact}
              onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
              required
            />
            <Input
              label="Admission Date"
              id="admissionDate"
              type="date"
              value={formData.admissionDate}
              onChange={(e) => setFormData(prev => ({ ...prev, admissionDate: e.target.value }))}
              required
            />
          </div>

          <Input
            label="Address"
            id="address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            required
          />

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Guardian Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Guardian Name"
                id="guardianName"
                value={formData.guardianName}
                onChange={(e) => setFormData(prev => ({ ...prev, guardianName: e.target.value }))}
                required
              />
              <Input
                label="Guardian Contact"
                id="guardianContact"
                value={formData.guardianContact}
                onChange={(e) => setFormData(prev => ({ ...prev, guardianContact: e.target.value }))}
                required
              />
              <Select
                label="Relation"
                id="guardianRelation"
                value={formData.guardianRelation}
                onChange={(e) => setFormData(prev => ({ ...prev, guardianRelation: e.target.value }))}
                required
              >
                <option value="">Select Relation</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Guardian">Guardian</option>
              </Select>
            </div>
          </div>

          <Input
            label="Profile Photo URL"
            id="profilePhoto"
            value={formData.profilePhoto}
            onChange={(e) => setFormData(prev => ({ ...prev, profilePhoto: e.target.value }))}
            placeholder="https://example.com/photo.jpg"
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedStudent ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Student"
        message={`Are you sure you want to delete "${selectedStudent?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Students;
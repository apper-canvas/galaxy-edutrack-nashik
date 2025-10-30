import React, { useState } from "react";
import { toast } from "react-toastify";
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
import { courseService } from "@/services/api/courseService";
import { departmentService } from "@/services/api/departmentService";
import { teacherService } from "@/services/api/teacherService";

const Curriculum = () => {
  const { data: courses, loading, error, reload, setData } = useData(() => courseService.getAll());
  const { data: departments } = useData(() => departmentService.getAll());
  const { data: teachers } = useData(() => teacherService.getAll());
  
  const [filters, setFilters] = useState({
    department: ""
  });

  // Apply filters first
  const filteredByFilters = courses.filter(course => {
    if (filters.department && course.departmentId !== filters.department) return false;
    return true;
  });

  // Then apply search
  const { searchQuery, setSearchQuery, filteredData } = useSearch(filteredByFilters, ["name", "courseId", "description"]);
  const { currentPage, totalPages, paginatedData, goToPage } = usePagination(filteredData);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    courseId: "",
    name: "",
    departmentId: "",
    description: "",
    creditHours: "",
    assignedTeacherId: ""
  });

  const resetForm = () => {
    setFormData({
      courseId: "",
      name: "",
      departmentId: "",
      description: "",
      creditHours: "",
      assignedTeacherId: ""
    });
    setSelectedCourse(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setFormData({
      courseId: course.courseId,
      name: course.name,
      departmentId: course.departmentId,
      description: course.description,
      creditHours: course.creditHours.toString(),
      assignedTeacherId: course.assignedTeacherId
    });
    setShowModal(true);
  };

  const handleDelete = (course) => {
    setSelectedCourse(course);
    setShowDeleteDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const courseData = {
        ...formData,
        creditHours: parseInt(formData.creditHours)
      };

      if (selectedCourse) {
        const updated = await courseService.update(selectedCourse.Id, courseData);
        setData(prev => prev.map(c => c.Id === selectedCourse.Id ? updated : c));
        toast.success("Course updated successfully!");
      } else {
        const created = await courseService.create(courseData);
        setData(prev => [...prev, created]);
        toast.success("Course added successfully!");
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      toast.error(err.message || "Failed to save course");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await courseService.delete(selectedCourse.Id);
      setData(prev => prev.filter(c => c.Id !== selectedCourse.Id));
      toast.success("Course deleted successfully!");
      setShowDeleteDialog(false);
      setSelectedCourse(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete course");
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

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t.Id === parseInt(teacherId));
    return teacher ? teacher.name : "-";
  };

  const getAvailableTeachers = (departmentId) => {
    if (!departmentId) return teachers;
    return teachers.filter(t => t.departmentId === departmentId);
  };

  const columns = [
    { key: "courseId", title: "Course ID" },
    { key: "name", title: "Course Name" },
    { 
      key: "departmentId", 
      title: "Department",
      render: (value) => getDepartmentName(value)
    },
    { key: "creditHours", title: "Credit Hours" },
    { 
      key: "assignedTeacherId", 
      title: "Assigned Teacher",
      render: (value) => getTeacherName(value)
    },
    { 
      key: "description", 
      title: "Description",
      render: (value) => (
        <span className="line-clamp-2 max-w-xs">
          {value}
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
          <h1 className="text-2xl font-bold text-gray-900">Curriculum Management</h1>
          <p className="text-gray-600">Manage courses, credits, and teacher assignments</p>
        </div>
        <Button onClick={handleAdd}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search courses..."
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
        Showing {paginatedData.length} of {filteredData.length} courses
      </div>

      {/* Table */}
      {filteredData.length === 0 ? (
        <Empty
          title="No courses found"
          description="Start by adding your first course to the curriculum."
          icon="BookOpen"
          action={
            <Button onClick={handleAdd}>
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Course
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

      {/* Course Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedCourse ? "Edit Course" : "Add New Course"}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Course ID"
              id="courseId"
              value={formData.courseId}
              onChange={(e) => setFormData(prev => ({ ...prev, courseId: e.target.value }))}
              required
            />
            <Input
              label="Course Name"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <Select
              label="Department"
              id="departmentId"
              value={formData.departmentId}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                departmentId: e.target.value,
                assignedTeacherId: "" // Reset teacher when department changes
              }))}
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.Id} value={dept.Id}>{dept.name}</option>
              ))}
            </Select>
            <Input
              label="Credit Hours"
              id="creditHours"
              type="number"
              min="1"
              max="10"
              value={formData.creditHours}
              onChange={(e) => setFormData(prev => ({ ...prev, creditHours: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              placeholder="Enter course description..."
              required
            />
          </div>

          <Select
            label="Assigned Teacher"
            id="assignedTeacherId"
            value={formData.assignedTeacherId}
            onChange={(e) => setFormData(prev => ({ ...prev, assignedTeacherId: e.target.value }))}
            required
          >
            <option value="">Select Teacher</option>
            {getAvailableTeachers(formData.departmentId).map(teacher => (
              <option key={teacher.Id} value={teacher.Id}>
                {teacher.name} ({teacher.qualification})
              </option>
            ))}
          </Select>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedCourse ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Course"
        message={`Are you sure you want to delete "${selectedCourse?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Curriculum;
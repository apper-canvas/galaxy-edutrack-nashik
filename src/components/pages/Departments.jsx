import React, { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Modal from "@/components/molecules/Modal";
import ConfirmDialog from "@/components/molecules/ConfirmDialog";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { useData } from "@/hooks/useData";
import { useSearch } from "@/hooks/useSearch";
import { departmentService } from "@/services/api/departmentService";
import { studentService } from "@/services/api/studentService";
import { teacherService } from "@/services/api/teacherService";

const Departments = () => {
  const { data: departments, loading, error, reload, setData } = useData(() => departmentService.getAll());
  const { data: students } = useData(() => studentService.getAll());
  const { data: teachers } = useData(() => teacherService.getAll());
  
  const { searchQuery, setSearchQuery, filteredData } = useSearch(departments, ["name", "departmentId", "headOfDepartment"]);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [formData, setFormData] = useState({
    departmentId: "",
    name: "",
    headOfDepartment: "",
    description: ""
  });

  const resetForm = () => {
    setFormData({
      departmentId: "",
      name: "",
      headOfDepartment: "",
      description: ""
    });
    setSelectedDepartment(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setFormData({
      departmentId: department.departmentId,
      name: department.name,
      headOfDepartment: department.headOfDepartment,
      description: department.description
    });
    setShowModal(true);
  };

  const handleDelete = (department) => {
    setSelectedDepartment(department);
    setShowDeleteDialog(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (selectedDepartment) {
        const updated = await departmentService.update(selectedDepartment.Id, formData);
        setData(prev => prev.map(d => d.Id === selectedDepartment.Id ? updated : d));
        toast.success("Department updated successfully!");
      } else {
        const created = await departmentService.create(formData);
        setData(prev => [...prev, created]);
        toast.success("Department added successfully!");
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      toast.error(err.message || "Failed to save department");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await departmentService.delete(selectedDepartment.Id);
      setData(prev => prev.filter(d => d.Id !== selectedDepartment.Id));
      toast.success("Department deleted successfully!");
      setShowDeleteDialog(false);
      setSelectedDepartment(null);
    } catch (err) {
      toast.error(err.message || "Failed to delete department");
    }
  };

  const getStudentCount = (deptId) => {
    return students.filter(s => s.departmentId === deptId.toString()).length;
  };

  const getTeacherCount = (deptId) => {
    return teachers.filter(t => t.departmentId === deptId.toString()).length;
  };

  if (loading) return <Loading variant="cards" />;
  if (error) return <Error message={error} onRetry={reload} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600">Manage academic departments and their structure</p>
        </div>
        <Button onClick={handleAdd}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Search */}
      <div className="flex justify-between items-center">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search departments..."
          className="w-full lg:w-96"
        />
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {filteredData.length} departments
      </div>

      {/* Departments Grid */}
      {filteredData.length === 0 ? (
        <Empty
          title="No departments found"
          description="Start by creating your first department to organize your school structure."
          icon="Building"
          action={
            <Button onClick={handleAdd}>
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((department) => (
            <div key={department.Id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <ApperIcon name="Building" className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{department.name}</h3>
                    <p className="text-sm text-gray-500">{department.departmentId}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(department)}
                  >
                    <ApperIcon name="Edit" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(department)}
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 font-medium mb-1">Head of Department</p>
                <p className="text-gray-900">{department.headOfDepartment}</p>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {department.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">{getStudentCount(department.Id)}</p>
                  <p className="text-sm text-gray-500">Students</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{getTeacherCount(department.Id)}</p>
                  <p className="text-sm text-gray-500">Teachers</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Department Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedDepartment ? "Edit Department" : "Add New Department"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Department ID"
              id="departmentId"
              value={formData.departmentId}
              onChange={(e) => setFormData(prev => ({ ...prev, departmentId: e.target.value }))}
              required
            />
            <Input
              label="Department Name"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <Input
            label="Head of Department"
            id="headOfDepartment"
            value={formData.headOfDepartment}
            onChange={(e) => setFormData(prev => ({ ...prev, headOfDepartment: e.target.value }))}
            required
          />

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200"
              placeholder="Enter department description..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedDepartment ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Department"
        message={`Are you sure you want to delete "${selectedDepartment?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default Departments;
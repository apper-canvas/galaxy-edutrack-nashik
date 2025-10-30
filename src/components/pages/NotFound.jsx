import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-primary-100">
            <ApperIcon name="AlertCircle" className="h-10 w-10 text-primary-600" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-4">
          <Button onClick={() => navigate("/")} size="lg" className="w-full">
            <ApperIcon name="Home" className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={() => navigate("/students")}>
              Students
            </Button>
            <Button variant="outline" onClick={() => navigate("/teachers")}>
              Teachers
            </Button>
            <Button variant="outline" onClick={() => navigate("/activities")}>
              Activities
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
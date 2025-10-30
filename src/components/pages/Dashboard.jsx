import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StatsCard from "@/components/molecules/StatsCard";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { teacherService } from "@/services/api/teacherService";
import { departmentService } from "@/services/api/departmentService";
import { activityService } from "@/services/api/activityService";
import { format, isAfter } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    departments: 0,
    activities: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [students, teachers, departments, activities] = await Promise.all([
        studentService.getAll(),
        teacherService.getAll(),
        departmentService.getAll(),
        activityService.getAll()
      ]);

      setStats({
        students: students.length,
        teachers: teachers.length,
        departments: departments.length,
        activities: activities.length
      });

      // Recent activities (last 5)
      const recent = activities
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5);
      setRecentActivities(recent);

      // Upcoming events
      const today = new Date();
      const upcoming = activities
        .filter(activity => isAfter(new Date(activity.date), today))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);
      setUpcomingEvents(upcoming);

    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleQuickAdd = (module) => {
    toast.info(`Redirecting to add new ${module}...`);
    navigate(`/${module}`);
  };

  if (loading) {
    return <Loading variant="stats" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome to EduTrack Nashik</h1>
            <p className="text-primary-100">
              Manage your school operations efficiently with comprehensive tracking and reporting.
            </p>
          </div>
          <div className="hidden md:block">
            <ApperIcon name="GraduationCap" className="h-16 w-16 text-primary-200" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value={stats.students.toLocaleString()}
          icon="Users"
          color="primary"
          onClick={() => navigate("/students")}
        />
        <StatsCard
          title="Total Teachers"
          value={stats.teachers.toLocaleString()}
          icon="UserCheck"
          color="success"
          onClick={() => navigate("/teachers")}
        />
        <StatsCard
          title="Departments"
          value={stats.departments.toLocaleString()}
          icon="Building"
          color="warning"
          onClick={() => navigate("/departments")}
        />
        <StatsCard
          title="Activities"
          value={stats.activities.toLocaleString()}
          icon="Calendar"
          color="purple"
          onClick={() => navigate("/activities")}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="flex flex-col items-center p-4 h-auto"
            onClick={() => handleQuickAdd("students")}
          >
            <ApperIcon name="UserPlus" className="h-6 w-6 mb-2" />
            <span className="text-sm">Add Student</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center p-4 h-auto"
            onClick={() => handleQuickAdd("teachers")}
          >
            <ApperIcon name="UserCheck" className="h-6 w-6 mb-2" />
            <span className="text-sm">Add Teacher</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center p-4 h-auto"
            onClick={() => handleQuickAdd("departments")}
          >
            <ApperIcon name="Building" className="h-6 w-6 mb-2" />
            <span className="text-sm">Add Department</span>
          </Button>
          <Button 
            variant="outline" 
            className="flex flex-col items-center p-4 h-auto"
            onClick={() => handleQuickAdd("activities")}
          >
            <ApperIcon name="Calendar" className="h-6 w-6 mb-2" />
            <span className="text-sm">Add Activity</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/activities")}
            >
              View All
            </Button>
          </div>
          
          {recentActivities.length === 0 ? (
            <Empty
              title="No activities yet"
              description="Start by creating your first activity."
              icon="Calendar"
            />
          ) : (
            <div className="space-y-3">
{recentActivities.map((activity, index) => (
                <div key={activity.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{activity.name}</h3>
                    <p className="text-sm text-gray-600">{format(new Date(activity.date), "PPP")}</p>
                  </div>
                  <Badge
                    variant={
                      activity.status === "Completed" ? "success" :
                      activity.status === "Ongoing" ? "warning" : "default"
                    }
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Events */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/activities")}
            >
              View All
            </Button>
          </div>
          
          {upcomingEvents.length === 0 ? (
            <Empty
              title="No upcoming events"
              description="Schedule your next activity."
              icon="CalendarPlus"
            />
          ) : (
            <div className="space-y-3">
{upcomingEvents.map((event, index) => (
                <div key={event.id || index} className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{event.name}</h3>
                    <p className="text-sm text-gray-600">{format(new Date(event.date), "PPP")}</p>
                  </div>
                  <div className="text-right">
                    <ApperIcon name="Clock" className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
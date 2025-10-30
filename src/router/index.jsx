import { createBrowserRouter } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "@/components/organisms/Layout";

const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const Students = lazy(() => import("@/components/pages/Students"));
const Teachers = lazy(() => import("@/components/pages/Teachers"));
const Departments = lazy(() => import("@/components/pages/Departments"));
const Curriculum = lazy(() => import("@/components/pages/Curriculum"));
const Activities = lazy(() => import("@/components/pages/Activities"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const mainRoutes = [
  {
    path: "",
    index: true,
    element: <Suspense fallback={<div>Loading.....</div>}><Dashboard /></Suspense>
  },
  {
    path: "students",
    element: <Suspense fallback={<div>Loading.....</div>}><Students /></Suspense>
  },
  {
    path: "teachers",
    element: <Suspense fallback={<div>Loading.....</div>}><Teachers /></Suspense>
  },
  {
    path: "departments",
    element: <Suspense fallback={<div>Loading.....</div>}><Departments /></Suspense>
  },
  {
    path: "curriculum",
    element: <Suspense fallback={<div>Loading.....</div>}><Curriculum /></Suspense>
  },
  {
    path: "activities",
    element: <Suspense fallback={<div>Loading.....</div>}><Activities /></Suspense>
  },
  {
    path: "*",
    element: <Suspense fallback={<div>Loading.....</div>}><NotFound /></Suspense>
  }
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes
  }
];

export const router = createBrowserRouter(routes);
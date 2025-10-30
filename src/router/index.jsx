import { createBrowserRouter } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import Root from "@/layouts/Root";
import { getRouteConfig } from "@/router/route.utils";
import Layout from "@/components/organisms/Layout";

const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const Students = lazy(() => import("@/components/pages/Students"));
const Teachers = lazy(() => import("@/components/pages/Teachers"));
const Departments = lazy(() => import("@/components/pages/Departments"));
const Curriculum = lazy(() => import("@/components/pages/Curriculum"));
const Activities = lazy(() => import("@/components/pages/Activities"));
const NotFound = lazy(() => import("@/components/pages/NotFound"));

const createRoute = ({
  path,
  index,
  element,
  access,
  children,
  ...meta
}) => {
  const configPath = index ? "/" : (path.startsWith('/') ? path : `/${path}`);
  const config = getRouteConfig(configPath);
  const finalAccess = access || config?.allow;

  const route = {
    ...(index ? { index: true } : { path }),
    element: element ? <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100"><div className="text-center space-y-4"><svg className="animate-spin h-12 w-12 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg></div></div>}>{element}</Suspense> : element,
    handle: {
      access: finalAccess,
      ...meta,
    },
  };

  if (children && children.length > 0) {
    route.children = children;
  }

  return route;
};

const mainRoutes = [
  createRoute({ index: true, element: <Dashboard /> }),
  createRoute({ path: "students", element: <Students /> }),
  createRoute({ path: "teachers", element: <Teachers /> }),
  createRoute({ path: "departments", element: <Departments /> }),
  createRoute({ path: "curriculum", element: <Curriculum /> }),
  createRoute({ path: "activities", element: <Activities /> }),
  createRoute({ path: "*", element: <NotFound /> })
];

const routes = [
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Layout />,
        children: mainRoutes
      }
    ]
  }
];

export const router = createBrowserRouter(routes);
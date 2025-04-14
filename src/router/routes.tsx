import { RouteObject, useRoutes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import NotesPage from "../pages/NotesPage";
// import TasksPage from "../pages/TasksPage";
// import NotFoundPage from "../pages/errors/NotFoundPage";

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/notes",
    element: <NotesPage />,
  },
  // {
  //   path: "/tasks",
  //   element: <TasksPage />,
  // },
  // {
  //   path: "*",
  //   element: <NotFoundPage />
  // },
];

export function AppRoutes() {
  return useRoutes(appRoutes);
}

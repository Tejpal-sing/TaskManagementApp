import React, { FC } from 'react';
import './App.css';
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";



const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};


const App: FC = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navigate to="/signin" replace /> 
    },
    {
      path: "/signup",
      element: <SignUp />
    },
    {
      path: "/signin",
      element: <SignIn />
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      )
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;

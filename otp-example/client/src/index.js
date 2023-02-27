import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Pages
import RequestOtp from "./pages/RequestOtp";
import VerifyOtp from "./pages/VerifyOtp";
import Error404 from "./pages/Error404";

// Define routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <RequestOtp />,
    index: true,
  },
  {
    path: "/verify",
    element: <VerifyOtp />,
  },
  {
    path: "*",
    element: <Error404 />,
  },
]);

// Render app
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);

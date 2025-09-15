import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthLayout from "./components/AuthLayout.jsx";
import Signup from "./components/pages/Signup.jsx";
import Login from "./components/pages/Login.jsx";
import Layout from "./components/Layout.jsx";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import { AuthInitializer } from "./components/AuthInitializer.jsx";
import Profile from "./components/pages/Profile.jsx";
import ForgotPassword from "./components/pages/ForgotPassword.jsx";
import ResetPassword from "./components/pages/ResetPassword.jsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <AuthLayout authentication={false}>
            <App />
          </AuthLayout>
        ),
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authentication={false}>
            <Signup />
          </AuthLayout>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "/profile",
        element: (
          <AuthLayout authentication={false}>
            <Profile />
          </AuthLayout>
        ),
      },
      {
        path: "/forgot-password",
        element: (
          <AuthLayout authentication={false}>
            <ForgotPassword />
          </AuthLayout>
        ),
      },
      {
        path: "/reset-password/:token",
        element: (
          <AuthLayout authentication={false}>
            <ResetPassword />
          </AuthLayout>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
    </Provider>
  </StrictMode>
);

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EmailAccounts from "./pages/EmailAccounts";
import EmailAccountForm from "./pages/EmailAccountForm";
import ContactForms from "./pages/ContactForms";
import ContactFormDetails from "./pages/ContactFormDetails";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/email-accounts"
              element={<EmailAccounts />}
            />

            <Route
              path="/email-accounts/new"
              element={<EmailAccountForm />}
            />

            <Route
              path="/email-accounts/:id/edit"
              element={<EmailAccountForm />}
            />

            <Route
              path="/contact-forms"
              element={<ContactForms />}
            />

            <Route
              path="/contact-forms/:id"
              element={
                <ContactFormDetails />
              }
            />
          </Route>

          <Route
            path="*"
            element={
              <Navigate to="/" replace />
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}


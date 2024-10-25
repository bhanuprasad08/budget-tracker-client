import "./App.css"
import Login from "./components/login"
import SignUp from "./components/signup"
import Expenses from "./components/expenses"
import Dashboard from "./components/dashboard"
import { Routes, Route, Navigate } from "react-router-dom"
import ValidateRoute from "./components/ValidateRoute"
import PrintPage from "./components/PrintPage"
import Track from "./components/Track";

function App() {
  return (
    <>
        <Routes>
          <Route index path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/dashboard"
            element={
              <ValidateRoute>
                <Dashboard />
              </ValidateRoute>
            }
          />
          <Route
            path="/track"
            element={
              <ValidateRoute>
                <Track />
              </ValidateRoute>
            }
          />

          <Route
            path="/printexpenses"
            element={
              <ValidateRoute>
                <PrintPage />
              </ValidateRoute>
            }
          />
          <Route
            path="/expenses"
            element={
              <ValidateRoute>
                <Expenses />
              </ValidateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    </>
  )
}

export default App

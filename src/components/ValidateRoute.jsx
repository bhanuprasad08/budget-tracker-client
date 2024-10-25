import React from "react"
import { useCookies } from "react-cookie"
import { Navigate } from "react-router-dom"

const ValidateRoute = ({ children }) => {
  const [cookies] = useCookies(["userId"])
  if (!cookies.userId) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ValidateRoute

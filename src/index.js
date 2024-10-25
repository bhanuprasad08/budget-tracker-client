import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { GoogleOAuthProvider } from "@react-oauth/google"
import AppStore from "./context/AppStore"
import { BrowserRouter as Router } from "react-router-dom"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <Router>
      <GoogleOAuthProvider clientId="741867943889-g75mij3ffc9qs9qb5hlvdu86e8v78epv.apps.googleusercontent.com">
        <AppStore>
          <App />
        </AppStore>
      </GoogleOAuthProvider>
    </Router>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

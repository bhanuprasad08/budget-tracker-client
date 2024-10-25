import React from "react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useCookies } from "react-cookie"

function Navbar() {
  const navigate = useNavigate()
  const [menu, setMenu] = useState(true)
  const [close, setClose] = useState(false)

  const menuToggled = () => {
    setMenu(false)
    setClose(true)
  }
  const closeToggled = () => {
    setMenu(true)
    setClose(false)
  }

  const [, removeCookie] = useCookies(["userId", "userName"])
  const logout = () => {
    removeCookie("userId")
    removeCookie("userName")
    navigate("/")
  }

  return (
    <>
      <nav className="nav">
        <div className="navbar">
          <div className="expenseTracker">
            <img
              src="https://downloadr2.apkmirror.com/wp-content/uploads/2021/01/01/5ffd9b2ead653-384x384.png"
              alt="logo"
              onClick={() => {
                navigate("/dashboard")
              }}
            />
          </div>
          <div className={menu ? "navitems-active" : "navitems"}>
            <ul className={menu ? "navData-active" : "navData"}>
              <li>
                <div
                  onClick={() => {
                    navigate("/printexpenses")
                  }}
                >
                  Print
                </div>
              </li>
              <li>
                <div
                  onClick={() => {
                    navigate("/dashboard")
                  }}
                >
                  Dashboard
                </div>
              </li>
              <li>
                <div
                  onClick={() => {
                    navigate("/track")
                  }}
                >
                  Track
                </div>
              </li>
              <li>
                <div
                  onClick={() => {
                    navigate("/expenses")
                  }}
                >
                  Expenses
                </div>
              </li>
              <li>
                <div
                  onClick={() => {
                    logout()
                  }}
                >
                  Logout
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="menuClose">
          <div className={menu ? "menu" : "menu-active"} onClick={menuToggled}>
            <i className="fa-solid fa-bars"></i>
          </div>
          <div
            className={close ? "close" : "close-active"}
            onClick={closeToggled}
          >
            <i className="fa-solid fa-xmark"></i>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar

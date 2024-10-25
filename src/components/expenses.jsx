import React, { useContext, useEffect, useState } from "react"
import AppContext from "../context/AppContext"
import "../css/expenses.css"
import Navbar from "./navbar"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import axios from "axios"
import ClipLoader from "react-spinners/ClipLoader"
import { useCookies } from "react-cookie"
import { TailSpin } from "react-loader-spinner"
import { useNavigate } from "react-router-dom"
import Modal from "react-modal"
import { FaExclamationCircle } from "react-icons/fa"

function Expenses() {
  const {
    category,
    setCategory,
    handleKeyPress,
    amount,
    setAmount,
    enterKey,
    changeBudget,
    spents,
    setSpents,
    remaining,
    setRemaining,
    addExpenses,
    expenses,
    loadingInExpensePage,
    amountFromDb,
    setDeleted,
  } = useContext(AppContext)

  Modal.setAppElement("#root")

  const [cookies] = useCookies(["userId", "userName"])
  const navigate = useNavigate()
  //to remove when user is deleted data
  const [loadingDelete, setLoadingDelete] = useState(false)

  const notifyTrue = (val) => toast.success(`${val}`)

  useEffect(() => {
    if (cookies.userId === undefined) {
      navigate("/")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.userId])

  useEffect(() => {
    const spent = expenses.reduce((starter, data) => starter + data.amount, 0)
    const remaining = amountFromDb - spent
    setSpents(spent)
    setRemaining(remaining)
  }, [expenses, setSpents, setRemaining, amountFromDb, spents])

  const removeExpense = async (dataId) => {
    setLoadingDelete(true)
    try {
      setDeleted(true)
      await axios.delete(
        // `https://budgetplanner-backend-1.onrender.com/users/${cookies.userId}/data/${dataId}`
        `http://localhost:8765/users/${cookies.userId}/data/${dataId}`
      )
      notifyTrue("Category deleted successfully")
      setDeleted(false)
    } catch (error) {
      console.error("Error deleting expense:", error)
      setDeleted(false)
      setLoadingDelete(false)
    } finally {
      setDeleted(false)
      setLoadingDelete(false)
    }
  }

  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const openModal = (category) => {
    setSelectedCategory(category)
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
  }
  return (
    <>
      <main className="mainExpense">
        <Navbar />
        <div className="middle">
          <div className="middleLeft">
            <div className="addData">
              <div className="expenseCategory">
                <input
                  id="category"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                  type="text"
                  placeholder="Category"
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="expenseAmount">
                <input
                  id="amount"
                  onChange={(e) => setAmount(e.target.value)}
                  value={amount}
                  type="number"
                  placeholder="Amount"
                  onKeyPress={enterKey}
                />
              </div>
              <div className="expenseAdd">
                {loadingInExpensePage ? (
                  <>
                    <button className="addExpenseBtn">
                      <ClipLoader
                        color="#D898D7"
                        loading={loadingInExpensePage}
                        size={25}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                      />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={addExpenses}
                    id="addBtn"
                    className="addExpenseBtn"
                  >
                    ADD
                  </button>
                )}

                <ToastContainer newestOnTop autoClose={2000} />
              </div>
            </div>
          </div>
          <div className="vline"></div>
          <hr className="vlineAfter" />

          <div className="middleRight">
            <div className="middleRightTop">
              <div className="budgetBox">
                <span className="showBudget">Budget : ₹{amountFromDb}</span>
                <button onClick={changeBudget} className="changeBudget">
                  <ion-icon name="create-outline"></ion-icon>
                </button>
              </div>
              <div className="remainingBox">
                <div className="showRemaining">Remaining: ₹{remaining}</div>
              </div>
              <div className="spentsBox">
                <div className="showSpents">Spent: ₹{spents}</div>
              </div>
            </div>
            {loadingDelete ? (
              <div
                style={{
                  height: "auto",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingRight: "50%",
                }}
              >
                <TailSpin color="#00BFFF" height={60} width={60} />
              </div>
            ) : (
              ""
            )}
            <div className="middleRightBottom">
              <div className="myExpenses">
                My Expenses{" "}
                <FaExclamationCircle
                  style={{ fontSize: "1rem" }}
                  onClick={() =>
                    notifyTrue("🔍 Tap the category name to see detailed expenses")
                  }
                />
              </div>
              <hr className="hr" />
              <ul className="expenseHeading">
                <li>
                  <span className="expenseName">Category</span>
                  <span className="expenseCost">Amount</span>
                  <span className="expenseAction">Delete</span>
                  <span className="expenseDetails">Created</span>
                </li>
              </ul>
              <ul className="expenseData">
                {expenses.length > 0 ? (
                  expenses.map((data) => {
                    return (
                      <li key={data._id}>
                        <span
                          className="expenseName"
                          onClick={() => openModal(data)}
                        >
                          {data.category}
                        </span>
                        <div key={data._id}>
                          <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={closeModal}
                            contentLabel="Example Modal"
                          >
                            {selectedCategory && (
                              <>
                                <h2 className="modalOverAll">
                                  Overall Spents for {""}
                                  {selectedCategory
                                    ? selectedCategory.category
                                    : ""}
                                </h2>
                                <p className="modalTotalAmountSpent">
                                  Total Amount Spent: ₹
                                  {selectedCategory
                                    ? selectedCategory.amount
                                    : 0}
                                </p>
                                <ul className="modalUl">
                                  <li className="modalLi">
                                    <span className="expenseName">Amount</span>
                                    <span className="expenseCost">Created</span>
                                  </li>
                                </ul>
                                <ul className="modalUlData">
                                  {selectedCategory.history &&
                                  selectedCategory.history.length > 0 ? (
                                    selectedCategory.history.map(
                                      (historyItem) => (
                                        <li
                                          key={historyItem._id}
                                          className="modalLiData"
                                        >
                                          <span className="expenseName">
                                            {historyItem.amount}
                                          </span>
                                          <span className="expenseCost">
                                            {new Date(
                                              historyItem.date
                                            ).toLocaleString()}
                                          </span>
                                        </li>
                                      )
                                    )
                                  ) : (
                                    <p>No history available</p>
                                  )}
                                </ul>
                                <div className="modalCloseButtonBox">
                                  <button
                                    onClick={closeModal}
                                    className="modalCloseButton"
                                  >
                                    Close
                                  </button>
                                </div>
                              </>
                            )}
                          </Modal>
                        </div>
                        <span className="expenseCost">{data.amount}</span>
                        <span className="expenseAction">
                          <i
                            className="fa-solid fa-trash"
                            onClick={() => removeExpense(data._id)}
                          ></i>
                        </span>
                        <span className="expenseDate">
                          <div className="createdOrUpdated">
                            {data.updatedAt === data.createdAt ? "(C)" : "(E)"}
                          </div>
                          <div className="date">
                            {data.updatedAt
                              ? new Date(data.updatedAt).toLocaleString()
                              : "No Date Available"}
                          </div>
                        </span>
                      </li>
                    )
                  })
                ) : (
                  <div className="emptyExpenses">
                    No spending? Cool! 😎
                    <br /> Forget where your money went? 💸 Try this to track
                    your expenses! 📊
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Expenses

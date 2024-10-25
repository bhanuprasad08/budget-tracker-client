import React, { useContext } from "react"
import Navbar from "./navbar"
import AppContext from "../context/AppContext"
import { ToastContainer } from "react-toastify"
import styles from "../css/Track.module.css"

const Track = () => {
  const {
    setSearch,
    search,
    setAmount,
    amount,
    handleKeyPress,
    enterKey,
    searchFilter,
    totalAmount,
    filterData,
    setFilterData,
    expenses,
  } = useContext(AppContext)

  const dateChanged = (eve) => {
    const retriveDataAccToDate = expenses.filter((data) => {
      const createdDate = new Date(data.createdAt).toLocaleDateString("en-CA")
      const updatedDate = new Date(data.updatedAt).toLocaleDateString("en-CA")
      if (
        eve.target.value === createdDate ||
        eve.target.value === updatedDate
      ) {
        return data.category
      }
      return false
    })
    setFilterData(retriveDataAccToDate)
  }

  const sortLoH = () => {
    const sortedLoH = [...filterData].sort((a, b) => {
      return a.amount - b.amount
    })
    setFilterData(sortedLoH)
  }
  const sortHoL = () => {
    const sortedHoL = [...filterData].sort((a, b) => {
      return b.amount - a.amount
    })
    setFilterData(sortedHoL)
  }

  const createdShow = () => {
    const sortedCreated = expenses.filter((data) => {
      if (data.createdAt === data.updatedAt) {
        return data.category
      }
      return false
    })
    setFilterData(sortedCreated)
  }
  const updatedShow = () => {
    const sortedUpdated = expenses.filter((data) => {
      if (data.createdAt !== data.updatedAt) {
        return data.category
      }
      return false
    })
    setFilterData(sortedUpdated)
  }
  const clearData = () => {
    setSearch("")
    setAmount("")
    setFilterData([])
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
                  onChange={(eve) => setSearch(eve.target.value)}
                  value={search}
                  type="text"
                  placeholder="Category"
                  onKeyPress={handleKeyPress}
                />
              </div>
              <div className="expenseAmount">
                <input
                  id="amount"
                  onChange={(eve) => setAmount(eve.target.value)}
                  value={amount}
                  type="number"
                  placeholder="Amount"
                  onKeyPress={enterKey}
                />
              </div>
              <div className="expenseAdd">
                <button
                  onClick={searchFilter}
                  id="addBtn"
                  className="addExpenseBtn"
                >
                  Search
                </button>
                <ToastContainer newestOnTop autoClose={2000} />
              </div>
              {/* {`SELECT ${search !== ""? `${search}`: ""} ${search !== "" && amount !== ""? `,`: ""} ${amount !== ""? `${amount}`: ""} `} */}
              <div className={styles.filterOptions}>
                <div className={styles.filterBox}>
                  <div className={styles.filter}>Filter</div>
                  <div className={styles.sortByPrice}>
                    <p>Sort By Price</p>
                    <button className={styles.sortBylth} onClick={sortLoH}>
                      Low to High
                    </button>
                    <button className={styles.sortByhtl} onClick={sortHoL}>
                      High to Low
                    </button>
                  </div>
                  <div className={styles.sortByCreatedOrUpdated}>
                    <p>Sort By Created/Updated(All)</p>
                    <button className={styles.sortBylth} onClick={createdShow}>
                      Created
                    </button>
                    <button className={styles.sortByhtl} onClick={updatedShow}>
                      Updated
                    </button>
                  </div>
                  <div className={styles.sortByDate}>
                    <p>Get Date</p>
                    <input
                      type="date"
                      className={styles.sortByDateInput}
                      onChange={dateChanged}
                    />
                  </div>
                  <div className={styles.clearBtnBox}>
                    <button className={styles.clearBtn} onClick={clearData}>
                      Clear Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="vline"></div>
          <hr className="vlineAfter" />

          <div className="middleRight">
            <div className={styles.middleRightTopTrack}>
              <div className={styles.budgetBoxTrack}>
                <span className="showBudget">Total : ₹{totalAmount}</span>
              </div>
            </div>
            <div className="middleRightBottom">
              <div className="myExpenses">My Expenses</div>
              <hr className="hr" />
              <ul className="expenseHeading">
                <li>
                  <span className="expenseName">Category</span>
                  <span className="expenseCost">Amount</span>
                  <span className="expenseDetails">Created</span>
                </li>
              </ul>
              <ul className="expenseData">
                {filterData.length > 0 ? (
                  filterData.map((data) => {
                    return (
                      <li key={data._id}>
                        <span className="expenseName">{data.category}</span>
                        <span className="expenseCost">{data.amount}</span>

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
                    Forget where your money went? 💸 Try this to track to get
                    remember your expenses with us! 📊
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

export default Track

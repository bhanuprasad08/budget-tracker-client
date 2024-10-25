import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import AppContext from "./AppContext"
import axios from "axios"
import { useCookies } from "react-cookie"

const AppStore = (props) => {
  const notifyFalse = (val) => {
    toast.warn(`${val}`)
  }
  const notifyTrue = (val) => toast.success(`${val}`)

  const [category, setCategory] = useState("")
  const [amount, setAmount] = useState("")
  const [spents, setSpents] = useState(0)
  const [remaining, setRemaining] = useState(0)
  const [budgetChanged, setBudgetChanged] = useState(false)
  const [amountFromDb, setAmountFromDb] = useState()
  const [categoryAmount, setCategoryAmount] = useState({})
  const [quote, setQuote] = useState("")
  const [deleted, setDeleted] = useState(false)

  //track
  const [search, setSearch] = useState("")
  const [filterData, setFilterData] = useState([])
  const [totalAmount, setTotalAmount] = useState()

  //setCookies
  const [cookies] = useCookies(["userId", "userName"])

  //new here
  const [expenses, setExpenses] = useState([])
  const [loadingInExpensePage, setLoadingInExpensePage] = useState(false)

  //Group
  const [groupName, setGroupName] = useState()
  const [groupPassword, setGroupPassword] = useState()
  const [groupExpenses, setGroupExpenses] = useState([])
  const [sortedData, setSortedData] = useState([])
  const [totalSpents, setTotalSpents] = useState(0)

  const addExpenses = async () => {
    setLoadingInExpensePage(true)
    const parAmount = parseInt(amount)
    if (category !== "") {
      if (amount !== "") {
        const categoryLowerCase = category.toLowerCase()
        try {
          await axios.post(
             `https://budget-tracker-server-1.onrender.com/users/${cookies.userId}/data`,
          
            {
              category: categoryLowerCase,
              amount: parAmount,
            },
            { headers: { "Content-Type": "application/json" } }
          )
          setLoadingInExpensePage(false)
        } catch (error) {
          console.error(error)
        } finally {
          setLoadingInExpensePage(false)
        }

        try {
          const response = await axios.get(
             `https://budget-tracker-server-1.onrender.com/users/${cookies.userId}`,
            
            { method: "GET", headers: { "Content-Type": "application/json" } }
          )
          setExpenses(response.data)
          notifyTrue("Category added successfully")
        } catch (error) {
          console.error("Error fetching expenses:", error)
        } finally {
          setAmount("")
          setCategory("")
          setLoadingInExpensePage(false)
        }
      } else {
        notifyFalse("Empty amount, you should mention the amount")
        setLoadingInExpensePage(false)
      }
    } else if (category === "") {
      notifyFalse("Empty category, you should mention the category")
      setLoadingInExpensePage(false)
    }
    setLoadingInExpensePage(false)
  }

  async function changeBudget() {
    const changebudget = parseInt(prompt("Enter budget here: ", 5000))
    if (changebudget < 0) {
      notifyFalse("Positive numbers only for your budget! 💰")
    } else {
      setBudgetChanged(true)
      try {
        const response = await axios.post(
          `https://budget-tracker-server-1.onrender.com/users/${cookies.userId}/budget`,
          // `http://localhost:8765/users/${cookies.userId}/budget`,
          {
            budget: changebudget,
          }
        )
        setBudgetChanged(false)
        notifyTrue(response.data.message)
      } catch (error) {
        console.log("Error getting while changing budget: ", error)
        setBudgetChanged(false)
      } finally {
        setBudgetChanged(false)
      }
    }

    if (Notification.permission === "granted") {
      if (changebudget > amountFromDb) {
        const notification = new Notification("Budget Planner", {
          body: `Budget increased! final budget ${changebudget}`,
        })
        notification.onclick = () => {
          window.focus()
        }
      } else if (changebudget < amountFromDb) {
        const notification = new Notification("Budget Planner", {
          body: `Budget decreased! final budget ${changebudget}`,
        })
        notification.onclick = () => {
          window.focus()
        }
      } else {
        const notification = new Notification("Budget Planner", {
          body: `Budget remains same! final budget ${changebudget}`,
        })
        notification.onclick = () => {
          window.focus()
        }
      }
    }
  }

  const handleKeyPress = (event) => {
    setCategory(event.target.value)
    const keyCode = event.keyCode || event.which
    const keyValue = String.fromCharCode(keyCode)
    if (!/^[A-Za-z\s]+$/.test(keyValue)) {
      event.preventDefault()
    }
    if (event.key === "Enter") {
      if (event.target.id === "category") {
        document.getElementById("amount").focus()
      } else if (event.target.id === "amount") {
        document.getElementById("addBtn").focus()
      }
    }
  }

  function enterKey(eve) {
    if (eve.key === "Enter") {
      if (eve.target.id === "category") {
        document.getElementById("amount").focus()
      } else if (eve.target.id === "amount") {
        document.getElementById("addBtn").focus()
      }
    }
  }

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
           `https://budget-tracker-server-1.onrender.com/users/${cookies.userId}/`,
          //`http://localhost:8765/users/${cookies.userId}/`,
          { headers: { "Content-Type": "application/json" } }
        )
        setExpenses(response.data)
      } catch (error) {
        console.error("Error fetching expenses:", error)
      }
    }

    const fetchBudget = async () => {
      try {
        const response = await axios.get(
           `https://budget-tracker-server-1.onrender.com/users/${cookies.userId}/budget`,
          //`http://localhost:8765/users/${cookies.userId}/budget`,
          { headers: { "Content-Type": "application/json" } }
        )
        setAmountFromDb(response.data.budget)
      } catch (error) {
        console.log("Error fetching budget:", error)
      }
    }

    fetchExpenses()
    fetchBudget()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookies.userId, deleted, budgetChanged])

  //track page
  const searchFilter = () => {
    const searchFilterData = expenses.filter((data) => {
      if (search.toLowerCase() !== "" && amount !== "") {
        return (
          data.category === search.toLowerCase() &&
          data.amount === parseInt(amount)
        )
      } else if (search.toLowerCase() !== "" && amount === "") {
        return data.category === search.toLowerCase()
      } else if (search.toLowerCase() === "" && amount !== "") {
        return data.amount === parseInt(amount)
      }
      return false
    })
    setFilterData(searchFilterData)
    setSearch("")
    setAmount("")
  }

  useEffect(() => {
    setTotalAmount(filterData.reduce((acc, curr) => acc + curr.amount, 0))
  }, [filterData])

  //Group

  return (
    <AppContext.Provider
      value={{
        amount,
        setAmount,
        category,
        setCategory,
        spents,
        setSpents,
        remaining,
        setRemaining,
        handleKeyPress,
        changeBudget,
        enterKey,
        expenses,
        addExpenses,
        setExpenses,
        loadingInExpensePage,
        budgetChanged,
        setAmountFromDb,
        amountFromDb,
        setQuote,
        quote,
        setCategoryAmount,
        categoryAmount,
        deleted,
        setDeleted,
        search,
        setSearch,
        filterData,
        setFilterData,
        totalAmount,
        setTotalAmount,
        searchFilter,
        //Group
        setGroupName,
        setGroupPassword,
        groupName,
        groupPassword,
        setGroupExpenses,
        groupExpenses,
        setSortedData,
        sortedData,
        setTotalSpents,
        totalSpents,
      }}
    >
      {props.children}
    </AppContext.Provider>
  )
}

export default AppStore

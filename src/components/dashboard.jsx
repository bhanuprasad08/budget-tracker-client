import React, { useContext, useEffect } from "react"
import Navbar from "./navbar"
import "../css/dashboard.css"
import { Bar, Pie } from "react-chartjs-2"
import "chart.js/auto"
import AppContext from "../context/AppContext"
import { useCookies } from "react-cookie"

function Dashboard() {
  const {
    expenses,
    quote,
    amountFromDb,
    setSpents,
    setRemaining,
    spents,
    setQuote,
    setCategoryAmount,
    categoryAmount,
  } = useContext(AppContext)
  const [cookies] = useCookies(["userId", "userName"])

  useEffect(() => {
    const amountByCategory = {}
    expenses.forEach((data) => {
      if (!amountByCategory[data.category]) {
        amountByCategory[data.category] = 0
      }
      amountByCategory[data.category] += data.amount
    })
    setCategoryAmount(amountByCategory)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses])

  const userData = {
    labels: Object.keys(categoryAmount),
    datasets: [
      {
        label: `Expenses(Budget: ₹${amountFromDb})`,
        data: Object.values(categoryAmount),
        backgroundColor: [
          "rgba(219, 112, 147, 0.6)",
          "rgba(230, 230, 250, 0.6)",
          "rgba(255, 192, 203, 0.6)",
          "rgba(240, 128, 128, 0.6)",
          "rgba(218, 112, 214, 0.6)",
          "rgba(147, 112, 219, 0.6)",
        ],
        borderWidth: 2,
      },
    ],
  }

  const options = {
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }

  const budgetQuotes = {
    lessTwentyPercent: [
      { text: "You’ve barely touched your budget! Keep it going!" },
      { text: "Your budget is still mostly intact. Great job!" },
      { text: "A small dent in your budget! You’re in control!" },
      { text: "Off to a good start! Plenty of money left to manage." },
      { text: "Just a little spent. You’ve got this!" },
    ],
    twentyPercent: [
      { text: "Only 20% spent. You're still safe... for now!" },
      { text: "20% gone! Keep going, but don’t get too excited!" },
      { text: "Just 20%! Your money is still happy!" },
      { text: "20% down, but you're still in control!" },
      { text: "You’re just warming up. Don’t burn through it too fast!" },
    ],
    fiftyPercent: [
      { text: "Halfway there! Time to slow down, money lover!" },
      { text: "50% of your budget is gone... feeling nervous yet?" },
      { text: "Whoa! You’re at 50%. Time to think twice!" },
      { text: "Half of your money waved goodbye. Be careful!" },
      { text: "50% spent! Your wallet is starting to sweat!" },
    ],
    seventyPercent: [
      { text: "You’ve hit 70%! Are you sure you need that snack?" },
      { text: "70% gone! Danger zone ahead!" },
      { text: "70% spent. Maybe it’s time to hide your credit card!" },
      { text: "You’ve used 70%! The wallet is getting lighter!" },
      { text: "70% down! Slow down, or you’ll be broke soon!" },
    ],
    seventyFivePercent: [
      { text: "75% spent! Your money is waving goodbye!" },
      { text: "You’re at 75%! Hope you didn’t want that new game!" },
      { text: "75% gone... better start counting your pennies!" },
      { text: "Whoa! 75% used. Are you planning to live on noodles?" },
      { text: "75% done! Your budget is shrinking fast!" },
    ],
    ninetyPercent: [
      { text: "90% spent! Better start planning those ramen dinners!" },
      { text: "90% gone... the wallet is crying!" },
      { text: "90% down. You’ve got 10% left to survive!" },
      { text: "90% spent! Your wallet is now on life support!" },
      { text: "You’re at 90%! Say goodbye to your last few dollars!" },
    ],
    oneHundredPercent: [
      { text: "100% spent! Time to call for backup!" },
      { text: "All gone! Time to live like a monk!" },
      { text: "100% used up! Guess it's water and bread from now!" },
      { text: "You did it! Now you’re officially broke!" },
      { text: "Budget maxed out! Time to enjoy the broke life!" },
    ],
  }

  useEffect(() => {
    const spent = expenses.reduce((total, expense) => total + expense.amount, 0)
    const remaining = amountFromDb - spent
    setSpents(spent)
    setRemaining(remaining)

    const getTwentyPer = amountFromDb * 0.2
    const getFiftyPer = amountFromDb * 0.5
    const getSeventyPer = amountFromDb * 0.7
    const getSeventyFivePer = amountFromDb * 0.75
    const getNinetyPer = amountFromDb * 0.9
    const getOneHundredPer = amountFromDb * 1.0

    let q = []

    if (spents >= getOneHundredPer) {
      q = budgetQuotes.oneHundredPercent
    } else if (spents >= getNinetyPer) {
      q = budgetQuotes.ninetyPercent
    } else if (spents >= getSeventyFivePer) {
      q = budgetQuotes.seventyFivePercent
    } else if (spents >= getSeventyPer) {
      q = budgetQuotes.seventyPercent
    } else if (spents >= getFiftyPer) {
      q = budgetQuotes.fiftyPercent
    } else if (spents >= getTwentyPer) {
      q = budgetQuotes.twentyPercent
    } else if (spents <= getTwentyPer) {
      q = budgetQuotes.lessTwentyPercent
    }

    if (q.length > 0) {
      const randomNumber = Math.floor(Math.random() * q.length)
      setQuote(q[randomNumber].text)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenses, setSpents, setRemaining, amountFromDb, spents])

  return (
    <>
      <main className="mainDashboard">
        <Navbar />
        <div className="totalData">
          <h1 className="greetings">
            {`Welcome back, ${cookies.userName}` || "Welcome back, Guest"}
          </h1>
          <h2 className="quotes">{quote}</h2>
          <div className="barChart">
            <div className="bar1">
              <Bar
                options={options}
                style={{ width: "200px", height: "250px" }}
                data={userData}
              />
            </div>
            <div className="bar2">
              <Pie
                options={options}
                style={{ width: "200px", height: "250px" }}
                data={userData}
              />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Dashboard

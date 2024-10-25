import React, { useContext } from "react"
import styles from "../css/PrintPage.module.css"
import AppContext from "../context/AppContext"
import { Bar, Pie } from "react-chartjs-2"

const PrintPage = () => {
  const date = new Date()
  const { expenses, spents, categoryAmount, amountFromDb } = useContext(AppContext)

  const userData = {
    labels: Object.keys(categoryAmount),
    datasets: [
      {
        label: `Expenses(budget: ${amountFromDb})`,
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

  return (
    <>
      <div className={styles.main}>
        <div className={styles.chartAndBar}>
          <div className="bar1" style={{ width: "70%" }}>
            <Bar
              options={options}
              style={{ width: "200px", height: "210px" }}
              data={userData}
            />
          </div>
          <div className="bar2">
            <Pie
              options={options}
              style={{ width: "200px", height: "210px" }}
              data={userData}
            />
          </div>
        </div>
        <div className={styles.paper}>
          <div className={styles.details}>
            <div className={styles.left}>Budget Tracker</div>
            <div className={styles.right}>
              Issued Date:
              {`${date.getDate()}/${
                date.getMonth() + 1 < 10
                  ? "0" + (date.getMonth() + 1)
                  : date.getMonth() + 1
              }/${date.getFullYear()}`}
            </div>
          </div>
          <div className={styles.spentsBudget}>
            <div className={styles.top}>
              <div className={styles.date}>Date's</div>
              <div className={styles.category}>Category</div>
              <div className={styles.spents}>Spents</div>
            </div>
            <hr />
            <ul className={styles.bottom}>
              {expenses.map((data) => (
                <li key={data._id}>
                  <div className={styles.date}>
                    {data.updatedAt
                      ? new Date(data.updatedAt).toLocaleDateString("en-GB")
                      : "No Date Available"}
                  </div>
                  <div className={styles.category}>{data.category}</div>
                  <div className={styles.spents}>₹{data.amount}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.printAndTotal}>
            <div className={styles.printButton}>
              <button
                type="button"
                onClick={() => window.print()}
                className={styles.button}
              >
                Print
              </button>
            </div>
            <div className={styles.totalSpents}>
              <div className={styles.totalSpentsLabel}>Total Spents : </div>
              <div className={styles.totalSpentsValue}>₹{spents}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PrintPage

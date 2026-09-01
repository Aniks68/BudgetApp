import './TransactionList.css';

const TransactionList = ({
  transactions,
  budgetItems,
  onDeleteTransaction,
  onDeleteBudgetItem
}) => {
  const formatNumber = (num) => {
    const numSplit = Math.abs(num).toFixed(2).split('.');
    let int = numSplit[0];

    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
      const intSplit = int.split(',');
      const intSec = intSplit[0];
      if (intSec.length > 3) {
        int = intSec.substr(0, intSec.length - 3) + ',' + intSec.substr(intSec.length - 3, 3) + ',' + intSplit[1];
      }
    }

    const dec = numSplit[1];
    return int + '.' + dec;
  };

  const incomeTransactions = transactions.filter(t => t.type === 'inc');
  const expenseTransactions = transactions.filter(t => t.type === 'exp');
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.value, 0);

  // Group expenses by budgetId
  const expensesByBudget = {};
  const unlinkedExpenses = [];

  expenseTransactions.forEach(exp => {
    if (exp.budgetId) {
      if (!expensesByBudget[exp.budgetId]) {
        expensesByBudget[exp.budgetId] = [];
      }
      expensesByBudget[exp.budgetId].push(exp);
    } else {
      unlinkedExpenses.push(exp);
    }
  });

  return (
    <div className="container three-columns">
      <div className="column income">
        <h2 className="column__title">Income</h2>
        <div className="column__list">
          {incomeTransactions.map((transaction) => (
            <div key={transaction.id} className="item">
              <div className="item__description">{transaction.description.toUpperCase()}</div>
              <div className="item__value income">+${formatNumber(transaction.value)}</div>
              <button
                className="item__delete--btn"
                onClick={() => onDeleteTransaction(transaction.id, 'inc')}
              >
                X
              </button>
            </div>
          ))}
          {incomeTransactions.length === 0 && (
            <p className="empty-message">No income entries</p>
          )}
        </div>
      </div>

      <div className="column budget">
        <h2 className="column__title">Budget</h2>
        <div className="column__list">
          {budgetItems.map((budget) => (
            <div key={budget.id} className="item budget-item">
              <div className="item__description">{budget.description.toUpperCase()}</div>
              <div className="item__value budget">${formatNumber(budget.plannedAmount)}</div>
              <div className="item__percentage">
                {totalIncome > 0 ? ((budget.plannedAmount / totalIncome) * 100).toFixed(1) + '%' : '---'}
              </div>
              <button
                className="item__delete--btn"
                onClick={() => onDeleteBudgetItem(budget.id)}
              >
                X
              </button>
            </div>
          ))}
          {budgetItems.length === 0 && (
            <p className="empty-message">No budget items</p>
          )}
        </div>
      </div>

      <div className="column actual-expense">
        <h2 className="column__title">Actual Expense</h2>

        <div className="column__list">
          {expenseTransactions.map((exp) => {
            const linkedBudget = exp.budgetId
              ? budgetItems.find((budget) => budget.id === exp.budgetId)
              : null;

            const description = linkedBudget
              ? linkedBudget.description
              : exp.description;

            return (
              <div key={exp.id} className="item expense-item">
                <div className="item__description">
                  {description.toUpperCase()}
                </div>

                <div className="item__value expense">
                  -${formatNumber(exp.value)}
                </div>

                <div className="item__percentage">
                  {totalIncome > 0
                    ? ((exp.value / totalIncome) * 100).toFixed(1) + '%'
                    : '---'}
                </div>

                <button
                  className="item__delete--btn"
                  onClick={() => onDeleteTransaction(exp.id, 'exp')}
                >
                  X
                </button>
              </div>
            );
          })}

          {expenseTransactions.length === 0 && (
            <p className="empty-message">No expenses</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionList;

import './Statistics.css';

const Statistics = ({ transactions }) => {
  // Group transactions by month
  const groupByMonth = (transactions) => {
    const grouped = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.createdAt || Date.now());
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = { income: 0, expenses: 0, count: 0 };
      }
      
      if (transaction.type === 'inc') {
        grouped[monthKey].income += transaction.value;
      } else {
        grouped[monthKey].expenses += transaction.value;
      }
      grouped[monthKey].count++;
    });
    
    return grouped;
  };

  const monthlyData = groupByMonth(transactions);
  const sortedMonths = Object.keys(monthlyData).sort();

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

  const formatMonth = (monthKey) => {
    const [year, month] = monthKey.split('-');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  const totalIncome = transactions.filter(t => t.type === 'inc').reduce((sum, t) => sum + t.value, 0);
  const totalExpenses = transactions.filter(t => t.type === 'exp').reduce((sum, t) => sum + t.value, 0);
  const netSavings = totalIncome - totalExpenses;

  return (
    <div className="statistics">
      <h2 className="statistics__title">Over-Time Statistics</h2>
      
      <div className="statistics__summary">
        <div className="stat-card">
          <h3>Total Income</h3>
          <p className="stat-value income">+${formatNumber(totalIncome)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Expenses</h3>
          <p className="stat-value expense">-${formatNumber(totalExpenses)}</p>
        </div>
        <div className="stat-card">
          <h3>Net Savings</h3>
          <p className={`stat-value ${netSavings >= 0 ? 'income' : 'expense'}`}>
            {netSavings >= 0 ? '+' : '-'}${formatNumber(netSavings)}
          </p>
        </div>
      </div>

      <div className="statistics__monthly">
        <h3>Monthly Breakdown</h3>
        {sortedMonths.length === 0 ? (
          <p className="no-data">No data available</p>
        ) : (
          <table className="statistics__table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Income</th>
                <th>Expenses</th>
                <th>Net</th>
              </tr>
            </thead>
            <tbody>
              {sortedMonths.map(monthKey => {
                const data = monthlyData[monthKey];
                const net = data.income - data.expenses;
                return (
                  <tr key={monthKey}>
                    <td>{formatMonth(monthKey)}</td>
                    <td className="income">+${formatNumber(data.income)}</td>
                    <td className="expense">-${formatNumber(data.expenses)}</td>
                    <td className={net >= 0 ? 'income' : 'expense'}>
                      {net >= 0 ? '+' : '-'}${formatNumber(net)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Statistics;

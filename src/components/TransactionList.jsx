import './TransactionList.css';

const TransactionList = ({ transactions, onDeleteTransaction }) => {
  const formatNumber = (num, type) => {
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
    const sign = type === 'exp' ? '-' : '+';
    return sign + int + '.' + dec;
  };

  const calculatePercentage = (expenseValue, totalIncome) => {
    if (totalIncome > 0) {
      return ((expenseValue / totalIncome) * 100).toFixed(2) + '%';
    }
    return '---';
  };

  const incomeTransactions = transactions.filter(t => t.type === 'inc');
  const expenseTransactions = transactions.filter(t => t.type === 'exp');
  const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.value, 0);

  return (
    <div className="container clearfix">
      <div className="income">
        <h2 className="income__title">Income</h2>
        <div className="income__list">
          {incomeTransactions.map((transaction) => (
            <div key={transaction.id} className="item clearfix" id={`inc-${transaction.id}`}>
              <div className="item__description">{transaction.description.toUpperCase()}</div>
              <div className="right clearfix">
                <div className="item__value">{formatNumber(transaction.value, 'inc')}</div>
                <div className="item__delete">
                  <button 
                    className="item__delete--btn"
                    onClick={() => onDeleteTransaction(transaction.id, 'inc')}
                  >
                    X
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="expenses">
        <h2 className="expenses__title">Expenses</h2>
        <div className="expenses__list">
          {expenseTransactions.map((transaction) => (
            <div key={transaction.id} className="item clearfix" id={`exp-${transaction.id}`}>
              <div className="item__description">{transaction.description.toUpperCase()}</div>
              <div className="right clearfix">
                <div className="item__value">{formatNumber(transaction.value, 'exp')}</div>
                <div className="item__percentage">
                  {calculatePercentage(transaction.value, totalIncome)}
                </div>
                <div className="item__delete">
                  <button 
                    className="item__delete--btn"
                    onClick={() => onDeleteTransaction(transaction.id, 'exp')}
                  >
                    X
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransactionList;

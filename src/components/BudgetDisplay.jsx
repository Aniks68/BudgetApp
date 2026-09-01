import './BudgetDisplay.css';

const BudgetDisplay = ({ budget }) => {
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

  const getCurrentDate = () => {
    const now = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = now.getDate();
    const month = now.getMonth();
    const year = now.getFullYear();
    return `${day} ${months[month]} ${year}`;
  };

  return (
    <div className="top">
      <div className="budget">
        <div className="budget__title">
          Available Budget on <span className="budget__title--month">{getCurrentDate()}</span>:
        </div>
        
        <div className="budget__value">
          {formatNumber(budget.total, budget.total >= 0 ? 'inc' : 'exp')}
        </div>
        
        <div className="budget__income clearfix">
          <div className="budget__income--text">Income</div>
          <div className="right">
            <div className="budget__income--value">{formatNumber(budget.income, 'inc')}</div>
            <div className="budget__income--percentage">&nbsp;</div>
          </div>
        </div>
        
        <div className="budget__expenses clearfix">
          <div className="budget__expenses--text">Expenses</div>
          <div className="right clearfix">
            <div className="budget__expenses--value">{formatNumber(budget.expenses, 'exp')}</div>
            <div className="budget__expenses--percentage">
              {budget.income > 0 ? ((budget.expenses / budget.income) * 100).toFixed(2) + '%' : '--'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetDisplay;

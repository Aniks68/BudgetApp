import { useState } from 'react';
import './BudgetPlanList.css';

const BudgetPlanList = ({ budgetPlans, onMarkExecuted, onDeletePlan }) => {
  const [actualCost, setActualCost] = useState({});
  const [showCostInput, setShowCostInput] = useState({});

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

  const handleMarkExecuted = (planId) => {
    const cost = parseFloat(actualCost[planId]);
    if (cost && cost > 0) {
      onMarkExecuted(planId, cost);
      setShowCostInput({ ...showCostInput, [planId]: false });
      setActualCost({ ...actualCost, [planId]: '' });
    }
  };

  const toggleCostInput = (planId) => {
    setShowCostInput({ ...showCostInput, [planId]: !showCostInput[planId] });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'planned':
        return <span className="status-badge planned">Planned</span>;
      case 'executed':
        return <span className="status-badge executed">Executed</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const calculateVariance = (planned, actual) => {
    const variance = actual - planned;
    const percentage = ((variance / planned) * 100).toFixed(1);
    return {
      amount: variance,
      percentage: percentage
    };
  };

  return (
    <div className="budget-plan-list">
      <h3>Budget Plans</h3>
      {budgetPlans.length === 0 ? (
        <p className="no-plans">No budget plans created yet</p>
      ) : (
        <div className="plans-container">
          {budgetPlans.map((plan) => {
            const variance = plan.status === 'executed' && plan.actualCost 
              ? calculateVariance(plan.plannedAmount, plan.actualCost)
              : null;

            return (
              <div key={plan.id} className={`budget-plan-card ${plan.status}`}>
                <div className="plan-header">
                  <div className="plan-category">{plan.category}</div>
                  {getStatusBadge(plan.status)}
                </div>
                
                {plan.description && (
                  <div className="plan-description">{plan.description}</div>
                )}
                
                <div className="plan-amounts">
                  <div className="amount-row">
                    <span className="amount-label">Planned:</span>
                    <span className="amount-value">${formatNumber(plan.plannedAmount)}</span>
                  </div>
                  
                  {plan.status === 'executed' && plan.actualCost && (
                    <div className="amount-row">
                      <span className="amount-label">Actual:</span>
                      <span className="amount-value">${formatNumber(plan.actualCost)}</span>
                    </div>
                  )}
                  
                  {variance && (
                    <div className="amount-row variance">
                      <span className="amount-label">Variance:</span>
                      <span className={`amount-value ${variance.amount >= 0 ? 'over' : 'under'}`}>
                        {variance.amount >= 0 ? '+' : ''}${formatNumber(variance.amount)} ({variance.percentage}%)
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="plan-actions">
                  {plan.status === 'planned' && (
                    <>
                      {showCostInput[plan.id] ? (
                        <div className="cost-input-group">
                          <input
                            type="number"
                            placeholder="Enter actual cost"
                            value={actualCost[plan.id] || ''}
                            onChange={(e) => setActualCost({ ...actualCost, [plan.id]: e.target.value })}
                          />
                          <button 
                            className="confirm-btn"
                            onClick={() => handleMarkExecuted(plan.id)}
                          >
                            Confirm
                          </button>
                          <button 
                            className="cancel-btn"
                            onClick={() => toggleCostInput(plan.id)}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="mark-executed-btn"
                          onClick={() => toggleCostInput(plan.id)}
                        >
                          Mark as Executed
                        </button>
                      )}
                    </>
                  )}
                  
                  <button 
                    className="delete-plan-btn"
                    onClick={() => onDeletePlan(plan.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BudgetPlanList;

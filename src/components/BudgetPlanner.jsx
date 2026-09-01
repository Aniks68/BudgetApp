import { useState } from 'react';
import './BudgetPlanner.css';

const BudgetPlanner = ({ onAddBudgetPlan }) => {
  const [category, setCategory] = useState('');
  const [plannedAmount, setPlannedAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (category.trim() === '' || plannedAmount === '' || parseFloat(plannedAmount) <= 0) {
      return;
    }

    onAddBudgetPlan({
      category: category.trim(),
      plannedAmount: parseFloat(plannedAmount),
      description: description.trim(),
      status: 'planned',
      createdAt: new Date().toISOString()
    });

    setCategory('');
    setPlannedAmount('');
    setDescription('');
  };

  return (
    <div className="budget-planner">
      <h3>Create Budget Plan</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Category:</label>
          <input 
            type="text" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Groceries, Rent, Entertainment"
            required
          />
        </div>
        <div className="form-group">
          <label>Planned Amount:</label>
          <input 
            type="number" 
            value={plannedAmount}
            onChange={(e) => setPlannedAmount(e.target.value)}
            placeholder="Enter planned amount"
            required
          />
        </div>
        <div className="form-group">
          <label>Description (optional):</label>
          <input 
            type="text" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about this budget plan"
          />
        </div>
        <button type="submit" className="add-budget-btn">Create Budget Plan</button>
      </form>
    </div>
  );
};

export default BudgetPlanner;

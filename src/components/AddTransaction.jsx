import { useState } from 'react';
import './AddTransaction.css';

const AddTransaction = ({ onAddTransaction, budgetItems }) => {
  const [type, setType] = useState('inc');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');

  // Capitalise the first letter while preserving the rest of the text
  const formatDescription = (text) => {
    const trimmed = text.trim();

    if (trimmed === '') {
      return '';
    }

    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedDescription = formatDescription(description);

    if (
      (formattedDescription === '' &&
        (type !== 'exp' || selectedBudget === '')) ||
      value === '' ||
      parseFloat(value) <= 0
    ) {
      return;
    }

    onAddTransaction({
      type,
      description: formattedDescription,
      value: parseFloat(value),
      budgetId: type === 'exp' ? selectedBudget : null
    });

    setDescription('');
    setValue('');
    setSelectedBudget('');
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setSelectedBudget('');
    setDescription('');
  };

  const handleBudgetChange = (e) => {
    const budgetId = e.target.value;
    setSelectedBudget(budgetId);

    if (budgetId === '') {
      setDescription('');
      return;
    }

    const selectedBudgetItem = budgetItems.find(
      (budget) => budget.id === budgetId
    );

    if (selectedBudgetItem) {
      setDescription(formatDescription(selectedBudgetItem.description));
    }
  };

  return (
    <div className="add">
      <div className="add__container">
        <form onSubmit={handleSubmit}>
          <select
            className={`add__type ${type === 'exp' ? 'red' : ''} ${
              type === 'bdg' ? 'budget' : ''
            }`}
            value={type}
            onChange={handleTypeChange}
          >
            <option value="inc">Income</option>
            <option value="bdg">Budget</option>
            <option value="exp">Expense</option>
          </select>

          {type === 'exp' && (
            <select
              className="add__budget-select"
              value={selectedBudget}
              onChange={handleBudgetChange}
            >
              <option value="">None</option>

              {budgetItems.map((budget) => (
                <option key={budget.id} value={budget.id}>
                  {formatDescription(budget.description)}
                </option>
              ))}
            </select>
          )}

          <input
            type="text"
            className={`add__description ${
              type === 'exp' ? 'red-focus' : ''
            } ${type === 'bdg' ? 'budget-focus' : ''}`}
            placeholder="Add description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={type === 'exp' && selectedBudget !== ''}
          />

          <input
            type="number"
            className={`add__value ${type === 'exp' ? 'red-focus' : ''} ${
              type === 'bdg' ? 'budget-focus' : ''
            }`}
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />

          <button
            className={`add__btn ${type === 'exp' ? 'red' : ''} ${
              type === 'bdg' ? 'budget' : ''
            }`}
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
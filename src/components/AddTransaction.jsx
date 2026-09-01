import { useState } from 'react';
import './AddTransaction.css';

const AddTransaction = ({ onAddTransaction }) => {
  const [type, setType] = useState('inc');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (description.trim() === '' || value === '' || parseFloat(value) <= 0) {
      return;
    }

    onAddTransaction({
      type,
      description: description.trim(),
      value: parseFloat(value)
    });

    setDescription('');
    setValue('');
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  return (
    <div className="add">
      <div className="add__container">
        <form onSubmit={handleSubmit}>
          <select 
            className={`add__type ${type === 'exp' ? 'red' : ''}`} 
            value={type}
            onChange={handleTypeChange}
          >
            <option value="inc">+</option>
            <option value="exp">-</option>
          </select>
          <input 
            type="text" 
            className={`add__description ${type === 'exp' ? 'red-focus' : ''}`} 
            placeholder="Add description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input 
            type="number" 
            className={`add__value ${type === 'exp' ? 'red-focus' : ''}`} 
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button className={`add__btn ${type === 'exp' ? 'red' : ''}`} type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;

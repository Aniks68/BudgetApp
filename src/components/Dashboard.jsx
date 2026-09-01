import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebaseConfig';
import { collection, addDoc, deleteDoc, doc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import BudgetDisplay from './BudgetDisplay';
import AddTransaction from './AddTransaction';
import TransactionList from './TransactionList';
import Statistics from './Statistics';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transactionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(transactionsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, navigate]);

  const handleAddTransaction = async (transaction) => {
    try {
      await addDoc(collection(db, 'transactions'), {
        ...transaction,
        userId: user.uid,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id, type) => {
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const calculateBudget = () => {
    const income = transactions
      .filter(t => t.type === 'inc')
      .reduce((sum, t) => sum + t.value, 0);
    const expenses = transactions
      .filter(t => t.type === 'exp')
      .reduce((sum, t) => sum + t.value, 0);
    return {
      total: income - expenses,
      income,
      expenses
    };
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const budget = calculateBudget();

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h1>Budget Tracker</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      
      <BudgetDisplay budget={budget} />
      
      <div className="bottom">
        <AddTransaction onAddTransaction={handleAddTransaction} />
        <TransactionList 
          transactions={transactions} 
          onDeleteTransaction={handleDeleteTransaction} 
        />
      </div>

      <Statistics transactions={transactions} />
    </div>
  );
};

export default Dashboard;

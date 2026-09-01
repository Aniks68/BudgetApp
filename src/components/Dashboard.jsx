import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebaseConfig';
import { collection, addDoc, deleteDoc, doc, updateDoc, query, where, onSnapshot } from 'firebase/firestore';
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
  const [budgetItems, setBudgetItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Fetch transactions
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', user.uid)
    );

    const unsubscribeTransactions = onSnapshot(transactionsQuery, (snapshot) => {
      console.log('Transactions snapshot:', snapshot.size, 'documents');
      const transactionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      console.log('Transactions data:', transactionsData);
      setTransactions(transactionsData);
    }, (error) => {
      console.error('Error fetching transactions:', error);
    });

    // Fetch budget items
    const budgetQuery = query(
      collection(db, 'budgetItems'),
      where('userId', '==', user.uid)
    );

    const unsubscribeBudget = onSnapshot(budgetQuery, (snapshot) => {
      const budgetData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBudgetItems(budgetData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching budget items:', error);
      setLoading(false);
    });

    return () => {
      unsubscribeTransactions();
      unsubscribeBudget();
    };
  }, [user, navigate]);

  const handleAddTransaction = async (transaction) => {
    try {
      console.log('Adding transaction:', transaction);
      
      if (transaction.type === 'bdg') {
        // Add as budget item
        await addDoc(collection(db, 'budgetItems'), {
          description: transaction.description,
          plannedAmount: transaction.value,
          actualCost: 0,
          userId: user.uid,
          createdAt: new Date().toISOString()
        });
      } else {
        // Add as income or expense transaction
        const docRef = await addDoc(collection(db, 'transactions'), {
          ...transaction,
          userId: user.uid,
          createdAt: new Date().toISOString()
        });
        console.log('Transaction added with ID:', docRef.id);
        
        // If expense is linked to a budget, update the budget's actual cost
        if (transaction.type === 'exp' && transaction.budgetId) {
          const budget = budgetItems.find(b => b.id === transaction.budgetId);
          if (budget) {
            await updateDoc(doc(db, 'budgetItems', transaction.budgetId), {
              actualCost: (budget.actualCost || 0) + transaction.value
            });
          }
        }
      }
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

  const handleAddBudgetItem = async (budgetItem) => {
    try {
      await addDoc(collection(db, 'budgetItems'), {
        ...budgetItem,
        userId: user.uid
      });
    } catch (error) {
      console.error('Error adding budget item:', error);
    }
  };

  const handleUpdateBudgetActual = async (budgetId, actualCost) => {
    try {
      await updateDoc(doc(db, 'budgetItems', budgetId), {
        actualCost: actualCost
      });
    } catch (error) {
      console.error('Error updating budget actual cost:', error);
    }
  };

  const handleDeleteBudgetItem = async (budgetId) => {
    try {
      await deleteDoc(doc(db, 'budgetItems', budgetId));
    } catch (error) {
      console.error('Error deleting budget item:', error);
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
    const plannedBudget = budgetItems.reduce((sum, b) => sum + b.plannedAmount, 0);
    const actualBudgetSpent = budgetItems.reduce((sum, b) => sum + (b.actualCost || 0), 0);
    return {
      total: income - expenses,
      income,
      expenses,
      plannedBudget,
      actualBudgetSpent
    };
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const budget = calculateBudget();

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div className="dashboard__user-info">
          <h1>Budget Tracker</h1>
          <p className="user-name">Welcome, {user?.displayName || user?.email}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
      
      <BudgetDisplay budget={budget} />
      
      <div className="bottom">
        <AddTransaction onAddTransaction={handleAddTransaction} budgetItems={budgetItems} />
        <TransactionList 
          transactions={transactions} 
          budgetItems={budgetItems}
          onDeleteTransaction={handleDeleteTransaction}
          onDeleteBudgetItem={handleDeleteBudgetItem}
        />
      </div>

      <Statistics transactions={transactions} />
    </div>
  );
};

export default Dashboard;

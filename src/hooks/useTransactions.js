import { useContext } from 'react';
import { ExpenseTrackerContext } from '../context/context';

import { incomeCategories, expenseCategories, resetCategories } from '../constants/categories';

const useTransactions = (title) => {
  resetCategories();
  const { transactions } = useContext(ExpenseTrackerContext);
  const selectedCategories = transactions.filter((t) => t.type === title);
  const total = selectedCategories.reduce((acc, currVal) => acc += currVal.amount, 0); // [1,2,3,4,5] = 15
  
  const categories = title === 'Income' ? incomeCategories : expenseCategories;

  selectedCategories.forEach((t) => {
    const category = categories.find((c) => c.type === t.category);
    if (category) {
        category.amount += t.amount;
    }
    // going to change the 'amount' value of either income or expense category
  });

  const filteredCategories = categories.filter((sc) => sc.amount > 0); // filter categories amount>0

  // chart data
  const chartData = {
    datasets: [{
      data: filteredCategories.map((c) => c.amount),
      backgroundColor: filteredCategories.map((c) => c.color),
    }],
    labels: filteredCategories.map((c) => c.type),
  };

  return { total, chartData };
};

export default useTransactions;
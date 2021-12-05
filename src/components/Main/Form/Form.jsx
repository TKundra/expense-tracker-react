import React, {useState, useContext} from 'react';
import { TextField, Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import useStyles from './styles';
import {ExpenseTrackerContext} from '../../../context/context'
import {v4 as uuidv4} from 'uuid';
import {incomeCategories, expenseCategories} from '../../../constants/categories';
import {formatDate} from '../../../utils/formatDate';

const initialState = {
  amount: '',
  category: '',
  type: 'Income',
  date: formatDate(new Date())
}

const Form = () => {
  const classes = useStyles();
  const [formState, setFormState] = useState(initialState);
  const {addTransaction} = useContext(ExpenseTrackerContext);

  const createTransaction = () => {
    const transaction = {...formState,
      id: uuidv4(),
      amount: Number(formState.amount)
    }
    addTransaction(transaction);
    setFormState(initialState);
  }

  const selectedCategories = formState.type === 'Income' ? incomeCategories : expenseCategories;

  return (
    <Grid container spacing={2}>

      <Grid item xs={12}>
        <Typography align="center" variant="subtitle2" gutterBottom>
          ...
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select value={formState.type} onChange={(e) => setFormState({...formState, type: e.target.value})}>
            <MenuItem value="Income">Income</MenuItem>
            <MenuItem value="Expense">Expense</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select value={formState.category} onChange={(e) => setFormState({...formState, category: e.target.value})}>
            {selectedCategories.map((data, index) => 
              <MenuItem key={index} value={data.type}>{data.type}</MenuItem>
            )}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={6}>
        <TextField type="number" label="Amount" fullWidth 
          value={formState.amount} onChange={(e) => setFormState({...formState, amount: e.target.value})} />
      </Grid>

      <Grid item xs={6}>
        <TextField type="date" label="Date" fullWidth
          value={formState.date} onChange={(e) => setFormState({...formState, date: formatDate(e.target.value)})} />
      </Grid>

      <Button className={classes.button} variant="outlined" color="primary" fullWidth onClick={createTransaction} >
        create
      </Button>

    </Grid>
  )
}

export default Form;
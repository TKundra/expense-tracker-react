import React, {useState, useContext, useEffect} from 'react';
import { TextField, Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import useStyles from './styles';
import { ExpenseTrackerContext } from '../../../context/context'
import {v4 as uuidv4} from 'uuid';
import { incomeCategories, expenseCategories } from '../../../constants/categories';
import { formatDate } from '../../../utils/formatDate';
import { useSpeechContext } from '@speechly/react-client';
import CustomizedSnackbar from '../../Snackbar/Snackbar';

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
  const {segment} = useSpeechContext();
  const [open, setOpen] = useState(false);

  const createTransaction = () => {
    if (Number.isNaN(Number(formState.amount)) || !formState.date.includes('-')){
      return;
    }
    const transaction = {...formState,
      id: uuidv4(),
      amount: Number(formState.amount)
    }
    addTransaction(transaction);
    setOpen(true);
    setFormState(initialState);
  }

  useEffect(() => { // set data (speechly)
    if (segment) {
      // intents
      if (segment.intent.intent === 'add_expense') {
        setFormState({ ...formState, type: 'Expense' });
      } else if (segment.intent.intent === 'add_income') {
        setFormState({ ...formState, type: 'Income' });
      } else if (segment.isFinal && segment.intent.intent === 'create_transaction') {
        return createTransaction(); // .isFinal - when we finished talking
      } else if (segment.isFinal && segment.intent.intent === 'cancel_transaction') {
        return setFormState(initialState);
      }
      // entities
      segment.entities.forEach((s) => {
        const category = `${s.value.charAt(0)}${s.value.slice(1).toLowerCase()}`; // s.value - INVESTMENTS convert to Investments

        switch (s.type) {
          case 'amount':
            setFormState({ ...formState, amount: s.value });
            break;
          case 'category':
            if (incomeCategories.map((iC) => iC.type).includes(category)) { // if category presents in categories
              setFormState({ ...formState, type: 'Income', category: category });
            } else if (expenseCategories.map((iC) => iC.type).includes(category)) {
              setFormState({ ...formState, type: 'Expense', category });
            }
            break;
          case 'date':
            setFormState({ ...formState, date: s.value });
            break;
          default:
            break;
        }
      });
      // when every attribute got data - call createTransaction() automatically
      if (segment.isFinal && formState.amount && formState.category && formState.type && formState.date) {
        createTransaction();
      }
    }
  }, [segment]);

  // show income categories only if title is income
  const selectedCategories = formState.type === 'Income' ? incomeCategories : expenseCategories;

  return (
    <Grid container spacing={2}>
      <CustomizedSnackbar open={open} setOpen={setOpen} />
      <Grid item xs={12}>
        <Typography align="center" variant="subtitle2" gutterBottom>
          {segment && 
              segment.words.map((e) => e.value).join(' ')
          }
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
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { database } from '../../..'

import { Expense } from '../models/Expense'

interface ExpensesState {
  entities: Expense[]
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState = {
  entities: [],
  loading: 'idle',
} satisfies ExpensesState as ExpensesState

const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: (create) => ({
    /**
     * @deprecated: do not write to the redux state, it shall be a cache of the database only
     */
    addExpense: create.preparedReducer(
      (expense: Expense) => {
        return { payload: { expense } }
      },
      (state, action) => {
        state.entities.push(action.payload.expense)
      }
    )
  }),
  extraReducers: (builder) => {
    builder.addCase(fetchExpenses.fulfilled, (state, action) => {
      state.entities = action.payload as Expense[]
    })
  },
});

export const fetchExpenses = createAsyncThunk('expenses/fetchExpenses', async (thunkAPI) => {
  let expenses = await database.get(Expense.table).query() as Expense[];
  return expenses;
});

export const { addExpense } = expensesSlice.actions
export default expensesSlice.reducer


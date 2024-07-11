import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { database } from '../../..'

import { ScheduledPayment } from '../models/ScheduledPayment'

interface ScheduledPaymentsState {
  entities: ScheduledPayment[]
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState = {
  entities: [],
  loading: 'idle',
} satisfies ScheduledPaymentsState as ScheduledPaymentsState

const expensesSlice = createSlice({
  name: 'scheduledPayments',
  initialState,
  reducers: (create) => ({
    /**
     * @deprecated do not write to the redux state, it shall be a cache of the database only
     */
    addScheduledPayment: create.preparedReducer(
      (scheduledPayment: ScheduledPayment) => {
        return { payload: { scheduledPayment } }
      },
      (state, action) => {
        state.entities.push(action.payload.scheduledPayment)
      }
    )
  }),
  extraReducers: (builder) => {
    builder.addCase(fetchScheduledPayments.fulfilled, (state, action) => {
      state.entities = action.payload as ScheduledPayment[]
    })
  },
});

export const fetchScheduledPayments = createAsyncThunk('expenses/fetchExpenses', async (thunkAPI) => {
  let expenses = await database.get(ScheduledPayment.table).query() as ScheduledPayment[];
  return expenses;
});

export const { addScheduledPayment } = expensesSlice.actions
export default expensesSlice.reducer


import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CUSTOMERS, getCustomerSubscription } from "../utils";

export const fetchCustomerSubscription = createAsyncThunk(
  "customer/fetchCustomerSubscription",
  async (customerId) => {
    return await getCustomerSubscription(customerId);
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    customerId: CUSTOMERS["en-US"].id,
    customerName: CUSTOMERS["en-US"].name,
    customerSubscriptions: [],
    availableCustomers: { ...CUSTOMERS },
  },
  reducers: {
    setCustomerId: (state, action) => {
      state.customerId = action.payload;
    },
    setCustomerName: (state, action) => {
      state.customerName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCustomerSubscription.fulfilled, (state, action) => {
      // Handle the fulfilled state if needed
      console.log("Customer subscription fetched:");
      // console.log(action.payload.subscriptions);
      const subscriptions = [];
      action.payload.subscriptions.forEach((subscription) => {
        subscriptions.push({
          id: subscription.id,
          status: subscription.status,
          startDate: subscription.start_date,
          endDate: subscription.ended_at,
          collectionMethod: subscription.collection_method,
          currentPeriod: {
            startDate: subscription.current_period_start,
            endDate: subscription.current_period_end,
          },
          details: {
            description: subscription.latest_invoice.lines.data[0].description,
            quantity: subscription.latest_invoice.lines.data[0].quantity,
            amountDue: subscription.latest_invoice.amount_due,
            amountRemaining: subscription.latest_invoice.amount_remaining,
            currency: subscription.latest_invoice.currency,
            period: {
              startDate: subscription.latest_invoice.lines.data[0].period.start,
              endDate: subscription.latest_invoice.lines.data[0].period.end,
            }
          }
        });
      });
      console.log(subscriptions)
      state.customerSubscriptions = [...subscriptions];
    });
  },
});

export const { setCustomerId, setCustomerName } = customerSlice.actions;
export default customerSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CUSTOMERS,
  cancelCustomerSubscription,
  getCustomerStripeId,
  getCustomerSubscription,
} from "../utils";
// ToDo: Fetch stripeId from the API
export const fetchCustomerStripeId = createAsyncThunk(
  "customer/fetchCustomerStripeId",
  async (customerId) => {
    return await getCustomerStripeId(customerId);
  }
);

export const fetchCustomerSubscription = createAsyncThunk(
  "customer/fetchCustomerSubscription",
  async (customerId) => {
    return await getCustomerSubscription(customerId);
  }
);

export const deleteCustomerSubscription = createAsyncThunk(
  "customer/deleteCustomerSubscription",
  async (subscriptionId) => {
    return await cancelCustomerSubscription(subscriptionId);
  }
);

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    customerId: CUSTOMERS["en-US"].id,
    customerName: CUSTOMERS["en-US"].name,
    customerStripeId: null,
    customerSubscriptions: [],
    numberOfSubscriptions: 0,
    availableCustomers: { ...CUSTOMERS },
    isFetchingData: false,
    requestHadError: false,
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
    builder.addCase(fetchCustomerStripeId.pending, (state) => {
      state.isFetchingData = true;
    });
    builder.addCase(fetchCustomerStripeId.fulfilled, (state, action) => {
      state.customerStripeId = action.payload;
    });
    builder.addCase(fetchCustomerStripeId.rejected, (state) => {
      state.isFetchingData = false;
    });
    builder.addCase(fetchCustomerSubscription.pending, (state) => {
      state.isFetchingData = true;
    });
    builder.addCase(fetchCustomerSubscription.fulfilled, (state, action) => {
      state.isFetchingData = false;
      if (
        !action.payload ||
        !action.payload.subscriptions ||
        action.payload.subscriptions.length === 0
      ) {
        state.customerSubscriptions = [];
        state.numberOfSubscriptions = 0;
        return;
      }
      const subscriptions = [];

      action.payload.subscriptions.forEach((subscription) => {
        subscriptions.push({
          id: subscription.id,
          status: subscription.status,
          startDate: subscription.start_date,
          endDate: subscription.ended_at,
          collectionMethod: subscription.collection_method,
          customerId: subscription.customer,
          currentPeriod: {
            startDate: subscription.current_period_start,
            endDate: subscription.current_period_end,
          },
          recurrence: subscription.latest_invoice.lines.data[0].plan.interval,
          details: {
            description: subscription.latest_invoice.lines.data[0].description,
            quantity: subscription.latest_invoice.lines.data[0].quantity,
            amountDue: subscription.latest_invoice.amount_due,
            amountRemaining: subscription.latest_invoice.amount_remaining,
            currency: subscription.latest_invoice.currency,
            period: {
              startDate: subscription.latest_invoice.lines.data[0].period.start,
              endDate: subscription.latest_invoice.lines.data[0].period.end,
            },
          },
        });
      });
      // ToDo: Remove console logs in production
      console.log(
        `Customer subscription fetched. Having ${subscriptions.length} subscriptions.`
      );
      console.log(subscriptions);
      state.customerSubscriptions = [...subscriptions];
      state.numberOfSubscriptions = subscriptions.length;
    });
    builder.addCase(fetchCustomerSubscription.rejected, (state) => {
      state.isFetchingData = false;
    });
    builder.addCase(deleteCustomerSubscription.pending, (state) => {
      state.isFetchingData = true;
      state.requestHadError = false;
    });
    builder.addCase(deleteCustomerSubscription.fulfilled, (state, action) => {
      state.isFetchingData = false;
      const subscriptionId = action.payload.deleted.id;
      state.customerSubscriptions = state.customerSubscriptions.filter(
        (subscription) => subscription.id !== subscriptionId
      );
      state.numberOfSubscriptions = state.customerSubscriptions.length;
      // ToDo: Remove console logs in production
      console.log(
        `Customer subscription with ID ${subscriptionId} deleted successfully.`
      );
    });
    builder.addCase(deleteCustomerSubscription.rejected, (state) => {
      state.isFetchingData = false;
      state.requestHadError = true;
    });
  },
});

export const { setCustomerId, setCustomerName } = customerSlice.actions;
export default customerSlice.reducer;

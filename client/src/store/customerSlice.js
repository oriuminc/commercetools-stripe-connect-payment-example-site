import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  CUSTOMERS,
  cancelCustomerSubscription,
  fetchAdminToken,
  getCustomerStripeId,
  getCustomerSubscription,
  patchCustomerSubscription as patchCustomerSubscriptionAPI,
  updateCustomerSubscription as updateCustomerSubscriptionAPI,
} from "../utils";

export const fetchCustomerStripeId = createAsyncThunk(
  "customer/fetchCustomerStripeId",
  async (customerId) => {
    return await getCustomerStripeId(customerId);
  }
);

export const fetchCustomerSubscription = createAsyncThunk(
  "customer/fetchCustomerSubscription",
  async (customerId, thunkAPI) => {
    const { token } = await thunkAPI
      .dispatch(ensureCommerceToolsAuthToken())
      .unwrap();
    return await getCustomerSubscription(customerId, token);
  }
);

export const deleteCustomerSubscription = createAsyncThunk(
  "customer/deleteCustomerSubscription",
  async ({ customerId, subscriptionId }, thunkAPI) => {
    const { token } = await thunkAPI
      .dispatch(ensureCommerceToolsAuthToken())
      .unwrap();
    return await cancelCustomerSubscription(customerId, subscriptionId, token);
  }
);

export const patchCustomerSubscription = createAsyncThunk(
  "customer/patchCustomerSubscription",
  async ({ customerId, subscriptionId, updateData }, thunkAPI) => {
    const { token } = await thunkAPI
      .dispatch(ensureCommerceToolsAuthToken())
      .unwrap();
    const result = await patchCustomerSubscriptionAPI(
      customerId,
      subscriptionId,
      updateData,
      token
    );

    await thunkAPI.dispatch(fetchCustomerSubscription(customerId));

    return result;
  }
);


export const updateCustomerSubscription = createAsyncThunk(
  "customer/updateCustomerSubscription",
  async ({ customerId, subscriptionId, newProductId, newVariantId, newPriceId }, thunkAPI) => {
    const { token } = await thunkAPI
      .dispatch(ensureCommerceToolsAuthToken())
      .unwrap();
    const result = await updateCustomerSubscriptionAPI(
      customerId,
      subscriptionId,
      newProductId,
      newVariantId,
      newPriceId,
      token
    );

    await thunkAPI.dispatch(fetchCustomerSubscription(customerId));

    return result;
  }
);

export const ensureCommerceToolsAuthToken = createAsyncThunk(
  "customer/ensureCommerceToolsAuthToken",
  async (_, thunkAPI) => {
    const {
      commerceToolsAuthToken,
      commerceToolsAuthIssuedAt,
      commerceToolsAuthExpiresIn,
    } = thunkAPI.getState().customer;

    const isTokenValid =
      commerceToolsAuthToken &&
      commerceToolsAuthIssuedAt &&
      commerceToolsAuthExpiresIn &&
      Date.now() <
        commerceToolsAuthExpiresIn * 1000 + commerceToolsAuthIssuedAt;

    if (isTokenValid) {
      return {
        token: commerceToolsAuthToken,
        issuedAt: commerceToolsAuthIssuedAt,
        expiresIn: commerceToolsAuthExpiresIn,
      };
    }

    try {
      const token = await fetchAdminToken();
      return {
        token: token.access_token,
        issuedAt: Date.now(),
        expiresIn: token.expires_in,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
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
    commerceToolsAuthToken: null,
    commerceToolsAuthIssuedAt: null,
    commerceToolsAuthExpiresIn: null,
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
    builder
      .addCase(fetchCustomerStripeId.pending, (state) => {
        state.isFetchingData = true;
      })
      .addCase(fetchCustomerStripeId.fulfilled, (state, action) => {
        state.customerStripeId = action.payload;
      })
      .addCase(fetchCustomerStripeId.rejected, (state) => {
        state.isFetchingData = false;
      });
    builder
      .addCase(fetchCustomerSubscription.pending, (state) => {
        state.isFetchingData = true;
      })
      .addCase(fetchCustomerSubscription.fulfilled, (state, action) => {
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
            recurrence: subscription.latest_invoice.lines.data?.at(-1)?.plan?.interval ?? subscription.plan.interval,
            details: {
              subscriptionItemId: subscription.items.data?.at(-1).id,
              description:
                subscription.latest_invoice.lines.data.at(-1).description,
              quantity: subscription.items.data?.at(-1).quantity,
              amountDue: subscription.latest_invoice.amount_due,
              amountRemaining: subscription.latest_invoice.amount_remaining,
              currency: subscription.latest_invoice.currency,
              period: {
                startDate:
                  subscription.latest_invoice.lines.data?.at(-1).period.start,
                endDate: subscription.latest_invoice.lines.data?.at(-1).period.end,
              },
            },
          });
        });

        state.customerSubscriptions = [...subscriptions];
        state.numberOfSubscriptions = subscriptions.length;
      })
      .addCase(fetchCustomerSubscription.rejected, (state) => {
        state.isFetchingData = false;
      });
    builder
      .addCase(deleteCustomerSubscription.pending, (state) => {
        state.isFetchingData = true;
        state.requestHadError = false;
      })
      .addCase(deleteCustomerSubscription.fulfilled, (state, action) => {
        state.isFetchingData = false;
        const subscriptionId = action.payload.id;

        state.customerSubscriptions = state.customerSubscriptions.filter(
          (subscription) => subscription.id !== subscriptionId
        );
        state.numberOfSubscriptions = state.customerSubscriptions.length;
      })
      .addCase(deleteCustomerSubscription.rejected, (state) => {
        state.isFetchingData = false;
        state.requestHadError = true;
      });
    builder
      .addCase(patchCustomerSubscription.pending, (state) => {
        state.isFetchingData = true;
        state.requestHadError = false;
      })
      .addCase(patchCustomerSubscription.fulfilled, (state) => {
        state.isFetchingData = false;
      })
      .addCase(patchCustomerSubscription.rejected, (state) => {
        state.isFetchingData = false;
        state.requestHadError = true;
      });
      builder
      .addCase(updateCustomerSubscription.pending, (state) => {
        state.isFetchingData = true;
        state.requestHadError = false;
      })
      .addCase(updateCustomerSubscription.fulfilled, (state) => {
        state.isFetchingData = false;
      })
      .addCase(updateCustomerSubscription.rejected, (state) => {
        state.isFetchingData = false;
        state.requestHadError = true;
      });
    builder.addCase(ensureCommerceToolsAuthToken.fulfilled, (state, action) => {
      state.commerceToolsAuthToken = action.payload.token;
      state.commerceToolsAuthIssuedAt = action.payload.issuedAt;
      state.commerceToolsAuthExpiresIn = action.payload.expiresIn;
    });
  },
});

export const { setCustomerId, setCustomerName } = customerSlice.actions;
export default customerSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { CUSTOMERS } from "../utils";

const customerSlice = createSlice({
  name: "customer",
  initialState: {
    customerId: CUSTOMERS["en-US"].id,
    customerName: CUSTOMERS["en-US"].name,
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
});

export const { setCustomerId, setCustomerName } = customerSlice.actions;
export default customerSlice.reducer;

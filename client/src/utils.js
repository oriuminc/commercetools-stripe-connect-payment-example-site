const projectKey = process.env.REACT_APP_PROJECT_KEY;
const BACKEND_URL = process.env.REACT_APP_BASE_URL;


export const loadEnabler = async() => {
    try {
        const enablerModule = await
        import (process.env.REACT_APP_ENABLER_BUILD_URL);

        return enablerModule
    } catch (error) {
        console.error("Error while loading Enabler module", error);
    }
}

export const fetchAdminToken = async() => {
        const headers = new Headers();

    headers.append('Authorization', `Basic ${btoa(`${process.env.REACT_APP_CTP_CLIENT_ID}:${process.env.REACT_APP_CLIENT_SECRET}`)}`);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    var urlencoded = new URLSearchParams();
    urlencoded.append('grant_type', 'client_credentials');

    const response = await fetch(`${process.env.REACT_APP_AUTH_URL}/oauth/token`, {
        body: urlencoded,
        headers: headers,
        method: 'POST',
        redirect: 'follow',
    });

    const token = await response.json();

    if (response.status !== 200) {
      console.log({
          title: 'Token fetch failed',
          message: `Error ${response.status} while fetching token`,
      });
    return;
    } else {
      console.log({
          title: 'Token fetched',
          message: `Token fetched: ${token.access_token}`,
      });
    }
    console.log("Token fetched:", token)
    return token.access_token;
}

export const getCTSessionId = async (cartId) => {
  const accessToken = await fetchAdminToken();

  const sessionMetadata = {
    allowedPaymentMethods: ['card'], // add here your allowed methods for development purposes
  };

  const url = `${process.env.REACT_APP_SESSION_URL}/${projectKey}/sessions`

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      cart: {
        cartRef: {
          id: cartId,
        }
      },
      metadata: sessionMetadata,
    }),
  });
  const data = await res.json();

  if (!res.ok) {
    console.error("Not able to create session:", url, data)
    throw new Error("Not able to create session")
  }

  console.log("Session created:", data)
  return data.id;
}

export const updateCartShippingAddress = async (cart, address) => {
  const bodyConst = JSON.stringify({
    cartId: cart.id,
    address:{
      addressName: address.name,
      addressLine1: address.address.line1,
      addressCity: address.address.city,
      addressCountry: address.address.country,
      addressPostalCode: address.address.postal_code,
      addressState: address.address.state,
    }
  })

  return fetch(`${BACKEND_URL}/cart/address`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...DEV_REQUEST_HEADERS
    },
    body: bodyConst,
  }).then((response)=> console.log(response)
  ).catch((err)=> console.log(err));
};

export const getAddressFromPaymentIntent = async (payment_intent_id) => {
  let response = await fetch(`${BACKEND_URL}/payment-intent/${payment_intent_id}`,
    {
      headers:{
        ...DEV_REQUEST_HEADERS
      }
    }
  )
  const payment_intent = await response.json()
  const { latest_charge } = payment_intent;
  let responseCharge = await fetch(`${BACKEND_URL}/charge/${latest_charge}`,
    {
      headers:{
        ...DEV_REQUEST_HEADERS
      }
    }
  )
  const charge = await responseCharge.json()
  const { billing_details, shipping } = charge;
  let billingAlias = shipping;

  if (!shipping && billing_details) {
    billingAlias = billing_details;
  }

  return billingAlias
}

const MODE = process.env.REACT_APP_MODE;
console.log({MODE})
export const DEV_REQUEST_HEADERS = MODE === "dev" ? {
  "ngrok-skip-browser-warning": "6024"
} : {}

console.log({DEV_REQUEST_HEADERS})

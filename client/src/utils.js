const projectKey = process.env.REACT_APP_PROJECT_KEY;

export const loadEnabler = async () => {
    try {
        const enablerModule = await import(process.env.REACT_APP_ENABLER_BUILD_URL);
    
        return enablerModule
    } catch (error) {
        console.error("Error while loading Enabler module", error);
    }
}

export const fetchAdminToken = async () => {
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
# e-Commerce Example Integrated with commercetools Payment Connector and Stripe

![Sample site.png](docs%2FSample%20site.png)![[Pasted image 20240701172445.png]]

## Overview

This application provides a basic e-commerce site integrated with commercetools [Payment Connector](https://docs.commercetools.com/checkout/payment-connectors-applications) and [Stripe Web Elements](https://stripe.com/docs/payments/elements). It retrieves a product catalog directly from commercetools and uses commercetools' cart API when a user adds a new item to the cart. The Stripe Payment Element and Express Checkout are embedded through the Payment Connector.

## Stripe Integration

The following Stripe Web Elements are used directly from Stripe:

- [Link Authentication Element](https://docs.stripe.com/payments/elements/link-authentication-element)
- [Address Element](https://docs.stripe.com/elements/address-element)

Additionally, the [Stripe Payment Element](https://docs.stripe.com/payments/payment-element) and [Express Checkout Element](https://docs.stripe.com/elements/express-checkout-element) are embedded through the Payment Connector Integration found in the [Stripe commercetools Connect App GitHub repository](https://github.com/stripe/stripe-commercetools-connect-app).

## Checkout Process

When a user chooses to checkout, the e-commerce platform will:

1. Create the [Link Authentication Element](https://docs.stripe.com/payments/elements/link-authentication-element) and [Address Element](https://docs.stripe.com/elements/address-element) to collect complete billing and shipping addresses.
2. Add the shipping information to the cart in commercetools.
3. Utilize the Payment Connector integration for payment components, namely the [Stripe Payment Element](https://docs.stripe.com/payments/payment-element) and [Express Checkout Element](https://docs.stripe.com/elements/express-checkout-element).

## Payment Submission

After the user submits the payment:

1. The embedded components will call the Payment Connector processor responsible of creating the payment intent on Stripe.
2. The payment intent will contain metadata including the cart ID, commercetools project ID, and payment ID created in commercetools.
3. The payment created in commercetools will have the payment intent ID from Stripe in the `interfaceId` field.

## Webhook Handling

All Stripe webhooks will be sent to the Payment Connector backend. The Payment Connector will then:

1. Process the events.
2. Update the commercetools status accordingly.

## Stripe Technologies Included in This Demo

1. [Link Authentication Element](https://docs.stripe.com/payments/elements/link-authentication-element) (e-commerce site integrated)
2. [Address Element](https://docs.stripe.com/elements/address-element) (e-commerce site integrated)
3. [Stripe Payment Element](https://docs.stripe.com/payments/payment-element) (from Payment Connector integration)
4. [Express Checkout Element](https://docs.stripe.com/elements/express-checkout-element) (from Payment Connector integration)

### Considerations about Apple Pay

To enable the Apple Pay button in the payment element component, your website must have the correct domain association file hosted. This file is crucial for Apple to verify that you control the domain where Apple Pay will be used.

1. **Domain Association File**: Stripe generates a domain association file named `apple-developer-merchantid-domain-association`. You need to host this file at the following URL on your website:
   - `https://yourwebsite.com/.well-known/apple-developer-merchantid-domain-association`
   - Replace `https://yourwebsite.com` with your actual domain.
2. **Verification Process**: Once the file is correctly hosted, Stripe will automatically attempt to verify your domain with Apple. This verification is necessary for Apple Pay to function correctly on your site.
3. **Updating the File**: Keep in mind that this file has an expiration date. If you receive an error about an outdated file, you'll need to download the latest version from Stripe and replace the old file on your server.
   These steps ensure that the Apple Pay button is displayed and functional when using the payment element on your site.

## Installation Guide PDF

For a comprehensive step-by-step guide on installing both the Payment Connector and the example e-commerce site, please refer to the PDF guide linked below. This guide includes detailed instructions, screenshots, and troubleshooting tips to ensure a smooth setup process.

[Download Installation Guide PDF](docs%2FImplementation%20Guide%20-%20Payment%20Connector%20%2B%20Example%20Site.pdf)

## Installation

To install the necessary packages, run:

```bash
npm install
```

**Note:** Please make sure to have the Payment Connector from the commercetools marketplace and deploy the Payment Connector URL. To install it, you will need to run the example site and the Payment Connector project locally or add the Payment Connector from the commercetools marketplace. Further information on how to run the Payment Connector can be found in the [Payment Connector documentation](https://github.com/stripe/stripe-commercetools-connect-app).

## Running Locally

To start the app server, run the following command from the _root_ directory:

```bash
npm start
```

To run the app, navigate to the client directory and start it:

```bash
cd client
npm start
```

## Update .env

When running locally, copy /.env-sample to /.env and update it with your details:

```bash
cp .env-sample .env
```

| Variable                 | Description               | Example                                         |
| ------------------------ | ------------------------- | ----------------------------------------------- |
| REACT_APP_SK             | Stripe Private Key        | sk*test*\*\*\*\*                                |
| REACT_APP_ADMIN          | Stripe Account ID         | actt\_\*\*\*\*                                  |
| REACT_APP_PORT           | Port to run the server    | 8081                                            |
| REACT_APP_BASE_URL       | Base URL of the server    | http://localhost:8081                           |
| REACT_APP_CT_PROJECT_KEY | commercetools Project Key | **\***                                          |
| REACT_APP_CT_CLIENT_ID   | commercetools Client ID   | **\***                                          |
| REACT_APP_CT_SECRET      | commercetools Secret Key  | **\***                                          |
| REACT_APP_CT_API_URL     | commercetools API URL     | https://api.europe-west1.gcp.commercetools.com  |
| REACT_APP_CT_AUTH_URL    | commercetools Auth URL    | https://auth.europe-west1.gcp.commercetools.com |

Similarly, copy /client/.env-sample to /client/.env and update it with your details:

```bash
cp client/.env-sample client/.env
```

| Variable                    | Description                                              | Example                                                                                                                         |
| --------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| REACT_APP_PK                | Stripe Publishable Key                                   | pktest\*\*\*\*                                                                                                                  |
| REACT_APP_BASE_URL          | Base URL of the server example site                      | http://localhost:8081                                                                                                           |
| REACT_APP_CT_PROJECT_KEY       | commercetools Project Key                                | **\***                                                                                                                          |
| REACT_APP_CT_CLIENT_ID     | commercetools Client ID                                  | **\***                                                                                                                          |
| REACT_APP_CT_SECRET     | commercetools Secret Key                                 | **\***                                                                                                                          |
| REACT_APP_SESSION_URL       | commercetools API session url                            | [https://session.us-central1.gcp.commercetools.com](https://session.us-central1.gcp.commercetools.com/)                         |
| REACT_APP_CT_AUTH_URL          | commercetools Auth URL                                   | https://auth.europe-west1.gcp.commercetools.com                                                                                 |
| REACT_APP_ENABLER_BUILD_URL | URL of the Connector enabler deployed in commercetools   | https://assets-307a12410-95f0-4c70-8d69-75ca21sd28ad4c.assets.us-central1.gcp.preview.commercetools.app/connector-enabler.es.js |
| REACT_APP_PROCESOR_URL      | URL of the Connector Processor deployed in commercetools | https://service-1d71326-3fd2-4bd5-b7c4-a12134.us-central1.gcp.preview.commercetools.app                                         |

# Sequence Diagram

Below is a detailed sequence diagram of the calls used inside the checkout example:
![sequence_diagram.png](docs%2Fsequence_diagram.png)

# Commerce Tools

When creating a new API client you will need to set the following Scopes:

### Manage

- Customers
- Orders
- Payments
- Products

### View

- Categories
- Customers
- Orders
- Payments
- Products (all)
- Products (published)

### Manage My

- Orders
- Payments
- Profile
- Shopping Lists

### Tokens

- Create Anonymous Token

![New Api Client](docs/ApiClient.png)

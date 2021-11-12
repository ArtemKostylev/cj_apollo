import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./Pages/App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ProvideAuth } from "./scripts/use-auth.js";
import { setContext } from "@apollo/client/link/context";
import { createUploadLink } from "apollo-upload-client";

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { USER } from "./scripts/constants";

const authLink = setContext((_, { headers }) => {
  const user = JSON.parse(localStorage.getItem(USER));
  const token = user ? user.token : false;
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});
//const path = "https://akostylev.com/api";
const path = "http://localhost:4000";

const httpLink = createUploadLink({
  uri: path,
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
ReactDOM.render(
  <ApolloProvider client={client}>
    <ProvideAuth>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ProvideAuth>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './Pages/App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ProvideAuth } from './utils/use-auth.js';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { USER_ALIAS } from './constants/localStorageAliases';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';

const pathMap = {
  development: 'http://localhost:4000',
  production: 'https://akostylev.com/api',
};

const authLink = setContext((_, { headers }) => {
  const user = JSON.parse(localStorage.getItem(USER_ALIAS));
  const token = user ? user.token : false;
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const httpLink = createUploadLink({
  uri: pathMap[process.env.REACT_APP_ENV],
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <ProvideAuth>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </ProvideAuth>
  </ApolloProvider>,
  document.getElementById('root')
);

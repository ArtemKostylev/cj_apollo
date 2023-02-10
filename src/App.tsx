import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import {theme} from './styles/theme';
import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import {AuthProvider} from './hooks/useAuth';
import {ThemeProvider} from 'styled-components';
import {setContext} from '@apollo/client/link/context';
import {USER_ALIAS} from './constants/localStorageAliases';
import {createUploadLink} from 'apollo-upload-client';
import {MainRouter} from './MainRouter';

import moment from 'moment';

const pathMap: Record<string, string> = {
  development: 'http://localhost:4000',
  production: 'https://akostylev.com/api',
};

const authLink = setContext((_, {headers}) => {
  const user = JSON.parse(localStorage.getItem(USER_ALIAS) as string);
  const token = user ? user.token : false;
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const httpLink = createUploadLink({uri: pathMap[process.env.REACT_APP_ENV as string]});

const client = new ApolloClient({
  link: authLink.concat(httpLink as any),
  cache: new InMemoryCache({
    typePolicies: {
      MidtermExam: {
        keyFields: ["number"]
      }
    }
  }),
});

export default function App() {
  moment.locale('ru');

  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <MainRouter/>
          </ThemeProvider>
        </AuthProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
}

import React from 'react';
import {Login} from './Pages/Login';
import {Switch, Route, BrowserRouter} from 'react-router-dom';
import {ErrorScreen} from './Pages/ErrorScreen';
import {ROUTES} from './constants/routes';
import {MainLayout} from './ui/MainLayout';
import {theme} from './styles/theme';
import {ApolloClient, ApolloLink, ApolloProvider, InMemoryCache} from '@apollo/client';
import {ProvideAuth} from './hooks/useAuth';
import {ThemeProvider} from 'styled-components';
import {setContext} from '@apollo/client/link/context';
import {USER_ALIAS} from './constants/localStorageAliases';
import {createUploadLink} from 'apollo-upload-client';

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
  return (
    <BrowserRouter>
      <ApolloProvider client={client}>
        <ProvideAuth>
          <ThemeProvider theme={theme}>
            <Switch>
              <Route path={ROUTES.LOGIN} component={Login}/>
              <Route path={ROUTES.ERROR} component={ErrorScreen}/>
              <Route path={ROUTES.HOME} component={MainLayout}/>
            </Switch>
          </ThemeProvider>
        </ProvideAuth>
      </ApolloProvider>
    </BrowserRouter>
  );
}

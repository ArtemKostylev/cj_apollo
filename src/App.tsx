import { BrowserRouter } from "react-router-dom";
import { theme } from "./styles/theme";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { AuthProvider } from "./hooks/useAuth";
import { ThemeProvider } from "styled-components";
import { setContext } from "@apollo/client/link/context";
import { USER_ALIAS } from "./constants/localStorageAliases";
import { MainRouter } from "./MainRouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const authLink = setContext((_, { headers }) => {
  const user = JSON.parse(localStorage.getItem(USER_ALIAS) as string);
  const token = user ? user.token : false;
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const httpLink = ApolloLink.from([
  authLink,
  new HttpLink({ uri: "http://localhost:4000/graphql" }),
]);

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

const queryClient = new QueryClient();

export default function App() {
  return (
    <BrowserRouter>
      <ApolloProvider client={apolloClient}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider theme={theme}>
              <MainRouter />
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ApolloProvider>
    </BrowserRouter>
  );
}

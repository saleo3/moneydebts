import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import gql from 'graphql-tag';
// import { ApolloProvider, graphql } from 'react-apollo';


import registerServiceWorker from './registerServiceWorker';
import { authToken } from "./constants";
import { BrowserRouter } from 'react-router-dom';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';


const wsLink = new WebSocketLink({
  uri: "wss://subscriptions.graph.cool/v1/cj8kfak0l000x01537mvz9ou1",
  options: {
    reconnect: true,
    connectionParams: {
      authToken
    }
  }
});

const httpLink = createHttpLink({ uri: "https://api.graph.cool/simple/v1/cj8kfak0l000x01537mvz9ou1" });

const middlewareLink = setContext(() => ({
  headers: { 
    authorization: authToken || null,
  }
}));

// use with apollo-client
const midLink = middlewareLink.concat(httpLink);

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  midLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
  </BrowserRouter>, 
    document.getElementById('root')
);

registerServiceWorker();

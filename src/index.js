import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { ApolloProvider, createNetworkInterface, ApolloClient } from "react-apollo";
import { authToken } from "./constants";
import { SubscriptionClient, addGraphQLSubscriptions } from 'subscriptions-transport-ws';
// import { addGraphQLSubscriptions } from 'add-graphql-subscriptions';


const networkInterface = createNetworkInterface({
    uri: 'https://api.graph.cool/simple/v1/cj8kfak0l000x01537mvz9ou1'
});

const wsClient = new SubscriptionClient('wss://subscriptions.graph.cool/v1/cj8kfak0l000x01537mvz9ou1', {
  reconnect: true,
  connectionParams: {
     authToken: authToken
  }
});

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) req.options.headers = {};

    const token = authToken
    req.options.headers.authorization = token ? `Bearer ${token}` : null
    next();
  }
}]);

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient
);

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>, 
    document.getElementById('root')
);

registerServiceWorker();

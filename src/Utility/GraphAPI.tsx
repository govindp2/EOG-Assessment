import { ApolloClient } from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link'
import { onError } from 'apollo-link-error';
import { getMainDefinition } from 'apollo-utilities';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';



const url = new HttpLink({ uri: 'https://react.eogresources.com/graphql' });

const webURL = new WebSocketLink({
    uri: 'ws://react.eogresources.com/graphql',
    options: {
        reconnect: true
    },
});


let link = ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {

        if (graphQLErrors) {
            graphQLErrors.map(({ message, locations, path }) =>
                console.log(`[graphQL Error] :  Message: ${message}, location: ${locations}, path: ${path}`),
            );
        } else if (networkError) {
            console.log(`[network Error] :  Message: ${networkError}`, networkError.stack)
        }

    }),
    ApolloLink.split(
        ({ query }) => {
            const queryDefinition = getMainDefinition(query);
            return queryDefinition.kind === 'OperationDefinition' && queryDefinition.operation === 'subscription';
        },
        webURL,
        url
    ),
]);

export const apiCall = new ApolloClient({
    link,
    cache: new InMemoryCache(),
})

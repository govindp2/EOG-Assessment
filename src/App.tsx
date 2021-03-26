import React from 'react';
import createStore from './store';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/react-hooks';
import { ToastContainer } from 'react-toastify';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import 'react-toastify/dist/ReactToastify.css';
//import Header from './components/Header';
import Wrapper from './components/Wrapper';
import GraphHooks from './components/graphHooks'
//import NowWhat from './components/NowWhat';
import { apiCall } from './Utility/GraphAPI'

const store = createStore();
const theme = createMuiTheme({
  palette: {
    primary: {
      main: 'rgb(39,49,66)',
    },
    secondary: {
      main: 'rgb(197,208,222)',
    },
    background: {
      default: 'rgb(226,231,238)',
    },
  },
});

const App = () => (
  <MuiThemeProvider theme={theme}>
    <CssBaseline />
    <Provider store={store}>
      <ApolloProvider client = {apiCall}>
      <Wrapper>
       <GraphHooks />
        <ToastContainer />
      </Wrapper>
      </ApolloProvider>
    </Provider>
  </MuiThemeProvider>
);

export default App;

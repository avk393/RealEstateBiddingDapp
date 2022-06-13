import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import App from './src/components/App';
import {StrictMode} from 'react';
import configureStore from "./src/redux/configureStore";
import { Provider as ReduxProvider } from "react-redux";


// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
const store = configureStore();

render(
    <ReduxProvider store={store}>
        <Router>
         <App />
        </Router>
    </ReduxProvider>,
    document.getElementById('root')
);
  

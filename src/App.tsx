import { Web3ReactProvider } from '@web3-react/core';
import {
  ExternalProvider,
  JsonRpcFetchFunc,
  Web3Provider,
} from '@ethersproject/providers';

import './App.css';
import Dashboard from './pages/Dashboard';
import ApplicationUpdater from './state/updater';
import Header from './components/Header';

function getLibrary(
  provider: ExternalProvider | JsonRpcFetchFunc
): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 8000;
  return library;
}

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <>
        <ApplicationUpdater />
      </>
      <div className="App">
        <Header />
        <Dashboard />
      </div>
    </Web3ReactProvider>
  );
}

export default App;

import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

import { useEagerConnect, useInactiveListener } from '../hooks';
import connectorList from '../lib/connectors';

type ConnectorName = 'MetaMask';

const ConnectWallet = () => {
  const [isConnecing, setIsConnecing] = useState(false);
  const { activate, deactivate, active, error, account } = useWeb3React<Web3Provider>();

  const triedEager = useEagerConnect();

  useInactiveListener(!triedEager);

  const handleClick = (connectorName: ConnectorName) => () => {
    setIsConnecing(true);
    activate(connectorList[connectorName]);
  };

  const handleDisconnect = () => {
    deactivate();
  };

  const handleRetry = () => {
    setIsConnecing(false);
    deactivate();
  };

  useEffect(() => {
    if (active) {
      setIsConnecing(false);
    }
  }, [active]);

  return (
    <div className="buttons">
      {active && (
        <div className='wrap-address'>
          {account?.substring(0,6) + '...' + account?.slice(account?.length- 4)}
        </div>
      )}
      {error && <p className="text-error">error: {error.message}</p>}
      {active && (
        <button className="button is-danger m-0" onClick={handleDisconnect}>
          Disconnect Wallet
        </button>
      )}
      {!active && (
        <>
          <button className='button is-primary m-0' onClick={handleClick('MetaMask')} disabled={isConnecing}>
            Connect on MetaMask
          </button>
        </>
      )}
      {!active && error && <button className='button is-light m-0'  onClick={handleRetry}>Retry</button>}
    </div>
  );
};

export default ConnectWallet;

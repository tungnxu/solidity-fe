import { InjectedConnector } from '@web3-react/injected-connector';

// import { PortisConnector } from './portis-connector';

type SupportChainId = 1 | 3 | 4 | 5 | 42 | 137 | 80001 | 31337;

const supportChainIdList: SupportChainId[] = [1, 3, 4, 5, 42, 137, 80001, 31337];

export const injected = new InjectedConnector({
  supportedChainIds: supportChainIdList,
});

export const connectorList = {
  MetaMask: injected,
};

export default connectorList;

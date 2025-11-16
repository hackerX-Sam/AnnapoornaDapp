import { createContext, useContext, ReactNode } from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';

const wallets = [new PetraWallet()];

interface WalletContextType {}

const WalletContext = createContext<WalletContextType>({});

export const useWalletContext = () => useContext(WalletContext);

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <AptosWalletAdapterProvider plugins={wallets} autoConnect={true}>
      <WalletContext.Provider value={{}}>
        {children}
      </WalletContext.Provider>
    </AptosWalletAdapterProvider>
  );
}

import { useState } from 'react'
// import TokenPresaleForm from './component/TokenPresaleForm'
import TokenCreator from './component/TokenCreator'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
        <WalletProvider wallets={[]} autoConnect>
            <WalletModalProvider>
              <div className='flex gap-6 justify-end bg-gray-900 p-6'>
                <WalletMultiButton />
                {/* <WalletDisconnectButton /> */}
              </div>
              <TokenCreator/>
            </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  )
}

export default App

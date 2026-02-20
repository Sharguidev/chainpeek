import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '../../wagmi.config'
import { ConnectButton } from './WalletConnect'
import { WalletBalance } from './WalletBalance'

const queryClient = new QueryClient()

export default function Web3Provider() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletBalance />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// Standalone provider wrapper for use in other islands (e.g. Navbar)
export function WagmiConnectButton() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectButton />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

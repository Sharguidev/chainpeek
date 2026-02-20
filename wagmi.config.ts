import { createConfig, http } from 'wagmi'
import { mainnet, lineaSepolia, linea } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'

export const config = createConfig({
    ssr: true,
  chains: [mainnet, linea, lineaSepolia],
  connectors: [
    metaMask({
        infuraAPIKey: import.meta.env.NEXT_PUBLIC_INFURA_KEY!,
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [linea.id]: http(),
    [lineaSepolia.id]: http(),
  },
})





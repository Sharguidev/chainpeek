import { useAccount, useBalance, useReadContract } from 'wagmi'
import { mainnet } from 'wagmi/chains'

const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7' as const

const erc20BalanceOfAbi = [
    {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
    },
] as const

export const WalletBalance = () => {
    const { address } = useAccount()

    const { data: ethBalance } = useBalance({
        address,
        chainId: mainnet.id,
    })

    const { data: usdtRaw } = useReadContract({
        address: USDT_ADDRESS,
        abi: erc20BalanceOfAbi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        chainId: mainnet.id,
        query: { enabled: !!address },
    })

    const usdtBalance = usdtRaw !== undefined
        ? (Number(usdtRaw) / 1e6).toFixed(2)
        : null

    if (!address) return null

    return (
        <div>
            <div>
                <span>ETH: </span>
                <span>
                    {ethBalance
                        ? `${(Number(ethBalance.value) / 10 ** ethBalance.decimals).toFixed(4)} ETH`
                        : 'Loading...'}
                </span>
            </div>
            <div>
                <span>USDT: </span>
                <span>
                    {usdtBalance ? `${usdtBalance} USDT` : 'Loading...'}
                </span>
            </div>
        </div>
    )
}

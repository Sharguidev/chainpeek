import { WagmiProvider, useAccount, useBalance, useReadContract, useConnect, useConnectors } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '../../wagmi.config'
import { mainnet } from 'wagmi/chains'
import '../styles/dashboard.css'
import "./../styles/button.css"
import { Wallet, Send, HandCoins } from 'lucide-react';

const USDT_ADDRESS = '0xdAC17F958D2ee523a2206206994597C13D831ec7' as const

const BalanceOfAbi = [
    {
        name: 'balanceOf',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: '', type: 'uint256' }],
    },
] as const

const queryClient = new QueryClient()

function DashboardContent() {
    const { address } = useAccount()
    const { connectors, connect } = useConnect()

    const { data: ethBalance, isLoading: ethLoading } = useBalance({
        address,
        chainId: mainnet.id,
    })

    const { data: usdtRaw, isLoading: usdtLoading } = useReadContract({
        address: USDT_ADDRESS,
        abi: BalanceOfAbi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        chainId: mainnet.id,
        query: { enabled: !!address },
    })

    const ethAmount = ethBalance
        ? (Number(ethBalance.value) / 10 ** ethBalance.decimals).toFixed(4)
        : '0.0000'

    const usdtAmount = usdtRaw !== undefined
        ? (Number(usdtRaw) / 1e6).toFixed(2)
        : '0.00'

    const isEthLoading = !!address && ethLoading
    const isUsdtLoading = !!address && usdtLoading

    // ── Disconnected state ──────────────────────────────────────────
    if (!address) {
        return (
            <div className="dashboard-wrapper">
                <div className="dashboard-card">
                    <div className="dashboard-header">
                        <div className="dashboard-balance-section">
                            <span className="dashboard-label">Total Balance</span>
                            <span className="dashboard-total" style={{ color: 'rgba(255,255,255,0.25)' }}>—</span>
                        </div>
                    </div>

                    <div className="dashboard-assets-label">Your Assets</div>

                    {/* Blurred placeholder rows */}
                    {['Ethereum', 'Tether'].map(name => (
                        <div key={name} className="dashboard-asset-row" style={{ opacity: 0.25, filter: 'blur(3px)', userSelect: 'none', pointerEvents: 'none' }}>
                            <div className="dashboard-asset-left">
                                <div className="dashboard-asset-icon" style={{ background: '#333' }}>?</div>
                                <div>
                                    <div className="dashboard-asset-name">{name}</div>
                                    <div className="dashboard-asset-amount">0.0000</div>
                                </div>
                            </div>
                            <div className="dashboard-asset-right">
                                <div className="dashboard-asset-value">$0.00</div>
                            </div>
                        </div>
                    ))}

                    {/* Connect CTA */}
                    <div className="dashboard-connect-cta">
                        <p className="dashboard-connect-hint">Connect your wallet to view balances</p>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {connectors.map(connector => (
                                <div className="user-profile" key={connector.uid}>
                                    <div className="user-profile-inner">
                                        <button className='btn-manage-status' onClick={() => connect({ connector })}>
                                            <Wallet color='white' size={24} />
                                            Connect Wallet
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // ── Connected state ─────────────────────────────────────────────
    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-card">

                {/* Header */}
                <div className="dashboard-header">
                    <div className="dashboard-balance-section">
                        <span className="dashboard-label">
                            Total Balance
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        </span>
                        <span className="dashboard-total">
                            {isUsdtLoading ? '...' : `${usdtAmount} USDT`}
                        </span>
                    </div>

                    <div className="dashboard-actions">
                        <button className="dashboard-btn dashboard-btn-primary">
                            <Send />
                            Send
                        </button>
                        <button className="dashboard-btn dashboard-btn-secondary">
                            <HandCoins />
                            Receive
                        </button>
                        <button className="dashboard-btn-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Assets */}
                <div className="dashboard-assets-label">Your Assets</div>

                {/* ETH Row */}
                <div className="dashboard-asset-row">
                    <div className="dashboard-asset-left">
                        <div className="dashboard-asset-icon" style={{ background: 'linear-gradient(135deg, #627eea 0%, #3a4f9e 100%)' }}>
                            Ξ
                        </div>
                        <div>
                            <div className="dashboard-asset-name">Ethereum</div>
                            <div className="dashboard-asset-amount">
                                {isEthLoading ? 'Loading...' : `${ethAmount} ETH`}
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-asset-right">
                        <div className="dashboard-asset-value">
                            {isEthLoading ? '—' : `${ethAmount} ETH`}
                        </div>
                        <div className="dashboard-asset-loading">Ethereum Mainnet</div>
                    </div>
                </div>

                {/* USDT Row */}
                <div className="dashboard-asset-row">
                    <div className="dashboard-asset-left">
                        <div className="dashboard-asset-icon" style={{ background: 'linear-gradient(135deg, #26a17b 0%, #1a7a5a 100%)' }}>
                            ₮
                        </div>
                        <div>
                            <div className="dashboard-asset-name">Tether</div>
                            <div className="dashboard-asset-amount">
                                {isUsdtLoading ? 'Loading...' : `${usdtAmount} USDT`}
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-asset-right">
                        <div className="dashboard-asset-value">
                            {isUsdtLoading ? '—' : `$${usdtAmount}`}
                        </div>
                        <div className="dashboard-asset-loading">$1.00 / USDT</div>
                    </div>
                </div>

                {/* Footer */}
                <div className="dashboard-footer">
                    <a href="#">View All Assets</a>
                </div>
            </div>
        </div>
    )
}

export function WalletDashboard() {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <DashboardContent />
            </QueryClientProvider>
        </WagmiProvider>
    )
}

import { useConnect, useDisconnect, useAccount } from 'wagmi'
import "./../styles/button.css"
import { Wallet } from 'lucide-react';

export const ConnectButton = () => {
  const { address } = useAccount()
  const { connectors, connect } = useConnect()
  const { disconnect } = useDisconnect()

  if (address) {
    return (
      <div className="user-profile">
        <div className="user-profile-inner">
          <Wallet color='white' size={24} />
          <button className='btn-manage-status' onClick={() => disconnect()}>Disconnect</button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="user-profile">
        <div className="user-profile-inner">
          {connectors.map(connector => (
            <button className='btn-manage-status' key={connector.uid} onClick={() => connect({ connector })}>
              <Wallet color='white' size={24} />
              Connect Wallet
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
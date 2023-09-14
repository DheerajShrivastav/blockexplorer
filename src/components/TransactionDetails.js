import React, { useEffect, useState } from 'react'
import { Alchemy, Network } from 'alchemy-sdk'

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET, // Make sure to import 'Network' from 'alchemy-sdk'
}

const alchemy = new Alchemy(settings)

function TransactionDetails({ txHash, onClose }) {
  const [transactionInfo, setTransactionInfo] = useState(null)

  useEffect(() => {
    async function fetchTransactionInfo() {
      const info = await alchemy.core.getTransactionReceipt(txHash)
      setTransactionInfo(info)
    }

    fetchTransactionInfo()
  }, [txHash])

  return (
    <div className="transaction-details">
      <h2>Transaction Details</h2>
      {transactionInfo ? (
        <>
          <div> Transaction Hash: {transactionInfo.transactionHash}</div>
          <div> To: {transactionInfo.to}</div>
          <div> From: {transactionInfo.from}</div>
          <div> Block Number: {transactionInfo.blockNumber}</div>
          <div>
            Contract Address:
            {transactionInfo.contractAddress
              ? transactionInfo.contractAddress
              : 'null'}
          </div>
          <div> Gas Used: {transactionInfo.gasUsed._hex}</div>
          <div>
            Effective Gas Price: {transactionInfo.effectiveGasPrice._hex}
          </div>
          <div> Transaction Index: {transactionInfo.transactionIndex}</div>
          <div> Type: {transactionInfo.type}</div>
          {/* Add more transaction details as needed */}
        </>
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={onClose}>Close</button>
    </div>
  )
}

export default TransactionDetails

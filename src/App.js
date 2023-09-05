import { Alchemy, Network } from 'alchemy-sdk'
import { useEffect, useState } from 'react'

import './App.css'

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
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
          <div> Contract Address: {transactionInfo.contractAddress ? transactionInfo.contractAddress  : "null"}</div>
          <div> Gas Used: {transactionInfo.gasUsed._hex}</div>
          <div> Effective Gas Price: {transactionInfo.effectiveGasPrice._hex}</div>
          <div> Transaction Index: {transactionInfo.transactionIndex}</div>
          <div> Type: {transactionInfo.type}</div>
          {/* Add more transaction details as needed */}
          {console.log(transactionInfo)}
        </>
      ) : (
        <p>Loading...</p>
      )}
      <button onClick={onClose}>Close</button>
    </div>
  )
}

function App() {
  const [blockNumber, setBlockNumber] = useState()
  const [response, setResponse] = useState({})
  const [transactions, setTransactions] = useState([])
  const [selectedTxHash, setSelectedTxHash] = useState(null)

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber())
    }

    getBlockNumber()
  }, [])

  useEffect(() => {
    async function fetchData() {
      const block = await alchemy.core.getBlock(blockNumber)
      setResponse(block)
    }

    async function fetchTransactions() {
      const tx = await alchemy.core.getBlockWithTransactions(blockNumber)
      setTransactions(tx.transactions || [])
    }

    fetchData()
    fetchTransactions()
  }, [blockNumber])

  const openTransactionInfo = (txHash) => {
    setSelectedTxHash(txHash)
  }

  const closeTransactionInfo = () => {
    setSelectedTxHash(null)
  }

  return (
    <div>
      <div className="App">Block Number: {blockNumber}</div>
      <div>Hash: {response.hash}</div>
      <div>ParentHash: {response.parentHash}</div>
      <div>Number: {response.number}</div>
      <div>TimeStamp: {response.timestamp}</div>
      <div>Nonce: {response.nonce}</div>
      <div>Difficulty: {response.difficulty}</div>
      <div>Miner: {response.miner}</div>

      <h2>Transactions:</h2>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>
            <div>Transaction {index + 1}</div>
            <div onClick={() => openTransactionInfo(transaction.hash)}>
              Hash: {transaction.hash}
            </div>
            <div>Type: {transaction.type}</div>
            <div>Block Hash: {transaction.blockHash}</div>
            <div>From: {transaction.from}</div>
            {/* Add more attributes as needed */}
            <br />
          </li>
        ))}
        <br />
      </ul>

      {selectedTxHash && (
        <TransactionDetails
          txHash={selectedTxHash}
          onClose={closeTransactionInfo}
        />
      )}
    </div>
  )
}

export default App

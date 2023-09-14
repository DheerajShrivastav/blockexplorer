import { Alchemy, Network } from 'alchemy-sdk'
import { useEffect, useState } from 'react'
import TransactionDetails from './components/TransactionDetails'
import './App.css'

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
}

const alchemy = new Alchemy(settings)

function App() {
  const [blockNumber, setBlockNumber] = useState()
  const [response, setResponse] = useState({})
  const [transactions, setTransactions] = useState([])
  const [selectedTxHash, setSelectedTxHash] = useState(null)
  const [isChecked, setIsChecked] = useState(true)

  async function getBlockNumber() {
    isChecked
      ? setBlockNumber(await alchemy.core.getBlockNumber())
      : setBlockNumber(document.getElementById('blockInput').value)
  }

    async function fetchData() {
      const block = await alchemy.core.getBlock(blockNumber)
      setResponse(block)
    }

    async function fetchTransactions() {
      const tx = await alchemy.core.getBlockWithTransactions(blockNumber)
      setTransactions(tx.transactions || [])
    }

    

  async function onSubmit() {
    getBlockNumber()
    fetchData()
    fetchTransactions()
  }
  const openTransactionInfo = (txHash) => {
    setSelectedTxHash(txHash)
  }

  const closeTransactionInfo = () => {
    setSelectedTxHash(null)
  }

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }
  return (
    <div>
      <h1>Enter the Block Number Or Block Hash</h1>
      <input type="text" id="blockInput" />
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
      />
      Fetch current block
      <button onClick={onSubmit}>Submit</button>
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

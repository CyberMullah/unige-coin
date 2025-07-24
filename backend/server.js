require("dotenv").config()
const express = require("express")
const cors = require("cors")
const { ethers } = require("ethers")

const app = express()
const PORT = process.env.PORT || 8000

const abi = [
  "function reward(address to, uint256 amount) external",
]

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet)
const decimals = 18

app.use(cors())
app.use(express.json())

app.post("/api/reward", async (req, res) => {
  const { wallet: studentAddress, amount = 100, questionId } = req.body

  if (!studentAddress || !ethers.isAddress(studentAddress)) {
    return res.status(400).json({ error: "Invalid wallet address" })
  }

  try {
    const rewardAmount = 100;
    const tx = await contract.reward(studentAddress, rewardAmount)
    await tx.wait()

    console.log(`✅ Sent ${rewardAmount} tokens to ${studentAddress} | TX: ${tx.hash}`)
    res.json({ success: true, txHash: tx.hash })
  } catch (err) {
    console.error("❌ Reward failed:", err)
    res.status(500).json({ error: err.message || "Reward failed" })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Reward server running on http://localhost:${PORT}`)
})
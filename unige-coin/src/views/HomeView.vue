<template>
  <div class="mx-auto mt-12 px-4">
    <h1 class="text-3xl font-bold text-center text-blue-900 mb-4">🧠 UniGeCoin Quiz</h1>

    <p class="text-center text-lg text-gray-600 mb-8">
      Solve challenges to earn <span class="text-blue-700 font-semibold">UGC tokens</span>!
    </p>

    <!-- Login Button -->
    <div class="text-center mb-8">
      <button
        v-if="!address"
        @click="connectWallet"
        class="bg-blue-900 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-full transition duration-200"
      >
        🔐 Login with MetaMask
      </button>
    </div>

    <!-- Wallet Info -->
    <div v-if="address" class="bg-gray-100 p-4 rounded-lg shadow mb-6">
      <p class="text-sm text-gray-700"><strong>Wallet:</strong> {{ address }}</p>
      <p class="text-sm text-gray-700 mt-1"><strong>UGC Balance:</strong> {{ ugcBalance }} UGC</p>
    </div>

    <!-- Quiz Section -->
    <div
      v-if="address && currentQuestion < questions.length"
      class="bg-white p-6 rounded-lg shadow-md"
    >
      <p class="text-lg font-semibold text-gray-800 mb-4">
        ❓ {{ questions[currentQuestion].question }}
      </p>

      <div class="space-y-3">
        <label
          v-for="(option, index) in questions[currentQuestion].options"
          :key="index"
          class="flex items-center space-x-2"
        >
          <input
            type="radio"
            :value="option"
            v-model="userAnswer"
            class="accent-blue-900"
            :disabled="isSubmitted"
          />
          <span>{{ option }}</span>
        </label>
      </div>

      <button
        v-if="!isSubmitted"
        @click="submitAnswer"
        class="mt-5 bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-6 rounded-full transition duration-200"
      >
        ✅ Submit Answer
      </button>

      <p
        v-if="isSubmitted"
        class="mt-4 text-sm font-medium"
        :class="isCorrect ? 'text-green-600' : 'text-red-600'"
      >
        {{ feedback }}
      </p>

      <button v-if="isSubmitted" @click="nextQuestion" class="mt-4 text-blue-600 underline text-sm">
        👉 Next Question
      </button>
    </div>

    <!-- Quiz Complete -->
    <div v-else-if="address" class="bg-white p-6 rounded-lg shadow-md text-center">
      <p class="text-xl font-semibold text-green-700">🎉 Quiz completed!</p>
      <p class="text-sm text-gray-600 mt-2">You earned tokens for each correct answer. 🚀</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ethers } from 'ethers'

// Replace with your deployed contract address
const CYM_ADDRESS = '0x13dC4Ce1b74B8B860e35068FcDfCD8d7172D07E1'

const CYM_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function reward(address to, uint256 amount) external',
]

// Questions array
const questions = ref([
  {
    question: 'What is the course that Prof. Ribaudo and Prof. Cerioli teach together?',
    options: ['Capstone Project', 'SSDM'],
    answer: 'Capstone Project',
  },
  {
    question: 'SSDM Course is how much CFU?',
    options: ['9', '6'],
    answer: '9',
  },
  {
    question: 'What is 6 x 2?',
    options: ['12', '14'],
    answer: '12',
  },
])

const address = ref(null)
const ugcBalance = ref(null)
const userAnswer = ref('')
const status = ref('')
const currentQuestion = ref(0)
const isSubmitted = ref(false)
const isCorrect = ref(false)
const feedback = ref('')
let signer = null
let contract = null

async function connectWallet() {
  if (!window.ethereum) {
    return alert('Please install MetaMask')
  }

  const provider = new ethers.BrowserProvider(window.ethereum)
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })

  address.value = accounts[0]
  signer = await provider.getSigner()
  contract = new ethers.Contract(CYM_ADDRESS, CYM_ABI, signer)

  await loadBalance()
}

async function loadBalance() {
  const raw = await contract.balanceOf(address.value)
  const decimals = await contract.decimals()
  ugcBalance.value = ethers.formatUnits(raw, decimals)
}

async function submitAnswer() {
  isSubmitted.value = true
  const correct = questions.value[currentQuestion.value].answer
  isCorrect.value = userAnswer.value === correct

  if (isCorrect.value) {
    feedback.value = '✅ Correct! You earned 100 UGC!'
    try {
      const tx = await contract.reward(address.value, 100)
      await tx.wait()
      await loadBalance()
    } catch (err) {
      feedback.value = '⚠️ Error while rewarding: ' + err.message
    }
  } else {
    feedback.value = '❌ Incorrect. No reward for this one.'
  }
}

function nextQuestion() {
  currentQuestion.value++
  userAnswer.value = ''
  isSubmitted.value = false
  isCorrect.value = false
  feedback.value = ''
}
</script>

# Unige Coin

The project is about to give rewards to students after solving a quiz. Each correct answer will give them 100 Unige Coins. The Unige Coin is an ERC20 token that can be used to reward students.

```
function reward(address to, uint256 amount) external onlyOwner {
    _mint(to, amount * 10 ** decimals());
}
```

The project is consist of two directories:

- `unige_coin`: This directory contains the main code for the Unige Coin application.
- `contract`: This directory contains smart contracts and related files for the Unige Coin project.

Useful commands:

- `npx hardhat clean`: Clean the build artifacts.
- `npx hardhat compile`: Compile the smart contracts.
- `npx hardhat run scripts/deploy.js --network sepolia`: Deploy the smart contracts to the Sepolia test network.
- `npx hardhat verify --network sepolia 0x13dC4Ce1b74B8B860e35068FcDfCD8d7172D07E1 2000`: Verify the deployed contract on Etherscan.

The hardhat console:

```
npx hardhat console --network sepolia
 
# check the balance of an address

> const contract = await ethers.getContractAt("UnigeCoin", "0x13dC4Ce1b74B8B860e35068FcDfCD8d7172D07E1")
> await contract.balanceOf("0xYourAddress")

# transfer tokens to an address
> await contract.reward("0xRecipientAddress", 1000)
```

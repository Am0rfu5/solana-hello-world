# Solana Hello World

This is the intro to Solana for a course on security for Rust Smart Contracts. It also serves 
as a quickstart for Solana (Anchor) projects with a minimum of explanatory instructions.

It should be useful for understand the basics of Solana Smart Contract programming
or for a quick reference in setting up a new dev environment and a new project along with
tests using Mocha.

## References and Resources

- [Solana](https://solana.com/)
- [Anchor](https://anchor-lang.com)
- [Solana Playground](https://beta.solpg.io/)
- 

## Prerequisites

- Rust
- Node.js (npm) requirements
    - mocha
    - yarn
- Solana CLI
- Anchor-CLI
- VS Code with the following plugins:
  - Rust
- Phantom Wallet
- Alchedmy API Key

## Setup

### Install Phantom Wallet

Install the Phantom Wallet from the Chrome Web Store.

### Create Alchemy API Key

Create an account at [Alchemy](https://www.alchemy.com/) and get an API key.

### Install Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

#### Add Rust to Path

Copy this to `.bashrc` or `.zshrc`

```bash
export PATH="$HOME/.cargo/bin:$PATH"
```

### Install Solana & Anchor-CLI

Install Solana:

```bash
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
```

Add the Solana CLI to the path in `.bashrc` or `.zshrc`:

```bash
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
```

Set the Solana RPC URL from Alchemy with the API key. Replace `<YOUR-API-KEY>` with your API key.

```bash
solana config set --url https://solana-devnet.g.alchemy.com/v2/<YOUR-API-KEY>
```

Get a Solana blockchain address:

```bash
solana-keygen new
```

Be sure to save your recovery phrase in a secure location like a password manager.

See the address:

```bash
solana address
```

Airdrop some SOL to the address on devnet and verify the balance is not zero:

```bash
solana airdrop 10
solana balance
```

Install Rust Solana and Anchor-CLI dependencies. (NOTE: This may take a while):

```bash
cargo install anchor-cli
cargo install solana
```

### Create a Project Using Anchor

```bash
anchor init solana-hello-world
cd solana-hello-world
```

## The Hello-World Program

Our program stores a message on the Solana blockchain.

### The Program Code

The program in `programs/solana-hello-world/src/lib.rs` contains notes that give explanation 
of basic functionality in a rust program.

To build the smart contract:

```bash
anchor build
```

This will create a binary in the `target/deploy` directory. 

Note: the public key `declare_id!()` value is supplied by anchor as part of the initialization of the project. 

Before we can deploy the contract to the Solana devnet we need to update values in `Anchor.toml`.
Replace `YOUR-PROGRAM-ID` with the value from the `declare_id!()` macro in the `lib.rs` file.

```bash
[programs.devnet]
solana_hello_world = "YOUR-PROGRAM-ID"
...
...
...
[provider]
cluster = "devnet"
```

Now deploy it to the Solana devnet:

```bash
anchor deploy --provider.cluster https://
```

### The Test

Test resides in the tests directory. To run them use:

```bash
anchor test --provider.cluster https://solana-devnet.g.alchemy.com/v2/<YOUR-API-KEY>
```

## Create Web3 app using Next.js

```bash
yarn create next-app --typescript app
```

```bash
cd app
yarn add @project-serum/anchor @solana/web3.js @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @solana/wallet-adapter-base
```

```bash
yarn dev
```

For files added and modified see the git log.

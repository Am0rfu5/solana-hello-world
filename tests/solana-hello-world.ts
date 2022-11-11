// Import necessary modules and types from Anchor and the standard Node.js assertion library.
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolanaHelloWorld } from "../target/types/solana_hello_world";
import * as assert from "assert";

// Describe block defines a test suite for the "solana-hello-world" program.
describe("solana-hello-world", () => {
  // Initialize the provider from the environment (usually defined in Anchor.toml and .env files).
  const provider = anchor.AnchorProvider.env();
  // Set the global provider for Anchor. This is used for blockchain interactions.
  anchor.setProvider(provider);

  // Initialize the program variable to interact with your Solana program using Anchor's workspace.
  const program = anchor.workspace.SolanaHelloWorld as Program<SolanaHelloWorld>;

  // Test case for creating a message on the Solana blockchain using the smart contract.
  it("Can create a message", async () => {
    // Generate a new keypair for the message account. This is a temporary account to store the message data.
    const message = anchor.web3.Keypair.generate();
    const messageContent = "Hello World!";
    // Invoke the createMessage function of the smart contract with the new message content.
    await program.rpc.createMessage(messageContent, {
      accounts: {
        // Specify the accounts required by the createMessage function.
        message: message.publicKey,
        author: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      // Include the message account keypair in the signers array to authorize the transaction.
      signers: [message],
    });

    // Fetch the newly created message account from the blockchain.
    const messageAccount = await program.account.message.fetch(
      message.publicKey
    );

    // Assert that the message account's author matches the provider's wallet public key.
    assert.equal(
      messageAccount.author.toBase58(),
      provider.wallet.publicKey.toBase58()
    );
    // Assert that the message content is as expected.
    assert.equal(messageAccount.content, messageContent);
    // Assert that the timestamp is set, indicating a successful write operation.
    assert.ok(messageAccount.timestamp);
  });

  // Test case for creating and then updating a message on the Solana blockchain.
  it("Can create and then update a message", async () => {
    // Similar setup to the previous test, creating a new message.
    const message = anchor.web3.Keypair.generate();
    const messageContent = "Hello World!";
    await program.rpc.createMessage(messageContent, {
      accounts: {
        message: message.publicKey,
        author: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [message],
    });

    // Define a new content string for the update operation.
    const updatedMessageContent = "Solana is cool!";
    // Invoke the updateMessage function of the smart contract to change the message content.
    await program.rpc.updateMessage(updatedMessageContent, {
      accounts: {
        message: message.publicKey,
        author: provider.wallet.publicKey,
      },
      // No additional signers are needed here besides the transaction fee payer, which is the provider's wallet by default.
    });

    // Fetch the updated message account from the blockchain.
    const messageAccount = await program.account.message.fetch(
      message.publicKey
    );

    // Assert checks to verify the update operation was successful.
    assert.equal(
      messageAccount.author.toBase58(),
      provider.wallet.publicKey.toBase58()
    );
    // Ensure the message content has been updated and is not equal to the initial content.
    assert.notEqual(messageAccount.content, messageContent);
    assert.equal(messageAccount.content, updatedMessageContent);
    // Verify that a timestamp exists, implying a successful update operation.
    assert.ok(messageAccount.timestamp);
  });
});

// Import necessary modules from the anchor_lang crate to work with Solana smart contracts
use anchor_lang::prelude::*;

// Declare the unique identifier for this smart contract on the Solana blockchain
declare_id!("8LyUD5qQzYLBYPVa4JYBm4GapUffLg9MGfQuJwCEQWtR");

// The `#[account]` macro is used to define a custom account type. In Solana, accounts can hold data and SOL (the native cryptocurrency).
// This contrasts with Solidity's storage variables, which are directly declared in the contract.
#[account]
pub struct Message {
    // Public key of the message's author
    pub author: Pubkey,
    // Unix timestamp indicating when the message was created or updated
    pub timestamp: i64,
    // The content of the message
    pub content: String,
}

// The `#[derive(Accounts)]` macro sets up the accounts context for a given smart contract method.
// It specifies the accounts that must be passed to the method, their roles, and any constraints on them.
#[derive(Accounts)]
pub struct CreateMessage<'info> {
    // `#[account]` here specifies that the `message` account should be initialized by this instruction,
    // the `payer` argument specifies which account will pay for the account's creation,
    // and `space` specifies how much space to allocate for the account, in bytes.
    #[account(init, payer = author, space = 1000)]
    pub message: Account<'info, Message>,
    // Specifies that the `author` account must sign the transaction and allows mutations (marked by `mut`).
    #[account(mut)]
    pub author: Signer<'info>,
    // Includes the system program in the account context, allowing the contract to interact with basic Solana functionalities.
    pub system_program: Program<'info, System>,
}

// Similar to `CreateMessage`, this struct sets up the accounts context for updating a message.
#[derive(Accounts)]
pub struct UpdateMessage<'info> {
    // The `message` account is mutable, indicating it will be updated.
    #[account(mut)]
    pub message: Account<'info, Message>,
    // The `author` must sign the transaction; it's also mutable to potentially update account state.
    #[account(mut)]
    pub author: Signer<'info>,
}
  
// The `#[program]` macro marks the main logic of the smart contract.
#[program]
pub mod solana_hello_world {
    use super::*;

    // Function to create a new message.
    // `Context<CreateMessage>` encapsulates the accounts needed for this instruction.
    pub fn create_message(ctx: Context<CreateMessage>, content: String) -> Result<()> {
        let message: &mut Account<Message> = &mut ctx.accounts.message;
        let author: &Signer = &ctx.accounts.author;
        // Retrieves the current Solana cluster time.
        let clock: Clock = Clock::get().unwrap();
    
        // Sets the message's author, timestamp, and content.
        message.author = *author.key;
        message.timestamp = clock.unix_timestamp;
        message.content = content;
    
        // Indicates successful execution of the instruction.
        Ok(())
    }
    
    // Function to update an existing message, similar to `create_message`.
    pub fn update_message(ctx: Context<UpdateMessage>, content: String) -> Result<()> {
        let message: &mut Account<Message> = &mut ctx.accounts.message;
        let author: &Signer = &ctx.accounts.author;
        // Retrieves the current Solana cluster time.
        let clock: Clock = Clock::get().unwrap();
        
        // Updates the message's author, timestamp, and content.
        message.author = *author.key;
        message.timestamp = clock.unix_timestamp;
        message.content = content;
        
        // Indicates successful execution of the instruction.
        Ok(())
    }
}  

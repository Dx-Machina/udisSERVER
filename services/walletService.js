//====================================================================================
// Wallet Service
//====================================================================================
const Wallet = require('../models/Wallet');
const { getUser } = require('./userService');
const { generateQRCode } = require('../utils/qrCodeGenerator');

/**
 * Fetches or creates a wallet for a user.
 * @param {Object} query - Query to find the user (e.g., { udisId }).
 * @returns {Object} The wallet object.
 */

// Fetch wallet
const getWallet = async (query) => {
  try {
    console.log(`[walletService][getWallet]: Fetching wallet: ${JSON.stringify(query)}`);

    let searchQuery = {};
    if (query.udisId) {
      searchQuery = { user: query.udisId };
    } else if (query.email) {
      searchQuery = { email: query.email };
    } else {
      throw new Error('[walletService][getWallet]: Invalid query: Must provide either udisId or email', query);
    }
    const wallet = await Wallet.findOne(searchQuery);
    if (wallet) {
      console.log('[walletService][getWallet]: Wallet found:', wallet);
      return wallet;
    }
    console.log('[walletService][getWallet]: No wallet found for query:', query);
    return null;
  } catch (error) {
    console.error('[walletService][getWallet]: Error in getWallet:', error.message);
    throw new Error(error.message);
  }
};

// Create wallet
const createWallet = async ({ udisId, name, email }) => {
  try {
    console.log('[walletService][createWallet] Creating wallet for user:', { udisId, name, email });
    const newWallet = new Wallet({
      user: udisId,
      name,
      email,
      balance: 1000,
      transactions: [],
    });

    await newWallet.save();
    console.log('[walletService][createWallet]: Wallet created:', newWallet);
    return newWallet;
  } catch (error) {
    console.error('[walletService][createWallet]: Error creating wallet:', error.message);
    throw new Error(error.message);
  }
};

/**
 * Processes a transaction between two wallets.
 * @param {String} senderUdisId - UDIS ID of the sender.
 * @param {String} recipientUdisId - UDIS ID of the recipient.
 * @param {Number} amount - Amount to transfer.
 * @returns {Object} Success message or throws an error.
 */
const sendMoney = async ({ senderUdisId, recipientQuery, amount, description }) => {
  try {
    console.log(`[walletService][sendMoney]: Sending ${amount} from ${senderUdisId} to recipient query:`, recipientQuery);

    // Fetch sender's wallet using their UDIS ID
    const senderWallet = await getWallet({ udisId: senderUdisId });
    if (!senderWallet) {
      console.log(`[walletService][sendMoney]: Sender wallet not found for UDIS ID: ${senderUdisId}`);
      throw new Error(`[walletService][sendMoney]: Sender wallet not found for UDIS ID: ${senderUdisId}`);
    }

    // Fetch recipient's wallet using either udisId or email
    const recipientWallet = await getWallet(recipientQuery);
    if (!recipientWallet) {
      console.log(`[walletService][sendMoney]: Recipient wallet not found for query:`, recipientQuery);
      throw new Error(`[walletService][sendMoney]: Recipient wallet not found for query: ${JSON.stringify(recipientQuery)}`);
    }

    // Check sender's balance
    if (senderWallet.balance < amount) {
      throw new Error(`[walletService][sendMoney]: Insufficient balance in sender's wallet`);
    }

    // Perform the transaction
    senderWallet.balance -= amount;
    recipientWallet.balance += amount;

    const transaction = {
      type: 'OUT',
      amount,
      to: recipientWallet.user,
      from: senderUdisId,
      date: new Date(),
      description: description || 'No description provided',
    };

    senderWallet.transactions.push(transaction);

    const recipientTransaction = {
      ...transaction,
      type: 'IN',
    };

    recipientWallet.transactions.push(recipientTransaction);

    await senderWallet.save();
    await recipientWallet.save();

    console.log(`[walletService][sendMoney]: Transaction of ${amount} from ${senderWallet.name} to ${recipientWallet.name} successful. description: ${description}`);
    return { message: 'Transaction successful' };
  } catch (error) {
    console.error('[walletService][sendMoney]: Error during transaction:', error.message);
    throw new Error(error.message);
  }
};

/**
 * Generates a QR code for a wallet.
 * @param {String} walletId - Wallet ID to encode in the QR code.
 * @returns {String} QR code as a data URL.
 */
const generateWalletQRCode = async (walletId) => {
  return await generateQRCode(walletId.toString());
};

module.exports = { getWallet, createWallet, sendMoney, generateWalletQRCode };
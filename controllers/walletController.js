const { getWallet, sendMoney, generateWalletQRCode } = require('../services/walletService');

// Fetch wallet details for the authenticated user
exports.getWalletDetails = async (req, res) => {
  try {
    console.log(`[walletController][getWalletDetails]: Fetching wallet for user: ${req.user.udisId}`);
    const wallet = await getWallet({ udisId: req.user.udisId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    res.status(200).json(wallet);
  } catch (error) {
    console.error("[walletController][getWalletDetails]: Error:", error.message);
    res.status(500).json({ message: "Failed to fetch wallet details", error: error.message });
  }
};


exports.sendMoney = async (req, res) => {
  const { recipientId, amount, description } = req.body;

  try {
    console.log(`[walletController][sendMoney]: ${req.user.name} Sending ${amount} to ${recipientId}`);

    const recipientQuery = recipientId.includes('@')
      ? { email: recipientId } // If it contains '@', treat as email
      : { udisId: recipientId }; // Otherwise, treat as UDIS ID

    const result = await sendMoney({
      senderUdisId: req.user.udisId,
      recipientQuery,
      amount,
      description,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('[walletController][sendMoney]: Error during transaction:', error.message);
    res.status(400).json({ message: error.message });
  }
};

exports.generateWalletQRCode = async (req, res) => {
  try {
    const wallet = await getWallet({ udisId: req.user.udisId });
    const qrCode = await generateWalletQRCode(wallet._id);
    res.status(200).json({ qrCode });
  } catch (error) {
    res.status(500).json({ message: '[walletController][generateWalletQRCode]: Error generating QR code', error: error.message });
  }
};
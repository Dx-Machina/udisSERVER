const validateTransaction = (req, res, next) => {
    const { amount, recipientId } = req.body;
  
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: '[walletMIddleware] Invalid transaction amount' });
    }
  
    if (!recipientId) {
      return res.status(400).json({ message: '[walletMIddleware] Recipient ID is required' });
    }
  
    next();
  };
  
  module.exports = { validateTransaction };
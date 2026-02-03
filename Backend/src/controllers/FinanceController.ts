import { Transaction } from '../models/Transaction';

export const getTransactions = async (req: any, res: any) => {
  try {
    const transactions = await Transaction.findAll({
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
};

export const createTransaction = async (req: any, res: any) => {
  try {
    const { title, amount, type, date, category } = req.body;
    const transaction = await Transaction.create({
      title,
      amount,
      type,
      date,
      category
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: 'Error creating transaction', error });
  }
};

export const deleteTransaction = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findByPk(id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    await transaction.destroy();
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting transaction', error });
  }
};
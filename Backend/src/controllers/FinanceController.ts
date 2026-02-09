import { Transaction } from '../models/Transaction';

export const getTransactions = async (req: any, res: any) => {
  try {
    const transactions = await Transaction.findAll({
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    console.error("❌ FETCH TRANSACTIONS ERROR:", error);
    res.status(500).json({ message: 'Gagal mengambil data transaksi.' });
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
    console.error("❌ CREATE TRANSACTION ERROR:", error);
    res.status(500).json({ message: 'Gagal membuat transaksi.' });
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
    console.error("❌ DELETE TRANSACTION ERROR:", error);
    res.status(500).json({ message: 'Gagal menghapus transaksi.' });
  }
};
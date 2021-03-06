import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import multer from 'multer';
import TransactionsRepository from '../repositories/TransactionsRepository';

import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactiontotal = {
    transactions: await transactionsRepository.find(),
    BalanceCreditPaymentMethods: await transactionsRepository.getBalanceCreditPaymentMethods(),
    BalanceDebitPaymentMethods: await transactionsRepository.getBalanceDebitPaymentMethods(),
    balance: await transactionsRepository.getBalance(),
  };

  return response.json(transactiontotal);
});

transactionsRouter.post('/', async (request, response) => {
  const {
    company_id,
    payment_type,
    transaction_date,
    transaction_expiration,
    title,
    value,
    type,
    category,
  } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    company_id,
    payment_type,
    transaction_date,
    transaction_expiration,
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute(id);

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactions = new ImportTransactionsService();

    const transactions = await importTransactions.execute(request.file.path);

    return response.json(transactions);
  },
);

export default transactionsRouter;

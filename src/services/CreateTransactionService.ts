import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  company_id: string;
  payment_type: string;
  transaction_date: Date;
  transaction_expiration: Date;
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

export class CreateTransactionService {
  public async execute({
    company_id,
    payment_type,
    transaction_date,
    transaction_expiration,
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const { total } = await transactionsRepository.getBalance();

      if (total < value) {
        throw new AppError('No balance to include new outcome', 400);
      }
    }

    const checkCategoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    let categoryId;

    if (!checkCategoryExists) {
      const categoryNew = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(categoryNew);

      categoryId = categoryNew.id;
    } else {
      categoryId = checkCategoryExists.id;
    }

    const transaction = transactionsRepository.create({
      company_id,
      payment_type,
      transaction_date,
      transaction_expiration,
      title,
      value,
      type,
      category_id: categoryId,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

import { getCustomRepository, getRepository, In } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Company from '../models/Company';
import Category from '../models/Category';

import TransactionRepository from '../repositories/TransactionsRepository';

interface CSVTransaction {
  company_id: string;
  payment_type: string;
  transaction_date: Date;
  transaction_expiration: Date;
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

export class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoriesRepository = getRepository(Category);
    const companiesRepository = getRepository(Company);

    const contactsReadStream = fs.createReadStream(filePath);

    const parses = csvParse({
      from_line: 2,
    });

    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];
    const companies: string[] = [];

    const parseCSV = contactsReadStream.pipe(parses);

    parseCSV.on('data', async line => {
      const [
        company_id,
        payment_type,
        transaction_date,
        transaction_expiration,
        title,
        type,
        value,
        category,
      ] = line.map((cell: string) => cell.trim());

      if (!title || !type || !value) return;

      categories.push(category);

      transactions.push({
        company_id,
        payment_type,
        transaction_date,
        transaction_expiration,
        title,
        type,
        value,
        category,
      });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });

    const existentCompanies = await companiesRepository.find({
      where: {
        company_id: In(companies),
      },
    });

    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => category.title,
    );

    const existentCompaniesIds = existentCompanies.map(
      (company: Company) => company.id,
    );

    if (!existentCompaniesIds) {
      throw new AppError('Company id does not exist');
    }

    const addCategoryTitles = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoryTitles.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories];

    const createdTransactions = transactionRepository.create(
      transactions.map(transaction => ({
        company_id: transaction.company_id,
        payment_type: transaction.payment_type,
        transaction_date: transaction.transaction_date,
        transaction_expiration: transaction.transaction_expiration,
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionRepository.save(createdTransactions);

    await fs.promises.unlink(filePath);

    return createdTransactions;
  }
}

export default ImportTransactionsService;

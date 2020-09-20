import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  recipe: number;
  expense: number;
  total: number;
}

interface BalancePaymentMethod {
  Dinheiro: number;
  Cheque: number;
  Cheque_pre: number;
  Cheque_terc: number;
  Prazo: number;
  Tef: number;
  Pos: number;
  Ticket: number;
  Convenio: number;
  Contravale: number;
  Outros: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { recipe, expense } = transactions.reduce(
      (accumulator, transaction) => {
        switch (transaction.type) {
          case 'recipe':
            accumulator.recipe += Number(transaction.value);
            break;

          case 'expense':
            accumulator.expense += Number(transaction.value);
            break;

          default:
            break;
        }

        return accumulator;
      },
      {
        recipe: 0,
        expense: 0,
        total: 0,
      },
    );

    const total = recipe - expense;

    return { recipe, expense, total };
  }

  public async getBalanceCreditPaymentMethods(): Promise<BalancePaymentMethod> {
    const transactions = await this.find();

    const {
      Dinheiro,
      Cheque,
      Cheque_pre,
      Cheque_terc,
      Prazo,
      Tef,
      Pos,
      Convenio,
      Ticket,
      Contravale,
      Outros,
    } = transactions.reduce(
      (accumulatorPayment, transaction) => {
        switch (`${transaction.payment_type}-${transaction.type}`) {
          case 'Dinheiro-recipe':
            accumulatorPayment.Dinheiro += Number(transaction.value);
            break;

          case 'Cheque-recipe':
            accumulatorPayment.Cheque += Number(transaction.value);
            break;

          case 'Cheque_pre-recipe':
            accumulatorPayment.Cheque_pre += Number(transaction.value);
            break;

          case 'Cheque_terc-recipe':
            accumulatorPayment.Cheque_terc += Number(transaction.value);
            break;

          case 'Prazo-recipe':
            accumulatorPayment.Prazo += Number(transaction.value);
            break;

          case 'Tef-recipe':
            accumulatorPayment.Tef += Number(transaction.value);
            break;

          case 'Pos-recipe':
            accumulatorPayment.Pos += Number(transaction.value);
            break;

          case 'Ticket-recipe':
            accumulatorPayment.Ticket += Number(transaction.value);
            break;

          case 'Convenio-recipe':
            accumulatorPayment.Convenio += Number(transaction.value);
            break;

          case 'Contravale-recipe':
            accumulatorPayment.Contravale += Number(transaction.value);
            break;

          case 'Outros-recipe':
            accumulatorPayment.Outros += Number(transaction.value);
            break;

          default:
            break;
        }

        return accumulatorPayment;
      },

      {
        Dinheiro: 0,
        Cheque: 0,
        Cheque_pre: 0,
        Cheque_terc: 0,
        Prazo: 0,
        Tef: 0,
        Pos: 0,
        Convenio: 0,
        Ticket: 0,
        Contravale: 0,
        Outros: 0,
      },
    );

    return {
      Dinheiro,
      Cheque,
      Cheque_pre,
      Cheque_terc,
      Prazo,
      Tef,
      Pos,
      Convenio,
      Ticket,
      Contravale,
      Outros,
    };
  }

  public async getBalanceDebitPaymentMethods(): Promise<BalancePaymentMethod> {
    const transactions = await this.find();

    const {
      Dinheiro,
      Cheque,
      Cheque_pre,
      Cheque_terc,
      Prazo,
      Tef,
      Pos,
      Convenio,
      Ticket,
      Contravale,
      Outros,
    } = transactions.reduce(
      (accumulatorPayment, transaction) => {
        switch (`${transaction.payment_type}-${transaction.type}`) {
          case 'Dinheiro-expense':
            accumulatorPayment.Dinheiro += Number(transaction.value);
            break;

          case 'Cheque-expense':
            accumulatorPayment.Cheque += Number(transaction.value);
            break;

          case 'Cheque_pre-expense':
            accumulatorPayment.Cheque_pre += Number(transaction.value);
            break;

          case 'Cheque_terc-expense':
            accumulatorPayment.Cheque_terc += Number(transaction.value);
            break;

          case 'Prazo-expense':
            accumulatorPayment.Prazo += Number(transaction.value);
            break;

          case 'Tef-expense':
            accumulatorPayment.Tef += Number(transaction.value);
            break;

          case 'Pos-expense':
            accumulatorPayment.Pos += Number(transaction.value);
            break;

          case 'Ticket-expense':
            accumulatorPayment.Ticket += Number(transaction.value);
            break;

          case 'Convenio-expense':
            accumulatorPayment.Convenio += Number(transaction.value);
            break;

          case 'Contravale-expense':
            accumulatorPayment.Contravale += Number(transaction.value);
            break;

          case 'Outros-expense':
            accumulatorPayment.Outros += Number(transaction.value);
            break;

          default:
            break;
        }

        return accumulatorPayment;
      },

      {
        Dinheiro: 0,
        Cheque: 0,
        Cheque_pre: 0,
        Cheque_terc: 0,
        Prazo: 0,
        Tef: 0,
        Pos: 0,
        Convenio: 0,
        Ticket: 0,
        Contravale: 0,
        Outros: 0,
      },
    );

    return {
      Dinheiro,
      Cheque,
      Cheque_pre,
      Cheque_terc,
      Prazo,
      Tef,
      Pos,
      Convenio,
      Ticket,
      Contravale,
      Outros,
    };
  }
}

export default TransactionsRepository;

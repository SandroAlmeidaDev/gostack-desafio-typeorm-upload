import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import Category from './Category';
import Company from './Company';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Category, category => category.transaction, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Company, company => company.transaction, { eager: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column()
  title: string;

  @Column()
  type: 'income' | 'outcome';

  @Column('decimal')
  value: number;

  @Column()
  category_id: string;

  @Column()
  company_id: string;

  @Column()
  payment_type: string;

  @Column('timestamp with time zone')
  transaction_date: Date;

  @Column('timestamp with time zone')
  transaction_expiration: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;

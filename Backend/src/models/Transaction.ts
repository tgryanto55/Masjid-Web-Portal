import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'transactions',
  timestamps: true,
})
export class Transaction extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.DECIMAL(15, 2), 
    allowNull: false,
  })
  amount!: number;

  @Column({
    type: DataType.ENUM('income', 'expense'),
    allowNull: false,
  })
  type!: 'income' | 'expense';

  @Column({
    type: DataType.DATEONLY,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  date!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  category!: string;
}
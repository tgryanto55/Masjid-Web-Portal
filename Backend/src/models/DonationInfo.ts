import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'donation_infos',
  timestamps: true,
})
export class DonationInfo extends Model<DonationInfo> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  bankName!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  accountNumber!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  accountName!: string;

  @Column({

    type: DataType.TEXT('long'),
    allowNull: true,
  })
  qrisImage!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  confirmationPhone!: string;
}
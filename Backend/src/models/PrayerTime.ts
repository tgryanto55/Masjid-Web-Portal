import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'prayer_times',
  timestamps: true 
})
export class PrayerTime extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  time!: string;
}

import { Table, Column, Model, DataType, Index } from 'sequelize-typescript';

@Table({
  tableName: 'events',
  timestamps: true,
})
export class Event extends Model<Event> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Index
  @Column({
    type: DataType.STRING, // Changed to STRING to allow "Setiap Ahad", etc.
    allowNull: false,
  })
  date!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  time!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image?: string;
}
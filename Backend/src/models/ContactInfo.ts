import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'contact_infos',
  timestamps: true,
})
export class ContactInfo extends Model {
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  address!: string;

  @Column({
    type: DataType.TEXT, 
    allowNull: true,
  })
  mapEmbedLink!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  operationalHours!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  facebook!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  instagram!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  youtube!: string;
}
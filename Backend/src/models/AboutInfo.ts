import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
    tableName: 'about_infos',
    timestamps: true,
})
export class AboutInfo extends Model<AboutInfo> {
    @Column({
        type: DataType.TEXT('long'),
        allowNull: false,
    })
    history!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    vision!: string;

    @Column({
        type: DataType.TEXT,
        allowNull: false,
    })
    mission!: string;

    @Column({
        type: DataType.TEXT('long'),
        allowNull: true,
    })
    image!: string;
}

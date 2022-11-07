import { DataTypes, Model } from 'sequelize';
import sequelizeConnection from '../db.config';

class Task extends Model {
  declare id?: number;
  declare url: string;
  declare time: Date;
  declare success?: boolean;
}

export async function initTaskModel() {
  Task.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      success: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
      sequelize: sequelizeConnection,
      paranoid: true,
    }
  );
}

export default Task;

import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/db.js';

interface PostAttributes {
  id: number;
  title: string;
  content: string;
  classes_fk: number;
  users_fk: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface PostCreationAttributes
  extends Optional<
    PostAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

class Post
  extends Model<PostAttributes, PostCreationAttributes>
  implements PostAttributes
{
  public id!: number;
  public title!: string;
  public content!: string;
  public classes_fk!: number;
  public users_fk!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    classes_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    users_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'posts',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deletedAt',
    sequelize,
  }
);

export { Post, PostAttributes, PostCreationAttributes };

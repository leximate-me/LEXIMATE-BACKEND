import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/db';

interface CommentAttributes {
  id: number;
  content: string;
  posts_fk: number;
  users_fk: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

interface CommentCreationAttributes
  extends Optional<
    CommentAttributes,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
  > {}

class Comment
  extends Model<CommentAttributes, CommentCreationAttributes>
  implements CommentAttributes
{
  public id!: number;
  public content!: string;
  public posts_fk!: number;
  public users_fk!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    posts_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    users_fk: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'comments',
    timestamps: true,
    paranoid: true,
    deletedAt: 'deletedAt',
    sequelize,
  }
);

export { Comment, CommentAttributes, CommentCreationAttributes };

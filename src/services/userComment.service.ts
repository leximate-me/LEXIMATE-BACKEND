import { Post } from '../models/post.model.js';
import { Comment } from '../models/comment.model.js';
import { User } from '../models/user.model.js';
import { UserClass } from '../models/userClass.model.js';
import { sequelize } from '../database/db.js';
import { Role } from '../models/role.model.js';
import { RolePermission } from '../models/rolePermission.model.js';

interface CommentData {
  content: string;
}

interface UserData {
  id: number;
  rol: number;
  verify: boolean;
}

const createCommentService = async (
  commentData: CommentData,
  postId: number,
  user: UserData
) => {
  const transaction = await sequelize.transaction();
  try {
    if (!commentData || !postId || !user) {
      throw new Error('Datos no proporcionados');
    }

    const { content } = commentData;

    const existingPost = await Post.findOne({
      where: { id: postId },
      transaction,
    });

    if (!existingPost) {
      throw new Error('Publicación no encontrada');
    }

    const foundUser = await User.findOne({
      where: { id: user.id },
      transaction,
    });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    const existingUserInClass = await UserClass.findOne({
      where: {
        users_fk: foundUser.id,
        classes_fk: existingPost.classes_fk,
      },
      transaction,
    });

    if (!existingUserInClass) {
      throw new Error('El usuario no pertenece a la clase');
    }

    const verifiedRole = await Role.findOne({
      where: { id: foundUser.roles_fk },
      transaction,
    });

    if (!verifiedRole) {
      throw new Error('Rol no encontrado');
    }

    const verifiedPermission = await RolePermission.findOne({
      where: { roles_fk: foundUser.roles_fk, permissions_fk: 3 },
      transaction,
    });

    if (!verifiedPermission) {
      throw new Error('No tiene permisos para crear un comentario');
    }

    const comment = await Comment.create(
      {
        content,
        posts_fk: existingPost.id,
        users_fk: foundUser.id,
      },
      { transaction }
    );

    await transaction.commit();
    return comment;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export { createCommentService };
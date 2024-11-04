import { Post } from '../models/post.model';
import { Comment } from '../models/comment.model';
import { User } from '../models/user.model';
import { UserClass } from '../models/userClass.model';
import { sequelize } from '../database/db';
// import { Role } from '../models/role.model';
// import { RolePermission } from '../models/rolePermission.model';

const createCommentService = async (
  commentData: Comment,
  postId: number,
  userId: number
) => {
  const transaction = await sequelize.transaction();

  try {
    const { content } = commentData;

    const existingPost = await Post.findOne({
      where: { id: postId },
      transaction,
    });

    if (!existingPost) {
      throw new Error('Publicación no encontrada');
    }

    const foundUser = await User.findOne({
      where: { id: userId },
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

    const existingPostInClass = await Post.findOne({
      where: { id: postId, classes_fk: existingPost.classes_fk },
      transaction,
    });

    if (!existingPostInClass) {
      throw new Error('La publicación no pertenece a la clase');
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

const readCommentsService = async (postId: number) => {
  const transaction = await sequelize.transaction();
  try {
    const existingPost = await Post.findOne({
      where: { id: postId },
      transaction,
    });

    if (!existingPost) {
      throw new Error('Publicación no encontrada');
    }

    const comments = await Comment.findAll({
      where: { posts_fk: existingPost.id },
      include: [
        {
          model: User,
          attributes: ['user_name'],
        },
      ],
      transaction,
    });

    await transaction.commit();

    return comments;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const readCommentService = async (commentId: number) => {
  const transaction = await sequelize.transaction();
  try {
    const existingComment = await Comment.findOne({
      where: { id: commentId },
      transaction,
    });

    if (!existingComment) {
      throw new Error('Comentario no encontrado');
    }

    await transaction.commit();

    return existingComment;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateCommentService = async (
  commentData: Comment,
  commentId: number,
  userId: number
) => {
  const transaction = await sequelize.transaction();

  try {
    const { content } = commentData;

    const existingComment = await Comment.findOne({
      where: { id: commentId },
      transaction,
    });

    if (!existingComment) {
      throw new Error('Comentario no encontrado');
    }

    const foundUser = await User.findOne({
      where: { id: userId },
      transaction,
    });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    if (existingComment.users_fk !== foundUser.id) {
      throw new Error('No tiene permisos para editar este comentario');
    }

    await existingComment.update({ content }, { transaction });

    await transaction.commit();
    return existingComment;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const deleteCommentService = async (commentId: number, userId: number) => {
  const transaction = await sequelize.transaction();

  try {
    const existingComment = await Comment.findOne({
      where: { id: commentId },
      transaction,
    });

    if (!existingComment) {
      throw new Error('Comentario no encontrado');
    }

    const foundUser = await User.findOne({
      where: { id: userId },
      transaction,
    });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    if (existingComment.users_fk !== foundUser.id) {
      throw new Error('No tiene permisos para eliminar este comentario');
    }

    await existingComment.destroy({ transaction });

    await transaction.commit();

    return { message: 'Comentario eliminado exitosamente' };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export {
  createCommentService,
  readCommentsService,
  readCommentService,
  updateCommentService,
  deleteCommentService,
};

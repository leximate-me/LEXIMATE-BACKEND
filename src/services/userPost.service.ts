import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { UserClass } from '../models/userClass.model';
import { Class } from '../models/class.model';
import { RolePermission } from '../models/rolePermission.model';
import { Role } from '../models/role.model';
import { sequelize } from '../database/db';
import { People } from '../models/people.model';

const createPostService = async (
  postData: Post,
  classId: number,
  userId: number
) => {
  const transaction = await sequelize.transaction();

  try {
    const { title, content } = postData;

    const [existingClass, foundUser, existingUserInClass] = await Promise.all([
      Class.findOne({ where: { id: classId }, transaction }),
      User.findOne({ where: { id: userId }, transaction }),
      UserClass.findOne({
        where: { users_fk: userId, classes_fk: classId },
        transaction,
      }),
    ]);

    if (!existingClass) {
      throw new Error('Clase no encontrada');
    }

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    if (!existingUserInClass) {
      throw new Error('El usuario no pertenece a la clase');
    }

    const verifiedPermission = await RolePermission.findOne({
      where: { roles_fk: foundUser.roles_fk, permissions_fk: 1 },
      transaction,
    });

    if (!verifiedPermission) {
      throw new Error('No tiene permisos para crear una publicación');
    }

    const post = await Post.create(
      {
        title,
        content,
        classes_fk: existingUserInClass.classes_fk,
        users_fk: foundUser.id,
      },
      { transaction }
    );

    await transaction.commit();

    return post;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const readPostsService = async (classId: number, userId: number) => {
  const transaction = await sequelize.transaction();

  try {
    const existingClass = await Class.findOne({
      where: { id: classId },
      transaction,
    });

    if (!existingClass) {
      throw new Error('El usuario no pertenece a la clase');
    }

    const foundUser = await User.findOne({
      where: { id: userId },
      transaction,
    });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    const existingUserInClass = await UserClass.findOne({
      where: { users_fk: foundUser.id, classes_fk: existingClass.id },
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
      where: { roles_fk: verifiedRole.id, permissions_fk: 2 },
      transaction,
    });

    if (!verifiedPermission) {
      throw new Error('No tiene permisos para leer publicaciones');
    }

    const posts = await Post.findAll({
      where: { classes_fk: existingUserInClass.classes_fk },
      include: [
        {
          model: User,
          as: 'user',
          include: [
            {
              model: People,
              as: 'people',
            },
          ],
        },
        {
          model: Class,
          as: 'class',
        },
      ],
      transaction,
    });

    await transaction.commit();

    return posts;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updatePostService = async (
  postId: number,
  postData: Post,
  classId: number,
  userId: number
) => {
  const transaction = await sequelize.transaction();

  try {
    const { title, content } = postData;

    const existingClass = await Class.findOne({
      where: { id: classId },
      transaction,
    });

    if (!existingClass) {
      throw new Error('El usuario no pertenece a la clase');
    }

    const foundUser = await User.findOne({
      where: { id: userId },
      transaction,
    });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    const existingUserInClass = await UserClass.findOne({
      where: { users_fk: foundUser.id, classes_fk: existingClass.id },
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
      where: { roles_fk: verifiedRole.id, permissions_fk: 3 },
      transaction,
    });

    if (!verifiedPermission) {
      throw new Error('No tiene permisos para actualizar una publicación');
    }

    const post = await Post.findOne({
      where: {
        id: postId,
        classes_fk: existingUserInClass.classes_fk,
        users_fk: foundUser.id,
      },
      transaction,
    });

    if (!post) {
      throw new Error('Publicación no encontrada');
    }

    post.title = title;
    post.content = content;

    await post.save({ transaction });

    await transaction.commit();

    return post;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const deletePostService = async (
  postId: number,
  classId: number,
  userId: number
) => {
  const transaction = await sequelize.transaction();

  try {
    const foundUser = await User.findOne({
      where: { id: userId },
      transaction,
    });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    const existingClass = await Class.findOne({
      where: { id: classId },
      transaction,
    });

    if (!existingClass) {
      throw new Error('El usuario no pertenece a la clase');
    }

    const existingUserInClass = await UserClass.findOne({
      where: {
        users_fk: foundUser.id,
        classes_fk: existingClass.id,
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
      where: { roles_fk: verifiedRole.id, permissions_fk: 4 },
      transaction,
    });

    if (!verifiedPermission) {
      throw new Error('No tiene permisos para eliminar una publicación');
    }

    const existingPost = await Post.findOne({
      where: { id: postId, classes_fk: existingUserInClass.classes_fk },
      transaction,
    });

    if (!existingPost) {
      throw new Error('Publicación no encontrada');
    }

    if (existingPost.users_fk !== foundUser.id && verifiedRole.id !== 3) {
      throw new Error('No tiene permisos para eliminar esta publicación');
    }

    await existingPost.destroy({ transaction });

    await transaction.commit();

    return { message: 'Publicación eliminada correctamente' };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const readPostService = async (
  userId: number,
  classId: number,
  postId: number
) => {
  const transaction = await sequelize.transaction();

  try {
    const existingClass = await Class.findOne({
      where: { id: classId },
      transaction,
    });

    if (!existingClass) {
      throw new Error('El usuario no pertenece a la clase');
    }

    const foundUser = await User.findOne({
      where: { id: userId },
      transaction,
    });

    if (!foundUser) {
      throw new Error('Usuario no encontrado');
    }

    const existingUserInClass = await UserClass.findOne({
      where: { users_fk: foundUser.id, classes_fk: existingClass.id },
      transaction,
    });

    if (!existingUserInClass) {
      throw new Error('El usuario no pertenece a la clase');
    }

    const verifiedRole = await Role.findOne({
      where: { id: foundUser.roles_fk },
      transaction,
    });

    const verifiedPermission = await RolePermission.findOne({
      where: { roles_fk: verifiedRole?.id, permissions_fk: 2 },
      transaction,
    });

    if (!verifiedPermission) {
      throw new Error('No tiene permisos para leer publicaciones');
    }

    const post = await Post.findOne({
      where: { id: postId, classes_fk: existingUserInClass.classes_fk },
      include: [
        {
          model: User,
          as: 'user',
          include: [
            {
              model: People,
              as: 'people',
            },
          ],
        },
        {
          model: Class,
          as: 'class',
        },
      ],
      transaction,
    });

    if (post === null) {
      throw new Error('No hay publicaciones en esta clase');
    }

    if (!post) {
      throw new Error('Publicación no encontrada');
    }

    await transaction.commit();

    return post;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export {
  createPostService,
  updatePostService,
  readPostService,
  deletePostService,
  readPostsService,
};

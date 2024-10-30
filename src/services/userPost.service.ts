import { Post } from '../models/post.model.js';
import { User } from '../models/user.model.js';
import { UserClass } from '../models/userClass.model.js';
import { Class } from '../models/class.model.js';
import { RolePermission } from '../models/rolePermission.model.js';
import { Role } from '../models/role.model.js';
import { sequelize } from '../database/db.js';

interface PostData {
  title: string;
  content: string;
}

interface UserData {
  id: number;
  rol: number;
  verify: boolean;
}

const createPostService = async (
  postData: PostData,
  classId: number,
  user: UserData
) => {
  const transaction = await sequelize.transaction();
  try {
    if (!postData || !classId) {
      throw new Error('Datos no proporcionados');
    }

    console.log(classId);

    const { title, content } = postData;

    const existingClass = await Class.findOne({
      where: { id: classId },
      transaction,
    });

    if (!existingClass) {
      throw new Error('Clase no encontrada');
    }

    const foundUser = await User.findOne({
      where: { id: user.id },
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
      where: { roles_fk: verifiedRole.id, permissions_fk: 1 },
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
        users_fk: user.id,
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

const readPostsService = async (classId: number, user: UserData) => {
  const transaction = await sequelize.transaction();
  try {
    if (!classId) {
      throw new Error('Datos no proporcionados');
    }

    const existingClass = await Class.findOne({
      where: { id: classId },
      transaction,
    });

    if (!existingClass) {
      throw new Error('El usuario no pertenece a la clase');
    }

    const foundUser = await User.findOne({
      where: { id: user.id },
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
  postData: PostData,
  classId: number,
  user: UserData
) => {
  const transaction = await sequelize.transaction();
  try {
    if (!postData || !classId || !postId) {
      throw new Error('Datos no proporcionados');
    }

    const { title, content } = postData;

    const existingClass = await Class.findOne({
      where: { id: classId },
      transaction,
    });

    if (!existingClass) {
      throw new Error('El usuario no pertenece a la clase');
    }

    const foundUser = await User.findOne({
      where: { id: user.id },
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
        users_fk: user.id,
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
  user: UserData
) => {
  const transaction = await sequelize.transaction();
  try {
    if (!postId || !classId) {
      throw new Error('Datos no proporcionados');
    }

    const existingClass = await Class.findOne({
      where: { id: classId },
      transaction,
    });

    if (!existingClass) {
      throw new Error('El usuario no pertenece a la clase');
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

    const post = await Post.findOne({
      where: { id: postId, classes_fk: existingUserInClass.classes_fk },
      transaction,
    });

    if (!post) {
      throw new Error('Publicación no encontrada');
    }

    await post.destroy({ transaction });
    await transaction.commit();
    return post;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const readPostService = async (
  classId: number,
  user: UserData,
  postId: number
) => {
  const transaction = await sequelize.transaction();
  try {
    if (!classId) {
      throw new Error('Datos no proporcionados');
    }

    const existingClass = await Class.findOne({
      where: { id: classId },
      transaction,
    });

    if (!existingClass) {
      throw new Error('El usuario no pertenece a la clase');
    }

    const foundUser = await User.findOne({
      where: { id: user.id },
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

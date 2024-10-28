import { Post } from '../models/post.model.js';
import { Comment } from '../models/comment.model.js';
import { User } from '../models/user.model.js';
import { UsersClasses } from '../models/userClass.model.js';
import { Class } from '../models/class.model.js';
import { sequelize } from '../database/db.js';

const createPostService = async (postData, classId, user) => {
  const transaction = await sequelize.transaction();
  try {
    if (!postData || !classId) {
      throw new Error('Datos no proporcionados');
    }

    console.log(classId);

    const { title, content } = postData;

    const existingClass = await Class.findOne(
      { where: { id: classId } },
      { transaction }
    );

    if (!existingClass) {
      throw new Error('El usuario no pertenece a la clase');
    }

    const existingUserInClass = await UsersClasses.findOne(
      {
        where: { users_fk: user.id, classes_fk: existingClass.id },
      },
      { transaction }
    );

    if (!existingUserInClass) {
      throw new Error('El usuario no pertenece a la clase');
    }

    const post = await Post.create(
      {
        title,
        content,
        classes_fk: existingUserInClass.classes_fk,
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

const readPostsService = async (classId, user) => {
  const transaction = await sequelize.transaction();
  try {
    if (!classId) {
      throw new Error('Datos no proporcionados');
    }

    const existingClass = await Class.findOne(
      { where: { id: classId } },
      { transaction }
    );

    if (!existingClass) {
      throw new Error('El usuario no pertenece a la clase');
    }

    const existingUserInClass = await UsersClasses.findOne(
      {
        where: { users_fk: user.id, classes_fk: existingClass.id },
      },
      { transaction }
    );

    if (!existingUserInClass) {
      throw new Error('El usuario no pertenece a la clase');
    }

    const posts = await Post.findAll(
      {
        where: { classes_fk: existingUserInClass.classes_fk },
      },
      { transaction }
    );

    await transaction.commit();
    return posts;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updatePostService = async (postId, postData, classId, user) => {
  const transaction = await sequelize.transaction();
  try {
    if (!postData || !classId || !postId) {
      throw new Error('Datos no proporcionados');
    }

    const { title, content } = postData;

    const existingClass = await Class.findOne(
      { where: { id: classId } },
      { transaction }
    );

    if (!existingClass) {
      throw new Error('El usuario no pertenece a la clase');
    }

    const existingUserInClass = await UsersClasses.findOne(
      {
        where: { users_fk: user.id, classes_fk: existingClass.id },
      },
      { transaction }
    );

    if (!existingUserInClass) {
      throw new Error('El usuario no pertenece a la clase');
    }

    const post = await Post.findOne(
      {
        where: { id: postId, classes_fk: existingUserInClass.classes_fk },
      },
      { transaction }
    );

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

const deletePostService = async (postId, classId, user) => {
  const transaction = await sequelize.transaction();
  try {
    if (!postId || !classId) {
      throw new Error('Datos no proporcionados');
    }

    const existingClass = await Class.findOne(
      { where: { id: classId } },
      { transaction }
    );

    if (!existingClass) {
      throw new Error('El usuario no pertenece a la clase');
    }

    const existingUserInClass = await UsersClasses.findOne(
      {
        where: { users_fk: user.id, classes_fk: existingClass.id },
      },
      { transaction }
    );

    if (!existingUserInClass) {
      throw new Error('El usuario no pertenece a la clase');
    }

    const post = await Post.findOne(
      {
        where: { id: postId, classes_fk: existingUserInClass.classes_fk },
      },
      { transaction }
    );

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

const readPostService = async (classId, user) => {
  const transaction = await sequelize.transaction();
  try {
    if (!classId) {
      throw new Error('Datos no proporcionados');
    }

    const existingClass = await Class.findOne(
      { where: { id: classId } },
      { transaction }
    );

    if (!existingClass) {
      throw new Error('El usuario no pertenece a la clase');
    }

    const existingUserInClass = await UsersClasses.findOne(
      {
        where: { users_fk: user.id, classes_fk: existingClass.id },
      },
      { transaction }
    );

    if (!existingUserInClass) {
      throw new Error('El usuario no pertenece a la clase');
    }

    const post = await Post.findAll(
      {
        where: { classes_fk: existingUserInClass.classes_fk },
      },
      { transaction }
    );

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

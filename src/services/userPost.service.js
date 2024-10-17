import { Post } from '../models/post.model.js';
import { Comment } from '../models/comment.model.js';
import { User } from '../models/user.model.js';
import { UsersClasses } from '../models/userClass.model.js';
import { Class } from '../models/class.model.js';
import { sequelize } from '../database/db.js';

const createPostService = async (postData, classData, user) => {
  const transaction = await sequelize.transaction();
  try {
    if (!postData || !classData) {
      throw new Error('Datos no proporcionados');
    }

    const { title, content } = postData;

    const existingClass = await Class.findOne(
      { where: { class_code: classData } },
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

export { createPostService };

import { People } from '../models/people.model';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Permission } from '../models/permission.model';
import { RolePermission } from '../models/rolePermission.model';
import { Class } from '../models/class.model';
import { Task } from '../models/task.model';
import { UserClass } from '../models/userClass.model';
import { FileTask } from '../models/fileTask.model';
import { Post } from '../models/post.model';
import { Comment } from '../models/comment.model';
import { Tool } from '../models/tool.model';
import { TaskTool } from '../models/taskTool.model';
import { FileUser } from '../models/fileUser';
import { logger } from '../configs/logger.config';
import './relationship';

async function syncModels() {
  try {
    // await People.sync({ alter: true });
    // await User.sync({ alter: true });
    // await Role.sync({ alter: true });
    // await Permission.sync({ alter: true });
    // await RolePermission.sync({ alter: true });
    // await Class.sync({ alter: true });
    // await Task.sync({ alter: true });
    // await UserClass.sync({ alter: true });
    // await FileTask.sync({ alter: true });
    // await Post.sync({ alter: true });
    // await Comment.sync({ alter: true });
    // await Tool.sync({ alter: true });
    // await TaskTool.sync({ alter: true });
    // await FileUser.sync({ alter: true });

    /* descomenta esto si quieres reiniciar la base de datos
      await People.sync({ force: false });
      await User.sync({ force: false });
      await Role.sync({ force: false });
      await Permission.sync({ force: false });
      await RolePermission.sync({ force: false });
      await Class.sync({ force: true });
      await Task.sync({ force: true });
      await UserClass.sync({ force: true });
      await FileTask.sync({ force: true });
      await Post.sync({ force: true });
      await Comment.sync({ force: true });
      await Tool.sync({ force: true });
      await TaskTool.sync({ force: true });

    */
    await People.sync({ force: false });
    await User.sync({ force: false });
    await Role.sync({ force: false });
    await Permission.sync({ force: false });
    await RolePermission.sync({ force: false });
    await Class.sync({ force: true });
    await Task.sync({ force: true });
    await UserClass.sync({ force: true });
    await FileTask.sync({ force: true });
    await Post.sync({ force: true });
    await Comment.sync({ force: true });
    await Tool.sync({ force: true });
    await TaskTool.sync({ force: true });
    await FileUser.sync({ force: true });

    logger.info('Modelos sincronizados correctamente.');
  } catch (error) {
    logger.error('Error al sincronizar los modelos:', error);
  }
}

export { syncModels };

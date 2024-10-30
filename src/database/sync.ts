import { sequelize } from './db.js';
import { People } from '../models/people.model.js';
import { User } from '../models/user.model.js';
import { Role } from '../models/role.model.js';
import { Permission } from '../models/permission.model.js';
import { RolePermission } from '../models/rolePermission.model.js';
import { Class } from '../models/class.model.js';
import { Task } from '../models/task.model.js';
import { UserClass } from '../models/userClass.model.js';
import { FileTask } from '../models/fileTask.model.js';
import { Post } from '../models/post.model.js';
import { Comment } from '../models/comment.model.js';
import { Tool } from '../models/tool.model.js';
import { TaskTool } from '../models/taskTool.model.js';
import { logger } from '../configs/loggerConfig.js';
import './relationship.js';

const syncModels = async () => {
  try {
    await sequelize.sync({ force: false });
    await People.sync({ force: false });
    await User.sync({ force: false });
    await Role.sync({ force: false });
    await Permission.sync({ force: false });
    await RolePermission.sync({ force: false });
    await Class.sync({ force: false });
    await Task.sync({ force: false });
    await UserClass.sync({ force: false });
    await FileTask.sync({ force: false });
    await Post.sync({ force: false });
    await Comment.sync({ force: false });
    await Tool.sync({ force: false });
    await TaskTool.sync({ force: false });

    logger.info('Modelos sincronizados correctamente.');
  } catch (error) {
    logger.error('Error al sincronizar los modelos:', error);
  }
};

export { syncModels };

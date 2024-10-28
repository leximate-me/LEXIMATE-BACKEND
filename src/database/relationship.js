import { Role } from '../models/role.model.js';
import { Permission } from '../models/permission.model.js';
import { RolePermission } from '../models/rolePermission.model.js';
import { People } from '../models/people.model.js';
import { User } from '../models/user.model.js';
import { Class } from '../models/class.model.js';
import { Task } from '../models/task.model.js';
import { UsersClasses } from '../models/userClass.model.js';
import { FileTask } from '../models/fileTask.model.js';
import { Post } from '../models/post.model.js';
import { Comment } from '../models/comment.model.js';
import { Tool } from '../models/tool.model.js';
import { TaskTool } from '../models/taskTool.model.js';

User.belongsTo(People, { foreignKey: 'people_fk' });

User.belongsTo(Role, { foreignKey: 'roles_fk' });

RolePermission.belongsTo(Role, { foreignKey: 'roles_fk' });

RolePermission.belongsTo(Permission, { foreignKey: 'permissions_fk' });

Task.belongsTo(Class, { foreignKey: 'classes_fk' });

UsersClasses.belongsTo(User, { foreignKey: 'users_fk' });

UsersClasses.belongsTo(Class, { foreignKey: 'classes_fk' });

FileTask.belongsTo(Task, { foreignKey: 'tasks_fk' });

Post.belongsTo(Class, { foreignKey: 'classes_fk' });

Post.belongsTo(User, { foreignKey: 'users_fk' });

Comment.belongsTo(Post, { foreignKey: 'posts_fk' });

Comment.belongsTo(User, { foreignKey: 'users_fk' });

Tool.belongsTo(Task, { foreignKey: 'tasks_fk' });

TaskTool.belongsTo(Task, { foreignKey: 'tasks_fk' });

TaskTool.belongsTo(Tool, { foreignKey: 'tools_fk' });

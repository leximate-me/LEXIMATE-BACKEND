import { Role } from '../models/role.model';
import { Permission } from '../models/permission.model';
import { RolePermission } from '../models/rolePermission.model';
import { People } from '../models/people.model';
import { User } from '../models/user.model';
import { Class } from '../models/class.model';
import { Task } from '../models/task.model';
import { UserClass } from '../models/userClass.model';
import { FileTask } from '../models/fileTask.model';
import { Post } from '../models/post.model';
import { Comment } from '../models/comment.model';
import { Tool } from '../models/tool.model';
import { TaskTool } from '../models/taskTool.model';
import { FileUser } from '../models/fileUser';

User.belongsTo(People, { foreignKey: 'people_fk', as: 'people' });

User.belongsTo(Role, { foreignKey: 'roles_fk', as: 'role' });

RolePermission.belongsTo(Role, { foreignKey: 'roles_fk', as: 'role' });

RolePermission.belongsTo(Permission, {
  foreignKey: 'permissions_fk',
  as: 'permission',
});

Task.belongsTo(Class, { foreignKey: 'classes_fk', as: 'class' });

UserClass.belongsTo(User, { foreignKey: 'users_fk', as: 'user' });

UserClass.belongsTo(Class, { foreignKey: 'classes_fk', as: 'class' });

FileTask.belongsTo(Task, { foreignKey: 'tasks_fk', as: 'task' });

Post.belongsTo(Class, { foreignKey: 'classes_fk', as: 'class' });

Post.belongsTo(User, { foreignKey: 'users_fk', as: 'user' });

Comment.belongsTo(Post, { foreignKey: 'posts_fk', as: 'post' });

Comment.belongsTo(User, { foreignKey: 'users_fk', as: 'user' });

Tool.belongsTo(Task, { foreignKey: 'tasks_fk', as: 'task' });

TaskTool.belongsTo(Task, { foreignKey: 'tasks_fk', as: 'task' });

TaskTool.belongsTo(Tool, { foreignKey: 'tools_fk', as: 'tool' });

FileUser.belongsTo(User, { foreignKey: 'users_fk', as: 'user' });

User.hasMany(FileUser, { foreignKey: 'users_fk', as: 'fileUser' });

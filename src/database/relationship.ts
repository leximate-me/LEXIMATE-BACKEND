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

User.belongsTo(People, { foreignKey: 'people_fk' });

User.belongsTo(Role, { foreignKey: 'roles_fk' });

RolePermission.belongsTo(Role, { foreignKey: 'roles_fk' });

RolePermission.belongsTo(Permission, { foreignKey: 'permissions_fk' });

Task.belongsTo(Class, { foreignKey: 'classes_fk' });

UserClass.belongsTo(User, { foreignKey: 'users_fk' });

UserClass.belongsTo(Class, { foreignKey: 'classes_fk' });

FileTask.belongsTo(Task, { foreignKey: 'tasks_fk' });

Post.belongsTo(Class, { foreignKey: 'classes_fk' });

Post.belongsTo(User, { foreignKey: 'users_fk' });

Comment.belongsTo(Post, { foreignKey: 'posts_fk' });

Comment.belongsTo(User, { foreignKey: 'users_fk' });

Tool.belongsTo(Task, { foreignKey: 'tasks_fk' });

TaskTool.belongsTo(Task, { foreignKey: 'tasks_fk' });

TaskTool.belongsTo(Tool, { foreignKey: 'tools_fk' });

FileUser.belongsTo(User, { foreignKey: 'users_fk' });

import { taskEventEmitter } from '../task.events';
import { notificationEmitter } from '../notification.events';
import { NotificationEnum } from '@common/enums/notification.enum';

export class TaskEventHandler {
  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    taskEventEmitter.on('task_created', this.handleTaskCreated.bind(this));
    taskEventEmitter.on('task_submitted', this.handleTaskSubmitted.bind(this));
  }

  private handleTaskCreated(data: any) {
    const { task, userIds, authorId } = data;

    // Notify all students in the course about new task
    userIds.forEach((userId: string) => {
      if (userId !== authorId) {
        notificationEmitter.emit('create_notification', {
          userId,
          type: NotificationEnum.TASK_ASSIGNED,
          title: 'Nueva tarea asignada',
          message: `Se ha asignado una nueva tarea: ${task.title}`,
          data: {
            url: `/courses/${task.courseId}/task/${task.id}`,
            taskId: task.id,
            courseId: task.courseId,
            courseName: task.courseName,
          },
        });
      }
    });
  }

  private handleTaskSubmitted(data: any) {
    const { submission, teacherId } = data;

    // Notify teacher about new submission
    if (teacherId) {
      notificationEmitter.emit('create_notification', {
        userId: teacherId,
        type: NotificationEnum.TASK_SUBMITTED,
        title: 'Nueva entrega de tarea',
        message: `${submission.studentName} ha enviado la tarea: ${submission.taskTitle}`,
        data: {
          url: `/courses/${submission.courseId}/task/${submission.taskId}`,
          taskId: submission.taskId,
          courseId: submission.courseId,
          submissionId: submission.id,
          studentId: submission.studentId,
          studentName: submission.studentName,
        },
      });
    }
  }
}

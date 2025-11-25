import { postEventEmitter } from '../post.events';
import { notificationEmitter } from '../notification.events';
import { NotificationEnum } from '@common/enums/notification.enum';

export class PostEventHandler {
  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    postEventEmitter.on('post_created', this.handlePostCreated.bind(this));
  }

  private handlePostCreated(data: any) {
    const { post, userIds, authorId } = data;

    // Create notifications for all users except author
    userIds.forEach((userId: string) => {
      if (userId !== authorId) {
        const notificationData = {
          userId,
          type: NotificationEnum.POST_CREATED,
          title: 'Nuevo post en el curso',
          message: `${post.authorName} publicó: "${post.title}" en ${post.courseName}`,
          data: {
            url: `/courses/${post.courseId}/post/${post.id}`,
            postId: post.id,
            courseId: post.courseId,
            courseName: post.courseName,
            authorName: post.authorName,
          },
        };

        // Create persistent notification
        notificationEmitter.emit('create_notification', notificationData);
      }
    });
  }
}

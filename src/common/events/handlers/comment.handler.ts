import { commentEventEmitter } from '../comment.events';
import { notificationEmitter } from '../notification.events';
import { NotificationEnum } from '@common/enums/notification.enum';

export class CommentEventHandler {
  constructor() {
    this.setupListeners();
  }

  private setupListeners() {
    commentEventEmitter.on('comment_created', this.handleCommentCreated.bind(this));
  }

  private handleCommentCreated(data: any) {
    console.log('👂 CommentEventHandler received comment_created');
    const { comment, postAuthorId } = data;
    
    console.log(`📊 Comment Data: Author=${comment.authorId}, PostAuthor=${postAuthorId}`);
    console.log(`🧐 Comparison: ${comment.authorId} !== ${postAuthorId} is ${comment.authorId !== postAuthorId}`);

    // Notify post author about new comment (if commenter is not the author)
    if (postAuthorId && comment.authorId !== postAuthorId) {
      console.log('✅ Condition met: Creating notification for post author');
      const notificationData = {
        userId: postAuthorId,
        type: NotificationEnum.COMMENT_ADDED,
        title: 'Nuevo comentario en tu post',
        message: `${comment.authorName} comentó en tu post: "${comment.postTitle}"`,
        data: {
          url: `/courses/${comment.courseId}/post/${comment.postId}`,
          postId: comment.postId,
          courseId: comment.courseId,
          commentId: comment.id,
          commenterName: comment.authorName,
        },
      };

      // Create persistent notification
      notificationEmitter.emit('create_notification', notificationData);
    }
  }
}

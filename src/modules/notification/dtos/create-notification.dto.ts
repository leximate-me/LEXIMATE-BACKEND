export class CreateNotificationDto {
  userId: string;
  type: 'task' | 'post' | 'comment' | 'submission' | 'grade' | 'general';
  title: string;
  message: string;
  data?: any;
}

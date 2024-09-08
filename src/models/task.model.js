import { model, Schema } from 'mongoose';

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Teacher',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pendiente', 'Completada'],
      default: 'Pendiente',
    },
  },
  { timestamps: true }
);

const taskModel = model('Task', taskSchema);

export { taskModel };

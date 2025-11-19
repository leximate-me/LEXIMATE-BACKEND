import { FastifyInstance } from 'fastify';
import { uploadToStorage } from '../../../common/middlewares/upload.middleware';
import { requireRole } from '../../../common/middlewares/auth.middleware';

import { createTaskSubmissionSchema, updateTaskSubmissionSchema } from '../schemas';
import { TaskSubmissionController } from '../controllers/task-submission.controller';

export async function taskSubmissionRouter(fastify: FastifyInstance) {
  const submissionController = new TaskSubmissionController();

  fastify.post('/:taskId/submissions', {
    schema: createTaskSubmissionSchema,
    preValidation: [uploadToStorage],
    preHandler: [requireRole(['teacher', 'student', 'admin'])],
    handler: submissionController.createSubmission.bind(submissionController),
  });

  fastify.get('/:taskId/submissions', {
    preHandler: [requireRole(['teacher', 'student', 'admin'])],
    handler: submissionController.getSubmissionsByTask.bind(submissionController),
  });

  fastify.get('/:taskId/submissions/:submissionId', {
    preHandler: [requireRole(['teacher', 'student', 'admin'])],
    handler: submissionController.getSubmissionByTask.bind(submissionController),
  });

  fastify.put('/:taskId/submissions/:submissionId', {
    schema: updateTaskSubmissionSchema,
    preValidation: [uploadToStorage],
    preHandler: [requireRole(['teacher', 'student', 'admin'])],
    handler: submissionController.updateSubmission.bind(submissionController),
  });

  fastify.delete('/:taskId/submissions/:submissionId', {
    preHandler: [requireRole(['teacher', 'student', 'admin'])],
    handler: submissionController.deleteSubmission.bind(submissionController),
  });

  fastify.patch('/:taskId/submissions/:studentId/qualify', {
    schema: updateTaskSubmissionSchema,
    preHandler: [requireRole(['teacher', 'admin'])],
    handler: submissionController.qualifySubmission.bind(submissionController),
  });
}

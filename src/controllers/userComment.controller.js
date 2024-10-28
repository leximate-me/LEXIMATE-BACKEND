import { createCommentService } from '../services/userComment.service.js';
import { logger } from '../configs/loggerConfig.js';

const createCommentController = async (req, res) => {
  try {
    const commentData = req.body;
    const postId = req.params.postId;
    const user = req.user;

    const newComment = await createCommentService(commentData, postId, user);

    res.status(201).json(newComment);
  } catch (error) {
    logger.error(error, 'Error en createCommentController');
    res.status(400).json({ error: error.message });
  }
};

export { createCommentController };

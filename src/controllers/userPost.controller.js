import { createPostService } from '../services/userPost.service.js';

const createPostController = async (req, res) => {
  try {
    const postData = req.body;
    const classData = req.params.classCode;
    const user = req.user;

    const post = await createPostService(postData, classData, user);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { createPostController };

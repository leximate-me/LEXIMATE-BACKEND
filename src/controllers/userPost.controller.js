import {
  createPostService,
  readPostService,
  updatePostService,
  deletePostService,
} from '../services/userPost.service.js';

const createPostController = async (req, res) => {
  try {
    const postData = req.body;
    const classId = req.params.classId;
    const user = req.user;

    const post = await createPostService(postData, classId, user);
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const readPostsController = async (req, res) => {
  try {
    const classId = req.params.classId;
    const user = req.user;

    const posts = await readPostService(classId, user);
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePostController = async (req, res) => {
  try {
    const postId = req.params.postId;
    const postData = req.body;
    const classId = req.params.classId;
    const user = req.user;

    const post = await updatePostService(postId, postData, classId, user);
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePostController = async (req, res) => {
  try {
    const postId = req.params.postId;
    const classId = req.params.classId;
    const user = req.user;

    await deletePostService(postId, classId, user);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const readPostController = async (req, res) => {
  try {
    const classId = req.params.classId;
    const user = req.user;

    const posts = await readPostService(classId, user);
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  createPostController,
  readPostsController,
  updatePostController,
  deletePostController,
  readPostController,
};

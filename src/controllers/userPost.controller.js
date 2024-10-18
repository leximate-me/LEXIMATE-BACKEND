import {
  createPostService,
  readPostService,
  updatePostService,
  deletePostService,
} from '../services/userPost.service.js';

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

const readPostController = async (req, res) => {
  try {
    const classData = req.params.classCode;
    const user = req.user;

    const posts = await readPostService(classData, user);
    res.status(200).json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updatePostController = async (req, res) => {
  try {
    const postData = req.body;
    const classData = req.params.classCode;
    const user = req.user;

    const post = await updatePostService(postData, classData, user);
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deletePostController = async (req, res) => {
  try {
    const classData = req.params.classCode;
    const user = req.user;

    const post = await deletePostService(classData, user);
    res.status(200).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {
  createPostController,
  readPostController,
  updatePostController,
  deletePostController,
};

import { AppDataSource } from '../../database/db';
import { User } from '../user/entities';
import { Course } from '../course/entities/course.entity';
import { Post } from './entities/post.entity';
import { HttpError } from '../../common/libs/http-error';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

export class PostService {
  private readonly courseRepository = AppDataSource.getRepository(Course);
  private readonly userRepository = AppDataSource.getRepository(User);
  private readonly postRepository = AppDataSource.getRepository(Post);

  async create(createPostDto: CreatePostDto, courseId: string, userId: string) {
    const existingCourse = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['users'],
    });
    if (!existingCourse) throw HttpError.notFound('Clase no encontrada');

    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    const isInCourse = foundUser.courses.some((c) => c.id === courseId);
    if (!isInCourse)
      throw HttpError.forbidden('El usuario no pertenece a la clase');

    const post = this.postRepository.create({
      title: createPostDto.title,
      content: createPostDto.content,
      course: existingCourse,
      user: foundUser,
    });
    await this.postRepository.save(post);

    return post;
  }

  async readAll(courseId: string, userId: string) {
    const existingCourse = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['users'],
    });
    if (!existingCourse) throw HttpError.notFound('Clase no encontrada');

    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    const isInCourse = foundUser.courses.some((c) => c.id === courseId);
    if (!isInCourse)
      throw HttpError.forbidden('El usuario no pertenece a la clase');

    const posts = await this.postRepository.find({
      where: { course: { id: courseId } },
      relations: ['user', 'user.people', 'course'],
    });

    return posts;
  }

  async readOne(userId: string, courseId: string, postId: string) {
    const existingCourse = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['users'],
    });
    if (!existingCourse) throw HttpError.notFound('Clase no encontrada');

    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    const isInCourse = foundUser.courses.some((c) => c.id === courseId);
    if (!isInCourse)
      throw HttpError.forbidden('El usuario no pertenece a la clase');

    const post = await this.postRepository.findOne({
      where: { id: postId, course: { id: courseId } },
      relations: ['user', 'user.people', 'course'],
    });

    if (!post) throw HttpError.notFound('Publicación no encontrada');

    return post;
  }

  async update(
    postId: string,
    updatePostDto: UpdatePostDto,
    courseId: string,
    userId: string
  ) {
    const existingCourse = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['users'],
    });
    if (!existingCourse) throw HttpError.notFound('Clase no encontrada');

    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    const isInCourse = foundUser.courses.some((c) => c.id === courseId);
    if (!isInCourse)
      throw HttpError.forbidden('El usuario no pertenece a la clase');

    const post = await this.postRepository.findOne({
      where: { id: postId, course: { id: courseId }, user: { id: userId } },
    });
    if (!post) throw HttpError.notFound('Publicación no encontrada');

    if (updatePostDto.title) post.title = updatePostDto.title;
    if (updatePostDto.content) post.content = updatePostDto.content;

    await this.postRepository.save(post);

    return post;
  }

  async delete(postId: string, courseId: string, userId: string) {
    const existingCourse = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['users'],
    });
    if (!existingCourse) throw HttpError.notFound('Clase no encontrada');

    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    const isInCourse = foundUser.courses.some((c) => c.id === courseId);
    if (!isInCourse)
      throw HttpError.forbidden('El usuario no pertenece a la clase');

    const post = await this.postRepository.findOne({
      where: { id: postId, course: { id: courseId } },
    });
    if (!post) throw HttpError.notFound('Publicación no encontrada');

    await this.postRepository.remove(post);

    return { message: 'Publicación eliminada correctamente' };
  }
}

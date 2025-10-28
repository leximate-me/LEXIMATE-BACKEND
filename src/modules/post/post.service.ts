import { AppDataSource } from '../../database/db';
import { User } from '../user/entities';
import { Course } from '../course/entities/course.entity';
import { Post } from './entities/post.entity';
import { HttpError } from '../../common/libs/http-error';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';

export class PostService {
  private readonly classRepo = AppDataSource.getRepository(Course);
  private readonly userRepo = AppDataSource.getRepository(User);
  private readonly postRepo = AppDataSource.getRepository(Post);

  async create(createPostDto: CreatePostDto, classId: string, userId: string) {
    const existingClass = await this.classRepo.findOne({
      where: { id: classId },
      relations: ['users'],
    });
    if (!existingClass) throw HttpError.notFound('Clase no encontrada');

    const foundUser = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    const isInClass = foundUser.courses.some((c) => c.id === classId);
    if (!isInClass)
      throw HttpError.forbidden('El usuario no pertenece a la clase');

    const post = this.postRepo.create({
      title: createPostDto.title,
      content: createPostDto.content,
      course: existingClass,
      user: foundUser,
    });
    await this.postRepo.save(post);

    return post;
  }

  async readAll(classId: string, userId: string) {
    const existingClass = await this.classRepo.findOne({
      where: { id: classId },
      relations: ['users'],
    });
    if (!existingClass) throw HttpError.notFound('Clase no encontrada');

    const foundUser = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    const isInClass = foundUser.courses.some((c) => c.id === classId);
    if (!isInClass)
      throw HttpError.forbidden('El usuario no pertenece a la clase');

    const posts = await this.postRepo.find({
      where: { course: { id: classId } },
      relations: ['user', 'user.people', 'class'],
    });

    return posts;
  }

  async readOne(userId: string, classId: string, postId: string) {
    const existingClass = await this.classRepo.findOne({
      where: { id: classId },
      relations: ['users'],
    });
    if (!existingClass) throw HttpError.notFound('Clase no encontrada');

    const foundUser = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    const isInClass = foundUser.courses.some((c) => c.id === classId);
    if (!isInClass)
      throw HttpError.forbidden('El usuario no pertenece a la clase');

    const post = await this.postRepo.findOne({
      where: { id: postId, course: { id: classId } },
      relations: ['user', 'user.people', 'class'],
    });

    if (!post) throw HttpError.notFound('Publicación no encontrada');

    return post;
  }

  async update(
    postId: string,
    updatePostDto: UpdatePostDto,
    classId: string,
    userId: string
  ) {
    const existingClass = await this.classRepo.findOne({
      where: { id: classId },
      relations: ['users'],
    });
    if (!existingClass) throw HttpError.notFound('Clase no encontrada');

    const foundUser = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    const isInClass = foundUser.courses.some((c) => c.id === classId);
    if (!isInClass)
      throw HttpError.forbidden('El usuario no pertenece a la clase');

    const post = await this.postRepo.findOne({
      where: { id: postId, course: { id: classId }, user: { id: userId } },
    });
    if (!post) throw HttpError.notFound('Publicación no encontrada');

    if (updatePostDto.title) post.title = updatePostDto.title;
    if (updatePostDto.content) post.content = updatePostDto.content;

    await this.postRepo.save(post);

    return post;
  }

  async delete(postId: string, classId: string, userId: string) {
    const existingClass = await this.classRepo.findOne({
      where: { id: classId },
      relations: ['users'],
    });
    if (!existingClass) throw HttpError.notFound('Clase no encontrada');

    const foundUser = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    const isInClass = foundUser.courses.some((c) => c.id === classId);
    if (!isInClass)
      throw HttpError.forbidden('El usuario no pertenece a la clase');

    const post = await this.postRepo.findOne({
      where: { id: postId, course: { id: classId } },
    });
    if (!post) throw HttpError.notFound('Publicación no encontrada');

    await this.postRepo.remove(post);

    return { message: 'Publicación eliminada correctamente' };
  }
}

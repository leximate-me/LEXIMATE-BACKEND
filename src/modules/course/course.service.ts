import crypto from 'crypto';
import { AppDataSource } from '../../database/db';
import { Post } from '../post/entities/post.entity';
import { Course } from './entities/course.entity';
import { User } from '../user/entities';
import { Task } from '../task/entities/task.entity';
import { HttpError } from '../../common/libs/http-error';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';

export class CourseService {
  private readonly userRepository = AppDataSource.getRepository(User);
  private readonly courseRepository = AppDataSource.getRepository(Course);
  private readonly postRepository = AppDataSource.getRepository(Post);
  private readonly taskRepository = AppDataSource.getRepository(Task);

  async create(createCourseDto: CreateCourseDto, userId: string) {
    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    const course_code = crypto.randomBytes(5).toString('hex');

    const newCourse = this.courseRepository.create({
      name: createCourseDto.name,
      description: createCourseDto.description,
      class_code: course_code,
    });
    await this.courseRepository.save(newCourse);

    foundUser.courses = [...(foundUser.courses || []), newCourse];
    await this.userRepository.save(foundUser);

    return newCourse;
  }

  async join(courseCode: string, userId: string) {
    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    const courseData = await this.courseRepository.findOne({
      where: { class_code: courseCode },
    });
    if (!courseData) throw HttpError.notFound('Curso no encontrado');

    foundUser.courses = [...(foundUser.courses || []), courseData];
    await this.userRepository.save(foundUser);

    return courseData;
  }

  async leave(courseId: string, userId: string) {
    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    const courseData = await this.courseRepository.findOne({
      where: { id: courseId },
    });
    if (!courseData) throw HttpError.notFound('Curso no encontrado');

    foundUser.courses = (foundUser.courses || []).filter(
      (c) => c.id !== courseId
    );
    await this.userRepository.save(foundUser);

    return courseData;
  }

  async getCoursesByUser(userId: string) {
    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    return foundUser.courses || [];
  }

  async getUsersByCourse(courseId: string) {
    const courseData = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['users'],
    });
    if (!courseData) throw HttpError.notFound('Curso no encontrado');

    if (!courseData.users || courseData.users.length === 0)
      throw HttpError.notFound('No hay usuarios en este curso');

    return courseData.users;
  }

  async update(
    courseId: string,
    updateCourseDto: UpdateCourseDto,
    userId: string
  ) {
    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    const courseFound = await this.courseRepository.findOne({
      where: { id: courseId },
    });
    if (!courseFound) throw HttpError.notFound('Curso no encontrado');

    if (updateCourseDto.name) courseFound.name = updateCourseDto.name;
    if (updateCourseDto.description)
      courseFound.description = updateCourseDto.description;

    await this.courseRepository.save(courseFound);

    return courseFound;
  }

  async delete(courseId: string, userId: string) {
    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!foundUser) throw HttpError.notFound('Usuario no encontrado');

    const courseFound = await this.courseRepository.findOne({
      where: { id: courseId },
    });
    if (!courseFound) throw HttpError.notFound('Curso no encontrado');

    await this.taskRepository.delete({ course: { id: courseId } });
    await this.postRepository.delete({ course: { id: courseId } });

    await this.courseRepository.delete({ id: courseId });

    return courseFound;
  }
}

import crypto from 'crypto';
import { AppDataSource } from '@database/db';
import { HttpError } from '@common/libs/http-error';

import { Course } from '@course/entities/course.entity';
import { Post } from '@post/entities/post.entity';
import { User } from '@user/entities';
import { Task } from '@task/entities/task.entity';

import { CreateCourseDto } from '@course/dtos/create-course.dto';
import { UpdateCourseDto } from '@course/dtos/update-course.dto';
import { courseEventEmitter } from '@common/events/course.events';

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
    if (!foundUser) throw HttpError.notFound('User not found');

    const course_code = crypto.randomBytes(5).toString('hex');

    const newCourse = this.courseRepository.create({
      name: createCourseDto.name,
      description: createCourseDto.description,
      class_code: course_code,
      users: [foundUser],
    });
    await this.courseRepository.save(newCourse);

    foundUser.courses = [...(foundUser.courses || []), newCourse];
    await this.userRepository.save(foundUser);

    // Emit real-time event for WebSocket broadcast
    courseEventEmitter.emit('course_created', {
      course: {
        id: newCourse.id,
        name: newCourse.name,
        description: newCourse.description,
        class_code: newCourse.class_code,
        createdAt: newCourse.created_at,
      },
      userIds: [foundUser.id],
    });

    return newCourse;
  }

  async join(courseCode: string, userId: string) {
    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('User not found');

    const courseData = await this.courseRepository.findOne({
      where: { class_code: courseCode },
    });
    if (!courseData) throw HttpError.notFound('Course not found');

    foundUser.courses = [...(foundUser.courses || []), courseData];
    await this.userRepository.save(foundUser);

    // Emit real-time event
    const updatedCourse = await this.courseRepository.findOne({
      where: { id: courseData.id },
      relations: ['users'],
    });

    if (updatedCourse) {
      courseEventEmitter.emit('course_updated', {
        course: {
          id: updatedCourse.id,
          name: updatedCourse.name,
          description: updatedCourse.description,
          class_code: updatedCourse.class_code,
          updatedAt: updatedCourse.updated_at,
        },
        userIds: updatedCourse.users.map((u) => u.id),
      });
    }

    return courseData;
  }

  async leave(courseId: string, userId: string) {
    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('User not found');

    const courseData = await this.courseRepository.findOne({
      where: { id: courseId },
    });
    if (!courseData) throw HttpError.notFound('Course not found');

    foundUser.courses = (foundUser.courses || []).filter(
      (c) => c.id !== courseId
    );
    await this.userRepository.save(foundUser);

    // Emit real-time event
    const updatedCourse = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['users'],
    });

    if (updatedCourse) {
      courseEventEmitter.emit('course_updated', {
        course: {
          id: updatedCourse.id,
          name: updatedCourse.name,
          description: updatedCourse.description,
          class_code: updatedCourse.class_code,
          updatedAt: updatedCourse.updated_at,
        },
        userIds: updatedCourse.users.map((u) => u.id),
      });
    }

    return courseData;
  }

  async getCoursesByUser(userId: string, page: number = 1, limit: number = 10) {
    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['courses'],
    });
    if (!foundUser) throw HttpError.notFound('User not found');

    const courses = foundUser.courses || [];
    
    // Manual pagination since we're working with a loaded relation
    const total = courses.length;
    const skip = (page - 1) * limit;
    const paginatedCourses = courses
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(skip, skip + limit);

    return Object.assign(paginatedCourses, {
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    });
  }

  async getUsersByCourse(courseId: string) {
    const courseData = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['users'],
    });
    if (!courseData) throw HttpError.notFound('Course not found');

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
    if (!foundUser) throw HttpError.notFound('User not found');

    const courseFound = await this.courseRepository.findOne({
      where: { id: courseId },
    });
    if (!courseFound) throw HttpError.notFound('Course not found');

    if (updateCourseDto.name) courseFound.name = updateCourseDto.name;
    if (updateCourseDto.description)
      courseFound.description = updateCourseDto.description;

    await this.courseRepository.save(courseFound);

    // Emit real-time event for WebSocket broadcast
    const updatedCourse = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['users'],
    });

    if (updatedCourse) {
      courseEventEmitter.emit('course_updated', {
        course: {
          id: updatedCourse.id,
          name: updatedCourse.name,
          description: updatedCourse.description,
          class_code: updatedCourse.class_code,
          updatedAt: updatedCourse.updated_at,
        },
        userIds: updatedCourse.users.map((u) => u.id),
      });
    }

    return courseFound;
  }

  async delete(courseId: string, userId: string) {
    const foundUser = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!foundUser) throw HttpError.notFound('User not found');

    const courseFound = await this.courseRepository.findOne({
      where: { id: courseId },
      relations: ['users'],
    });
    if (!courseFound) throw HttpError.notFound('Course not found');

    // Elimina la relación con los usuarios
    const userIds = courseFound.users.map((u) => u.id);
    courseFound.users = [];
    await this.courseRepository.save(courseFound);

    await this.taskRepository.delete({ course: { id: courseId } });
    await this.postRepository.delete({ course: { id: courseId } });

    await this.courseRepository.delete({ id: courseId });

    // Emit real-time event for WebSocket broadcast
    courseEventEmitter.emit('course_deleted', {
      courseId,
      userIds,
    });

    return courseFound;
  }
}

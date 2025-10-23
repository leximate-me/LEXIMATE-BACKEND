import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { EnvConfiguration } from './config/env.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseModule } from './course/course.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { TaskModule } from './task/task.module';
import { ToolModule } from './tool/tool.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [EnvConfiguration], isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('dbHost'),
        port: configService.get<number>('dbPort'),
        username: configService.get('dbUser'),
        password: configService.get('dbPassword'),
        database: configService.get('dbName'),
        autoLoadEntities: true,
        synchronize: true,
        namingStrategy: new SnakeNamingStrategy(),
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    UserModule,
    CourseModule,
    PostModule,
    CommentModule,
    TaskModule,
    ToolModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

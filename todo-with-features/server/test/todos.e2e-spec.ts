import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TodosController (e2e)', () => {
  let app: INestApplication;
  let createdTodoId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(
          process.env.MONGODB_URI ||
            'mongodb://admin:password@localhost:27017/todo-test?authSource=admin',
        ),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/todos (POST)', () => {
    it('should create a todo', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .send({ content: 'E2E Test Todo' })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('_id');
          expect(res.body.content).toBe('E2E Test Todo');
          expect(res.body.completed).toBe(false);
          createdTodoId = res.body._id;
        });
    });

    it('should fail to create todo without content', () => {
      return request(app.getHttpServer())
        .post('/todos')
        .send({})
        .expect(400);
    });
  });

  describe('/todos (GET)', () => {
    it('should return an array of todos', () => {
      return request(app.getHttpServer())
        .get('/todos')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });

  describe('/todos/:id (GET)', () => {
    it('should return a todo by id', () => {
      return request(app.getHttpServer())
        .get(`/todos/${createdTodoId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(createdTodoId);
          expect(res.body.content).toBe('E2E Test Todo');
        });
    });

    it('should return 404 for non-existent todo', () => {
      return request(app.getHttpServer())
        .get('/todos/507f1f77bcf86cd799439011')
        .expect(404);
    });
  });

  describe('/todos/:id (PATCH)', () => {
    it('should update a todo', () => {
      return request(app.getHttpServer())
        .patch(`/todos/${createdTodoId}`)
        .send({ completed: true })
        .expect(200)
        .expect((res) => {
          expect(res.body.completed).toBe(true);
        });
    });

    it('should return 404 for non-existent todo', () => {
      return request(app.getHttpServer())
        .patch('/todos/507f1f77bcf86cd799439011')
        .send({ completed: true })
        .expect(404);
    });
  });

  describe('/todos/:id (DELETE)', () => {
    it('should delete a todo', () => {
      return request(app.getHttpServer())
        .delete(`/todos/${createdTodoId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(createdTodoId);
        });
    });

    it('should return 404 for non-existent todo', () => {
      return request(app.getHttpServer())
        .delete('/todos/507f1f77bcf86cd799439011')
        .expect(404);
    });
  });
});


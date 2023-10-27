import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (POST) regiser success 201', async () => {
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'fdfdfdfdfd',
        surname: 'fdsfds',
        phone: '23432432',
        email: 'asdsadas@mail.com',
        password: 'sdfsfsdfsd',
      });

    expect(201);
    expect(registerResponse.body).toEqual({
      name: 'fdfdfdfdfd',
      email: 'asdsadas@mail.com',
      verificationToken: expect.any(String),
    });
  });

  it('/ (POST) regiser conflict 409', async () => {
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'dfsdf',
        surname: 'fdsfds',
        phone: '23432432',
        email: 'asdsadas@mail.com',
        password: 'sdfsfsdfsd',
      });

    expect(409);
    expect(registerResponse.body).toEqual({
      message: 'Email address is already registered',
      error: 'Conflict',
      statusCode: 409,
    });
  });

  afterAll((done) => {
    app.close();
    done();
  });
});

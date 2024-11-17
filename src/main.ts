import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe()); // --> global validation pipe

	app.use(cors({
		origin: 'http://localhost:5173', // Replace with your frontend's origin
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
	}));

	// Use cookie-parser middleware (for session cookies)
	app.use(cookieParser());

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

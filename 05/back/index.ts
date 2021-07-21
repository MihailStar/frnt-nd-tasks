import app from './app';

const PORT = 80;

async function bootstrap(): Promise<void> {
  try {
    await app.listen(PORT);
    process.stdout.write(`http://localhost:${PORT}\n`);
  } catch (error) {
    process.stderr.write(error);
    process.exit(1);
  }
}

bootstrap();

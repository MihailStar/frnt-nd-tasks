import app from './app';

const PORT = 80;

app.listen(PORT, (error: Error) => {
  if (error) {
    process.stderr.write(`${error.toString()}\n`);
    process.exit(1);
  }

  process.stdout.write(`http://localhost:${PORT}\n`);
});

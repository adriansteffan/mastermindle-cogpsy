import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { body, matchedData, validationResult, query } from 'express-validator';
import fs from 'fs';

//For env File
dotenv.config();

const frontendURL = process.env.VITE_FRONTEND_URL ?? 'http://localhost:2000';
const backendFolder = process.env.BACKEND_FOLDER ?? 'files';

const app: Application = express();

app.use(
  cors({
    origin: [frontendURL, `http://localhost:${process.env.VITE_FRONTEND_PROD_CONTAINER}`],
    allowedHeaders: ['content-type'],
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.BACKEND_PORT || 8000;

app.get('/checkid', query('id').isString(), (req: Request, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).send({ errors: result.array() });
  }
  const data = matchedData(req);

  if (!fs.existsSync(backendFolder)) {
    return res.send({ duplicate: false });
  }

  const files = fs.readdirSync(backendFolder);
  for (const file of files) {
    if (data.id === file.replace(/__[^\_]*$/g, '')) {
      return res.send({ duplicate: true });
    }
  }

  return res.send({ duplicate: false });
});


app.post(
  '/data',
  body('id').isString(),
  body('data').isJSON(),
  async (req: Request, res: Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send({ errors: result.array() });
    }

    const data = matchedData(req);

    if (!fs.existsSync(backendFolder)) {
      fs.mkdirSync(backendFolder);
    }

    fs.writeFile(
      `${backendFolder}/${data.id}__${new Date().getTime()}.csv`,
      data.data,
      'utf8',
      function (err: Error | null) {
        if (err) {
          return res.status(400).send('Writing file went wrong');
        }
      }
    );

    return res.send('OK');
  }
);

app.listen(PORT, () => {
  console.log(`Server is Fire at http://localhost:${PORT}`);
});

import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { body, validationResult } from 'express-validator';
import fs from 'fs/promises';
import path from 'path';

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

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

const PORT = process.env.BACKEND_PORT || 8000;


interface AudioFile {
  blockPos: number;
  gameIndex: number;
  base64Data: string;
  filename: string;
}

interface UploadData {
  sessionId: string;
  files: {
    type: string;
    content: string;
  }[];
  audioFiles: AudioFile[];
}


app.post(
  '/data',
  body('sessionId').isString(),
  body('files').isArray(),
  body('files.*.type').isString(),
  body('files.*.content').isString(),
  body('audioFiles').isArray(),
  async (req: Request, res: Response) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      const data = req.body as UploadData;

      const dataDir = path.join(backendFolder, data.sessionId);
      const audioDir = path.join(dataDir, 'audio');
      await fs.mkdir(dataDir, { recursive: true });
      await fs.mkdir(audioDir, { recursive: true });

  

      const saveFilePromises = data.files.map(async (file) => {
        const filename = `${data.sessionId}_${file.type}.csv`;
        const filePath = path.join(dataDir, filename);
        await fs.writeFile(filePath, file.content, { encoding: 'utf8' });
      });

      const saveAudioPromises = data.audioFiles.map(async (audioFile) => {
        const filePath = path.join(audioDir, audioFile.filename);
        const buffer = Buffer.from(audioFile.base64Data, 'base64');
        await fs.writeFile(filePath, buffer as any);
      });

      await Promise.all([...saveFilePromises, ...saveAudioPromises]);

      return res.status(200).json({ 
        status: 200, 
        message: 'Data and audio files saved successfully' 
      });
    } catch (error) {
      console.error('Error saving data:', error);
      return res.status(500).json({ 
        status: 500, 
        message: 'Error saving data' 
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server is Fire at http://localhost:${PORT}`);
});

import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { body, matchedData, validationResult, query } from 'express-validator';
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.BACKEND_PORT || 8000;


interface FileData {
  type: string;
  content: string;
}

interface UploadData {
  sessionId: string;
  files: FileData[];
}

app.post(
  '/data',
  body('sessionId').isString(),
  body('files').isArray(),
  body('files.*.type').isString(),
  body('files.*.content').isString(),
  async (req: Request, res: Response) => {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }

      const data = req.body as UploadData;
      
      await fs.mkdir(backendFolder, { recursive: true });

      // Save each file with collision handling
      const savePromises = data.files.map(async (file) => {
        const baseFilename = `${data.sessionId}_${file.type}`;
        let filename = `${baseFilename}.csv`;
        let counter = 0;
        
        while (true) {
          try {
            const filePath = path.join(backendFolder, filename);
            await fs.writeFile(filePath, file.content, { 
              flag: 'wx', // exclusive write flag
              encoding: 'utf8'
            });
            break;
          } catch (error: any) {
            
            if (error.code === 'EEXIST') {
              counter++;
              filename = `${baseFilename}_${counter}.csv`;
            } else {
              throw error;
            }
          }
        }
      });

      await Promise.all(savePromises);

      return res.status(200).json({ 
        status: 200, 
        message: 'Data saved successfully' 
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

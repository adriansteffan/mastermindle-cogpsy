import { useState } from 'react';
import { useMutation } from 'react-query';
import { v4 as uuidv4 } from 'uuid';
import { post } from '../utils/request';
import { convertToCSV, StudyEvent } from '../utils/csv';

async function blobUrlToBase64(blobUrl: string): Promise<string> {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

interface AudioFile {
  eventIndex: number;
  eventType: string;
  eventName: string;
  questionName: string;
  base64Data: string;
  filename: string;
  timestamp: string;
}

async function findAndProcessAudioRecordings(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any,
  eventInfo: { index: number; type: string; name: string },
): Promise<AudioFile[]> {
  const audioFiles: AudioFile[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function processAudioObj(fieldName: string, audioObj: any): Promise<AudioFile | null> {
    if (audioObj.type === 'audiorecording' && audioObj.url?.startsWith('blob:')) {
      try {
        const base64Data = await blobUrlToBase64(audioObj.url);
        return {
          eventIndex: eventInfo.index,
          eventType: eventInfo.type,
          eventName: eventInfo.name,
          questionName: fieldName,
          base64Data,
          filename: `${eventInfo.type}_${eventInfo.name}_${fieldName}_${eventInfo.index}.wav`,
          timestamp: audioObj.timestamp,
        };
      } catch (error) {
        console.error(`Error processing audio recording for ${fieldName}:`, error);
        return null;
      }
    }
    return null;
  }

  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'object') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((value as any).type === 'audiorecording') {
        const audioFile = await processAudioObj(key, value);
        if (audioFile) {
          audioFiles.push(audioFile);
        }
      } else {
        // Recursively search nested objects and arrays
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            if (typeof value[i] === 'object' && value[i] !== null) {
              const nestedFiles = await findAndProcessAudioRecordings(value[i], {
                ...eventInfo,
                name: `${eventInfo.name}_item${i}`,
              });
              audioFiles.push(...nestedFiles);
            }
          }
        } else {
          const nestedFiles = await findAndProcessAudioRecordings(value, eventInfo);
          audioFiles.push(...nestedFiles);
        }
      }
    }
  }

  return audioFiles;
}

async function extractAudioFiles(studyData: StudyEvent[]): Promise<AudioFile[]> {
  const audioFiles: AudioFile[] = [];

  for (const event of studyData) {
    const eventAudioFiles = await findAndProcessAudioRecordings(event.data, event);
    audioFiles.push(...eventAudioFiles);
  }

  return audioFiles;
}

interface UploadPayload {
  sessionId: string;
  files: {
    type: string;
    content: string;
  }[];
  audioFiles: AudioFile[];
}

interface UploadResponse {
  status: number;
  message?: string;
}

export default function Upload({ data, next }: { data: StudyEvent[]; next: () => void }) {
  const [uploadState, setUploadState] = useState<'initial' | 'uploading' | 'success' | 'error'>(
    'initial',
  );

  const uploadData = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (body: any) => {
      const response = await post('/data', body);
      return response as UploadResponse;
    },
    onSuccess: (res: UploadResponse) => {
      if (res.status === 200) {
        setUploadState('success');
        next();
      } else {
        setUploadState('error');
      }
    },
    onError: () => {
      setUploadState('error');
    },
  });

  const handleUpload = async () => {
    setUploadState('uploading');
    const csvData = convertToCSV(data);
    const sessionId = uuidv4();

    console.log(data);
    console.log(JSON.stringify(data));
    try {
      const audioFiles = await extractAudioFiles(data);
      console.log('Extracted audio files:', audioFiles.length);

      const payload: UploadPayload = {
        sessionId,
        files: [
          { type: 'global', content: csvData.globalCsv },
          { type: 'block', content: csvData.blockCsv },
          { type: 'game', content: csvData.gameCsv },
          { type: 'guess', content: csvData.guessCsv },
        ],
        audioFiles,
      };

      uploadData.mutate(payload);
    } catch (error) {
      console.error('Error processing audio files:', error);
      setUploadState('error');
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-4 p-6 text-xl mt-16'>
      {uploadState == 'initial' && (
        <>
          <p className=''>
            Thank you for participating! Please click the button below to submit your data.
          </p>
          <button
            onClick={handleUpload}
            className='mt-8 bg-white px-8 py-3 border-2 border-black font-bold text-black text-lg rounded-xl shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'
          >
            Submit Data
          </button>
        </>
      )}
      {uploadState == 'uploading' && (
        <>
          <div className='w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
          <p className=''>Uploading your data...</p>
        </>
      )}
      {uploadState == 'success' && <></>}

      {uploadState == 'error' && (
        <>
          <div className='text-red-500 mb-4'>
            <p className=''>Sorry, there was an error uploading your data.</p>
            <p>Please try again or contact the researcher.</p>
          </div>
          <button
            onClick={handleUpload}
            className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
          >
            Try Again
          </button>
        </>
      )}
    </div>
  );
}

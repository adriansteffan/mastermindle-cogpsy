import { useState } from 'react';
import { useMutation } from 'react-query';
import { v4 as uuidv4 } from 'uuid';
import { post } from '../utils/request';
import { convertToCSV, StudyEvent } from '../utils/csv'; 

interface UploadResponse {
  status: number;
  message?: string;
}

export default function Upload({ data }: {
  data: StudyEvent[];
}) {
  const [uploadState, setUploadState] = useState<'initial' | 'uploading' | 'success' | 'error'>('initial');

  const uploadData = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: async (body: any) => {
      const response = await post('/data', body);
      return response as UploadResponse;
    },
    onSuccess: (res: UploadResponse) => {
      if(res.status === 200){
        setUploadState('success');
        // Optional: delay the next action to allow user to read the thank you message
        //setTimeout(next, 2000);
      }
    },
    onError: () => {
      setUploadState('error');
    }
  });

  const handleUpload = () => {
    setUploadState('uploading');
    
    const csvData = convertToCSV(data);
    const sessionId = uuidv4();
    
    const payload = {
      sessionId,
      files: [
        { type: 'global', content: csvData.globalCsv },
        { type: 'block', content: csvData.blockCsv },
        { type: 'game', content: csvData.gameCsv },
        { type: 'guess', content: csvData.guessCsv }
      ]
    };

    uploadData.mutate(payload);
  };

  switch (uploadState) {
    case 'initial':
      return (
        <div className="flex flex-col items-center justify-center gap-4 p-6">
          <p className="text-lg">Thank you for participating! Please click the button below to submit your data.</p>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Submit Data
          </button>
        </div>
      );

    case 'uploading':
      return (
        <div className="flex flex-col items-center justify-center gap-4 p-6">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg">Uploading your data...</p>
        </div>
      );

    case 'success':
      return (
        <div className="flex flex-col items-center justify-center gap-4 p-6 text-green-600">
          <svg 
            className="w-12 h-12" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
          <p className="text-lg">Thank you! Your data has been successfully submitted.</p>
        </div>
      );

    case 'error':
      return (
        <div className="flex flex-col items-center justify-center gap-4 p-6">
          <div className="text-red-500 mb-4">
            <p className="text-lg">Sorry, there was an error uploading your data.</p>
            <p>Please try again or contact the researcher.</p>
          </div>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
  }
}
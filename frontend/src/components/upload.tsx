/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useMutation } from 'react-query';
import { post } from '../utils/request';

export default function Upload({ next, data }: { next: () => void; data: object }) {
  const uploadData = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (body: any) => post('/data', body),
    onSuccess: (res: any) => {
      if(res.status === 200){
        next();
      }
    },
  });

  const upload =  uploadData.mutate;

  useEffect(() => {
    if (!data || !upload) {
      return;
    }
    
    upload({
      id: 0,
      data: data,
    });
  }, [data, upload]);

  return <>Submitting data...</>;
}

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
    
    // the anys and dependencies around these measures are ugly
    // make these more agnostic once we exit the pilot and use this in a more general setting
    upload({
      id: (data as any).id,
      measures: (data as any).measures,
      logs: (data as any).logs,
    });
  }, [data, upload]);

  return <>Submitting data...</>;
}

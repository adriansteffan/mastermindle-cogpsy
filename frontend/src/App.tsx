/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

import CheckID from './components/checkid';
import Upload from './components/upload';


export default function App() {
  const [trialCounter, setTrialCounter] = useState(0);
  const [data, setData] = useState({});

  function next(newData?: object): void {
    if (newData) {
      if ('id' in newData) {
        // data comes from the checkid trial - we could use a more generalized data model in the future
        setData({ id: newData.id, measures: [], logs: [] });
      } else if (
        'measures' in newData &&
        'measures' in data &&
        'logs' in data &&
        'logs' in newData
      ) {
        //data comes from target trial - This is a strong assumption that only works due to the limited scope of the codebase
        setData({
          ...data,
          measures: (data.measures as Array<any>).concat(newData.measures),
          logs: (data.logs as Array<any>).concat(newData.logs),
        });
      }
    }

    setTrialCounter(trialCounter + 1);
  }

  const experiment = [
    <CheckID next={next} />,
    <Upload next={next} data={data} />,
  ];

  return experiment[trialCounter];
}

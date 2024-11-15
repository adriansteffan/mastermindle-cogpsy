import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';
import { ReactQuestionFactory, Survey } from 'survey-react-ui';
import { useCallback } from 'react';

import VoiceRecorderQuestion from './voicerecorder';

import { createElement } from 'react';
ReactQuestionFactory.Instance.registerQuestion('voicerecorder', (props) => {
  return createElement(VoiceRecorderQuestion, props);
});

function Quest({ next, surveyJson }: { next: (data: object) => void; surveyJson: object }) {
  const survey = new Model(surveyJson);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const alertResults = useCallback((sender: any) => {
    next(sender.data);
  }, [next]);

  survey.onComplete.add(alertResults);
  return <Survey model={survey} />;
}

export default Quest;
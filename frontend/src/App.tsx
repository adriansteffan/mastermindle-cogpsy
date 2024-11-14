/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

import Upload from './components/upload';
import Text from './components/text';
import Quest from './components/quest';
import MasterMindleWrapper from './components/mastermindlewrapper'


function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const componentMap = {
  Text,
  Quest,
  Upload,
  MasterMindleWrapper
};

const experiment = [
  {
    name: '',
    type: 'MasterMindleWrapper',
    props: {
      blockpos: 1,
      feedback: 1,
    },
  },
  {
    name: '',
    type: 'Text',
    props: {
      buttonText: 'Start',
      content: (
        <p>
          Dear Participant,
          <br />
          Welcome to our experiment! In this study we will be investigating under which conditions
          people exert mental effort and which types of feedback can alter or encourage this. You
          will be taking part in five different blocks, each containing the same task but with
          different feedback methods in every block. You will get a detailed explanation of the type
          of feedback you will be getting before each block, however the basic task remains the
          same. THERE IS SOME CONSENTINFO MISSING
        </p>
      ),
    },
  },
  {
    name: '',
    type: 'Text',
    props: {
      buttonText: 'Next',
      content: (
        <p>
          In this experiment you will be required to guess the correct sequence of a combination of
          up to 4 colours, starting from an empty array and working with the feedback you are given.
          Within each combination to be guessed, you will be allowed to take a maximum of X guesses,
          which you will be able to verify using the “Check” button; however, there will also be a
          “Clear” button at your disposal, should you wish to discard the current colour combination
          and skip to the next one instead.
          <br />
          There will be 5 blocks with a different type of feedback each time, and each will be
          played for X minutes, once only. You should try to get as many combinations correct as
          possible in each.
        </p>
      ),
    },
  },
  ...shuffleArray([
    {
      feedbacktype: 1,
      text: (
        <p>
          If you would like to verify your guess, please press check. After pressing check, you will
          receive information on whether your guess was correct or not. Please continue and try to
          guess the correct solution if your guess was not correct. If you would like to skip the
          current combination to be guessed and instead be given a new one, please press clear.
        </p>
      ),
    },
    {
      feedbacktype: 2,
      text: (
        <p>
          If you would like to verify your guess, please press check. After pressing check, you will
          receive information on whether your guess was correct or, if not, on how many positions
          are correct and how many are incorrect. If you would like to skip the current combination
          to be guessed and instead be given a new one, please press clear.
        </p>
      ),
    },
    {
      feedbacktype: 3,
      text: (
        <p>
          If you would like to verify your guess, please press check. After pressing check, you will
          receive information on whether your guess was correct or, if not, on how many positions
          are correct (✓), how many are incorrect (X), and how many have a correct colour which is
          found in another spot (C). If you would like to skip the current combination to be guessed
          and instead be given a new one, please press clear.
        </p>
      ),
    },
    {
      feedbacktype: 4,
      text: (
        <p>
          If you would like to verify your guess, please press check. After pressing check, you will
          receive information on whether your guess was correct or, if not, which positions are
          correct (✓), how many are incorrect (X), and how many have a correct colour which is found
          in another spot (C). If you would like to skip the current combination to be guessed and
          instead be given a new one, please press clear.
        </p>
      ),
    },
    {
      feedbacktype: 5,
      text: (
        <p>
          If you would like to verify your guess, please press check. After pressing check, you will
          receive information on whether your guess was correct or, if not, which positions are
          correct (✓), which are incorrect (X), and which have a correct colour which is found in
          another spot (C). If you would like to skip the current combination to be guessed and
          instead be given a new one, please press clear.
        </p>
      ),
    },
  ]).flatMap((block, blockindex) => [
    {
      name: '',
      type: 'Text',
      props: {
        buttonText: 'Start',
        content: block.text,
      },
    },
    {
      name: '',
      type: 'MasterMindleWrapper',
      props: {
        blockpos: `${blockindex}`,
        feedback: block.feedbacktype,
      },
    },
    {
      name: '',
      type: 'Quest',
      props: {
        surveyJson: {
          pages: [
            {
              elements: [
                {
                  type: 'voicerecorder',
                  name: 'userVoiceResponse',
                  title: 'Please record your verbal response to the question:',
                  isRequired: true,
                },
                {
                  type: 'rating',
                  name: 'ejoyment',
                  title: 'How much did you enjoy solving the tasks of this block?',
                  isRequired: true,
                  rateValues: [
                    { value: 1, text: 'Not at all' },
                    { value: 2, text: 'Minimally' },
                    { value: 3, text: 'Slightly' },
                    { value: 4, text: 'Moderately' },
                    { value: 5, text: 'Very' },
                    { value: 6, text: 'Extremely' },
                  ],
                  minRateDescription: 'Not at all',
                  maxRateDescription: 'Extremely',
                },
                {
                  type: 'rating',
                  name: 'valence of effort',
                  title: 'How positive or negative did you perceive your exerted effort to be?',
                  isRequired: true,
                  rateValues: [
                    { value: 1, text: 'There' },
                    { value: 2, text: 'is' },
                    { value: 3, text: 'no' },
                    { value: 4, text: 'scale' },
                  ],
                  minRateDescription: 'Oh',
                  maxRateDescription: 'no',
                },
                {
                  type: 'voicerecorder',
                  name: 'senseofeffort',
                  title:
                    'Please describe how would design a question targetted at extracting: Sense of effort, qualitative question',
                  isRequired: true,
                },
                {
                  type: 'voicerecorder',
                  name: 'strategy usage',
                  title: 'what strategy did you use the most in this block?',
                  isRequired: true,
                },
                {
                  type: 'rating',
                  name: 'effortsu',
                  title: 'How effortful was the usage of this strategy?',
                  isRequired: true,
                  rateValues: [
                    { value: 1, text: 'Not at all' },
                    { value: 2, text: 'Minimally' },
                    { value: 3, text: 'Slightly' },
                    { value: 4, text: 'Moderately' },
                    { value: 5, text: 'Very' },
                    { value: 6, text: 'Extremely' },
                  ],
                  minRateDescription: 'Not at all',
                  maxRateDescription: 'Extremely',
                },
                {
                  type: 'rating',
                  name: 'helpfulsu',
                  title: 'How helpful was the usage of this strategy to find the correct order?',
                  isRequired: true,
                  rateValues: [
                    { value: 1, text: 'Not at all' },
                    { value: 2, text: 'Minimally' },
                    { value: 3, text: 'Slightly' },
                    { value: 4, text: 'Moderately' },
                    { value: 5, text: 'Very' },
                    { value: 6, text: 'Extremely' },
                  ],
                  minRateDescription: 'Not at all',
                  maxRateDescription: 'Extremely',
                },
                {
                  type: 'rating',
                  name: 'boredom',
                  title:
                    'Are you bored of this unifnished questionaire? Would it be more fun if all questions were already there?',
                  isRequired: true,
                  rateValues: [
                    { value: 1, text: 'Yes' },
                    { value: 2, text: 'No' },
                  ],
                  minRateDescription: 'Yes',
                  maxRateDescription: 'No',
                },
                {
                  type: 'voicerecorder',
                  name: 'continue',
                  title:
                    'What made you continue with the trials you solved or reached the maximum number of guesses?',
                  isRequired: true,
                },
              ],
            },
          ],
        },
      },
    },
  ]),
  {
    name: '',
    type: 'Quest',
    props: {
      surveyJson: {
        pages: [
          {
            elements: [
              {
                type: 'rating',
                name: 'cognionscale',
                title:
                  'How sad are you that there the cognition scale of this study is still missing? (TODO)',
                isRequired: true,
                rateValues: [
                  { value: 1, text: 'Not at all' },
                  { value: 2, text: 'Slightly' },
                  { value: 3, text: 'Moderately' },
                  { value: 4, text: 'Very' },
                  { value: 5, text: 'Extremely' },
                ],
                minRateDescription: 'Not at all',
                maxRateDescription: 'Extremely',
              },
              {
                type: 'imagepicker',
                name: 'choosePicture',
                title: 'If you could continue playing the game, which option would you choose?',
                isRequired: true,
                imageWidth: 200,
                imageHeight: 150,
                showLabel: true,
                choices: [
                  {
                    value: 'happy',
                    imageLink: '/api/placeholder/200/150',
                    text: 'Happy',
                  },
                  {
                    value: 'neutral',
                    imageLink: '/api/placeholder/200/150',
                    text: 'Neutral',
                  },
                  {
                    value: 'tired',
                    imageLink: '/api/placeholder/200/150',
                    text: 'Tired',
                  },
                  {
                    value: 'excited',
                    imageLink: '/api/placeholder/200/150',
                    text: 'Excited',
                  },
                ],
              },
              {
                type: 'voicerecorder',
                name: 'userVoiceResponse',
                title: 'Why did you choose this option?',
                isRequired: true,
              },
            ],
          },
        ],
      },
    },
  },
  {
    name: '',
    type: 'Upload',
  },
];


console.log(experiment)

// Function to transform experiment definition into components
const transformExperiment = (
  experimentDef: Array<{
    name: string;
    type: keyof typeof componentMap;
    props?: Record<string, any>;
  }>,
  next: (data: any) => void,
  data: any,
) => {
  return experimentDef.map((def, index) => {
    const Component = componentMap[def.type];

    return (
      // no type definitions for trial types at the moment, that will be a feature if we ever make this into a jspsych alternative
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      <Component
        {...{
          key: index,
          next,
          data,
          ...def.props,
        }}
      />
    );
  });
};

export default function App() {
  const [trialCounter, setTrialCounter] = useState(0);
  const [data, setData] = useState({});

  function next(newData?: object): void {
    if (newData) {
      setData({
        ...data,
        newData,
      });
    }

    setTrialCounter(trialCounter + 1);
  }

  // no type definitions for trial types at the moment, that will be a feature if we ever make this into a jspsych alternative
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  return transformExperiment(experiment, next, data)[trialCounter];
}

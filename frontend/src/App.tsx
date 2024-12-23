/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';

import Upload from './components/upload';
import Text from './components/text';
import Quest from './components/quest';
import MasterMindleWrapper from './components/mastermindlewrapper';
import MicrophoneCheck from './components/microphonecheck';
import { now } from './utils/timing';

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
  MicrophoneCheck,
  MasterMindleWrapper,
};

const experiment = [
  {
    name: 'introtext',
    type: 'Text',
    props: {
      buttonText: "Let's Begin",
      animate: true,
      content: (
        <>
          <h1 className='text-4xl'>
            <strong>Welcome to our experiment!</strong>
          </h1>
          <br />
          In this study we will be investigating under which conditions people exert mental effort
          and which types of feedback can alter or encourage this. You will be taking part in three
          different variations of a game, each containing the same task but with different feedback
          methods. You will get a detailed explanation of the type of feedback you will be getting
          before each block, however the basic task remains the same. <br />
        </>
      ),
    },
  },
  {
    name: 'consent',
    type: 'Text',
    props: {
      buttonText: 'Accept',
      animate: true,
      content: (
        <>
          <h1 className='text-4xl'>
            <strong>Participant Information</strong>
          </h1>
          This study is part of a scientific research project conducted by the Chair of
          Computational Psychology at LMU Munich. Your decision to complete this study is voluntary.
          We will only have access to your Prolific ID and no other information to identify you. The
          only other information we will have, in addition to your response, is the time at which
          you completed the survey and the amount of time you spent to complete it. The results of
          the research may be presented at scientific meetings or published in scientific journals.
          Clicking on the 'Accept' button on the bottom of this page indicates that you are at least
          18 years of age, and agree to complete this study voluntarily.
          <br />
        </>
      ),
    },
  },
  {
    name: 'miccheck',
    type: 'MicrophoneCheck',
  },
  {
    name: 'explanationtext',
    type: 'Text',
    props: {
      buttonText: 'Continue',
      content: (
        <>
          <h1 className='text-3xl'>
            <strong>How to play:</strong>
          </h1>

          <p>
            In each round of this game you will try to guess the correct 4-color-code, starting from
            an empty array and working with the feedback you are given after each guess. To assemble
            a guess, choose a color on the right and then click the empty spots in the middle of the
            board (each color can be used multiple times). Each game round has a specific code to be
            guessed and you will be allowed to take a maximum of 10 guesses, which you will be able
            to verify using the “CHECK” button; however, there will also be a “SKIP” button
            available, should you wish to forfeit the current secret colour code and continue the
            game with another one.
            <br />
            <br />
            The 3 versions of the game will all have different feedback mechanisms. Try to get as
            many combinations correct as possible.
          </p>
        </>
      ),
    },
  },
  ...shuffleArray([
    {
      feedbacktype: 1,
      timeLimit: 150,
      text: (
        <>
          <h1 className='text-4xl mb-8'>
            <strong>Get ready!</strong>
          </h1>
          <p>
            You will play this next round for 2 1/2 minutes. Remember, to verify your guess, press
            "Check". You will then receive feedback on whether your guess was{' '}
            <strong>correct (✓) or not (X)</strong>. For example:
          </p>
          <img className='my-10 w-96 mx-auto' src='/1.png' />
          <p>
            Please continue and try to guess the correct
            solution if your guess was not correct. If you would like to skip the current color code
            to be guessed and instead be given a new one, please press "Skip". Press "Start" to get begin this round.
          </p>
        </>
      ),
    },
    {
      feedbacktype: 3,
      timeLimit: 300,
      text: (
        <>
          <h1 className='text-4xl mb-8'>
            <strong>Get ready!</strong> <br />
          </h1>
          <p>
            You will play this next round for 5 minutes. Remember, to verify your guess, press
            "Check". You will then receive feedback on whether your guess was correct or, if not, on
            how many positions are correct (✓), how many are incorrect (X), and how many different
            colors should be placed in another spot (C). For example:
          </p>
          <img className='my-10 w-96 mx-auto' src='/3.png' />
          <p>
            If you would like to skip the current color code to be guessed and instead be given a
            new one, please press "Skip". Press "Start" to get begin this round.
          </p>
        </>
      ),
    },
    {
      feedbacktype: 5,
      timeLimit: 300,
      text: (
        <>
          <h1 className='text-4xl mb-8'>
            <strong>Get ready!</strong>
          </h1>
          <p>
            You will play this next round for 5 minutes. Remember, to verify your guess, press
            "Check". You will then receive feedback on whether your guess was correct or, if not,
            which positions are correct (✓), which are incorrect (X), and which have a correct
            colour which is found in another spot (C). For example:
          </p>
          <img className='my-10 w-96 mx-auto' src='/5.png' />
          <p>
            If you would like to skip the current color code to be guessed and instead be given a
            new one, please press "Skip". Press "Start" to get begin this round.
          </p>
        </>
      ),
    },
  ]).flatMap((block, blockindex) => [
    {
      name: `blocktype${block.feedbacktype}_blockindex${blockindex}_text`,
      type: 'Text',
      props: {
        buttonText: 'Start',
        content: block.text,
      },
    },
    {
      name: `blocktype${block.feedbacktype}_blockindex${blockindex}_mastermindle`,
      type: 'MasterMindleWrapper',
      props: {
        blockIndex: `${blockindex}`,
        feedback: block.feedbacktype,
        timeLimit: block.timeLimit,
        timeCountUp: true,
        maxGuesses: 10,
      },
    },
    {
      name: `blocktype${block.feedbacktype}_blockindex${blockindex}_survey1`,
      type: 'Quest',
      props: {
        surveyJson: {
          pages: [
            {
              elements: [
                {
                  type: 'rating',
                  name: 'enjoyment',
                  title:
                    'Game completed! How much did you enjoy solving the tasks with this feedback variant?',
                  isRequired: true,
                  rateMin: 1,
                  rateMax: 6,
                  minRateDescription: 'Not at all',
                  maxRateDescription: 'Extremely',
                },
                {
                  type: 'rating',
                  name: 'valenceofeffort',
                  title: 'How did you perceive your exerted effort to be?',
                  isRequired: true,
                  rateMin: 1,
                  rateMax: 6,
                  minRateDescription: 'Aversive',
                  maxRateDescription: 'Enjoyable',
                },
                {
                  type: 'rating',
                  name: 'intensity',
                  title: 'How hard did you try to solve the combinations in this block?',
                  isRequired: true,
                  rateMin: 1,
                  rateMax: 6,
                  minRateDescription: 'Not hard at all',
                  maxRateDescription: 'Extremely hard',
                },
                {
                  type: 'rating',
                  name: 'boredom',
                  title: 'How boring did you find the combinations in this block to solve?',
                  isRequired: true,
                  rateMin: 1,
                  rateMax: 6,
                  minRateDescription: 'Not boring at all',
                  maxRateDescription: 'Extremely boring',
                },
              ],
            },
          ],
        },
      },
    },
    {
      name: `blocktype${block.feedbacktype}_blockindex${blockindex}_survey2`,
      type: 'Quest',
      props: {
        surveyJson: {
          pages: [
            {
              elements: [
                {
                  type: 'rating',
                  name: 'usefulsu',
                  title:
                    'How useful did you perceive the strategies you used in this block to find the right combination to be?',
                  isRequired: true,
                  rateMin: 1,
                  rateMax: 6,
                  minRateDescription: 'Not at all',
                  maxRateDescription: 'Very much',
                },
                {
                  type: 'rating',
                  name: 'effortsu',
                  title:
                    'How effortful did you perceive the strategies you used in this block to be?',
                  isRequired: true,
                  rateMin: 1,
                  rateMax: 6,
                  minRateDescription: 'Not at all',
                  maxRateDescription: 'Very much',
                },
                {
                  type: 'rating',
                  name: 'timeconsumingsu',
                  title:
                    'How time-consuming did you perceive the strategies you used in this block to be?',
                  isRequired: true,
                  rateMin: 1,
                  rateMax: 6,
                  minRateDescription: 'Not at all',
                  maxRateDescription: 'Very much',
                },
              ],
            },
          ],
        },
      },
    },
    {
      name: `blocktype${block.feedbacktype}_blockindex${blockindex}_survey3`,
      type: 'Quest',
      props: {
        surveyJson: {
          pages: [
            {
              elements: [
                {
                  type: 'radiogroup',
                  name: 'timeupyesno',
                  title: 'When time was up, did you choose to keep solving the task?',
                  choices: ['Yes', 'No'],
                  isRequired: true,
                },
                {
                  type: 'voicerecorder',
                  name: 'whatmadecontinue',
                  visibleIf: '{timeupyesno} == Yes',
                  requiredIf: '{timeupyesno} == Yes',
                  title: 'If yes, why?',
                },
              ],
            },
          ],
        },
      },
    },
  ]),
  {
    name: 'exitsurvey1',
    type: 'Quest',
    props: {
      surveyJson: {
        pages: [
          {
            elements: [
              {
                // self made matrix because the provided one is trash
                type: 'panel',
                name: 'ncs_6',
                title:
                  'For each sentence below, please select how uncharacteristic or characteristic this is for you personally.',

                elements: [
                  {
                    value: 'complex_problems',
                    text: 'I would prefer complex to simple problems.',
                  },
                  {
                    value: 'thinking_responsibility',
                    text: 'I like to have the responsibility of handling a situation that requires a lot of thinking.',
                  },
                  {
                    value: 'thinking_fun_r',
                    text: 'Thinking is not my idea of fun.',
                  },
                  {
                    value: 'little_thought_r',
                    text: 'I would rather do something that requires little thought than something that is sure to challenge my thinking abilities.',
                  },
                  {
                    value: 'new_solutions',
                    text: 'I really enjoy a task that involves coming up with new solutions to problems.',
                  },
                  {
                    value: 'intellectual_task',
                    text: 'I would prefer a task that is intellectual, difficult, and important to one that is somewhat important but does not require much thought.',
                  },
                ].map((row) => ({
                  type: 'rating',
                  name: `ncs_6_${row.value}`,
                  title: row.text,
                  isRequired: true,
                  rateMin: 1,
                  rateMax: 5,
                  minRateDescription: 'Extremely uncharacteristic',
                  maxRateDescription: 'Extremely characteristic',
                })),
              },
            ],
          },
        ],
      },
    },
  },
  {
    name: 'exitsurvey2',
    type: 'Quest',
    props: {
      surveyJson: {
        pages: [
          {
            elements: [
              {
                type: 'imagepicker',
                name: 'choosefeedback',
                title:
                  'If you could continue playing the game, which feedback option would you choose?',
                isRequired: true,
                imageWidth: 200,
                imageHeight: 150,
                showLabel: true,
                choices: [
                  {
                    value: '1',
                    imageLink: '/1.png',
                    text: 'A',
                  },
                  {
                    value: '3',
                    imageLink: '/3.png',
                    text: 'B',
                  },
                  {
                    value: '5',
                    imageLink: '/5.png',
                    text: 'C',
                  },
                ],
              },
              {
                type: 'voicerecorder',
                name: 'whychoosefeedback',
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
    name: 'upload',
    type: 'Upload',
  },
  {
    name: 'thankyoutext',
    type: 'Text',
    props: {
      buttonText: '',
      content: (
        <div className='flex flex-col items-center'>
          <svg className='w-12 h-12' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
          <p className='text-center'>
            Thank you! Your data has been successfully submitted. <br /> You can go back to Prolific and enter the code {import.meta.env.VITE_PROLIFIC_CODE} to finish the study. Alternatively, you can click on this link: <a target="_blank" className="text-blue-400" href={`https://app.prolific.com/submissions/complete?cc=${import.meta.env.VITE_PROLIFIC_CODE}`}>Go to Prolific</a>
          </p>
        </div>
      ),
    },
  },
];

// Function to transform experiment definition into components
const transformExperiment = (
  experimentDef: Array<{
    name: string;
    type: keyof typeof componentMap;
    props?: Record<string, any>;
  }>,
  next: (data: any) => void,
  data: any,
  progress: number,
) => {
  return experimentDef.map((def, index) => {
    const Component = componentMap[def.type];

    return (
      <div className='px-4 w-screen'>
        <div className='mt-4 sm:mt-12 max-w-2xl mx-auto flex-1 h-6 bg-gray-200 rounded-full overflow-hidden'>
          <div
            className={`h-full bg-gray-200 rounded-full duration-300 ${progress > 0 ? ' border-black border-2' : ''}`}
            style={{
              width: `${progress * 100}%`,
              backgroundImage: `repeating-linear-gradient(
                  -45deg,
                  #E5E7EB,
                  #E5E7EB 10px,
                  #D1D5DB 10px,
                  #D1D5DB 20px
                )`,
              transition: 'width 300ms',
            }}
          />
        </div>
        {/* no type definitions for trial types at the moment, that will be a feature if we ever make this into a jspsych alternative */}
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/* @ts-ignore */}
        <Component
          {...{
            key: index,
            next,
            data,
            ...def.props,
          }}
        />
      </div>
    );
  });
};

interface TrialData {
  index: number;
  type: string;
  name: string;
  data: object | undefined;
  start: number;
  end: number;
  duration: number;
}

export default function App() {
  const [trialCounter, setTrialCounter] = useState(0);
  const [data, setData] = useState<TrialData[]>([]);
  const trialStartTimeRef = useRef(now());

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [trialCounter]);

  function next(newData?: object): void {
    const currentTime = now();

    // Get the current trial information from the experiment
    // no type definitions for trial types at the moment, that will be a feature if we ever make this into a jspsych alternative
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const currentTrial: ExperimentTrial = experiment[trialCounter];

    if (currentTrial && data) {
      const trialData: TrialData = {
        index: trialCounter,
        type: currentTrial.type,
        name: currentTrial.name,
        data: newData,
        start: trialStartTimeRef.current,
        end: currentTime,
        duration: currentTime - trialStartTimeRef.current,
      };
      setData([...data, trialData]);
    }

    // Set the start time for the next trial
    trialStartTimeRef.current = currentTime;
    setTrialCounter(trialCounter + 1);
  }

  // no type definitions for trial types at the moment, that will be a feature if we ever make this into a jspsych alternative
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  return transformExperiment(experiment, next, data, trialCounter / (experiment.length - 1))[
    trialCounter
  ];
}

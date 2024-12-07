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
          and which types of feedback can alter or encourage this. You will be taking part in five
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
      buttonText: "Accept (It's Moby Dick)",
      animate: true,
      content: (
        <>
          <h1 className='text-4xl'>
            <strong>Participant Information</strong>
          </h1>
          <br />I think there is supposed to be a consent screen here, but Chris did not send me
          anything yet, so... 10 points to whoever can tell me where this is from: Call me Ishmael.
          Some years ago—never mind how long precisely—having little or no money in my purse, and
          nothing particular to interest me on shore, I thought I would sail about a little and see
          the watery part of the world. It is a way I have of driving off the spleen and regulating
          the circulation. Whenever I find myself growing grim about the mouth; whenever it is a
          damp, drizzly November in my soul; whenever I find myself involuntarily pausing before
          coffin warehouses, and bringing up the rear of every funeral I meet; and especially
          whenever my hypos get such an upper hand of me, that it requires a strong moral principle
          to prevent me from deliberately stepping into the street, and methodically knocking
          people’s hats off—then, I account it high time to get to sea as soon as I can. This is my
          substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his
          sword; I quietly take to the ship. There is nothing surprising in this. If they but knew
          it, almost all men in their degree, some time or other, cherish very nearly the same
          feelings towards the ocean with me. There now is your insular city of the Manhattoes,
          belted round by wharves as Indian isles by coral reefs—commerce surrounds it with her
          surf. Right and left, the streets take you waterward. Its extreme downtown is the battery,
          where that noble mole is washed by waves, and cooled by breezes, which a few hours
          previous were out of sight of land. Look at the crowds of water-gazers there.
          Circumambulate the city of a dreamy Sabbath afternoon. Go from Corlears Hook to Coenties
          Slip, and from thence, by Whitehall, northward. What do you see?—Posted like silent
          sentinels all around the town, stand thousands upon thousands of mortal men fixed in ocean
          reveries. Some leaning against the spiles; some seated upon the pier-heads; some looking
          over the bulwarks of ships from China; some high aloft in the rigging, as if striving to
          get a still better seaward peep. But these are all landsmen; of week days pent up in lath
          and plaster—tied to counters, nailed to benches, clinched to desks. How then is this? Are
          the green fields gone? What do they here? But look! here come more crowds, pacing straight
          for the water, and seemingly bound for a dive. Strange! Nothing will content them but the
          extremest limit of the land; loitering under the shady lee of yonder warehouses will not
          suffice. No. They must get just as nigh the water as they possibly can without falling in.
          And there they stand—miles of them—leagues. Inlanders all, they come from lanes and
          alleys, streets and avenues—north, east, south, and west. Yet here they all unite. Tell
          me, does the magnetic virtue of the needles of the compasses of all those ships attract
          them thither? Once more. Say you are in the country; in some high land of lakes. Take
          almost any path you please, and ten to one it carries you down in a dale, and leaves you
          there by a pool in the stream. There is magic in it. Let the most absent-minded of men be
          plunged in his deepest reveries—stand that man on his legs, set his feet a-going, and he
          will infallibly lead you to water, if water there be in all that region. Should you ever
          be athirst in the great American desert, try this experiment, if your caravan happen to be
          supplied with a metaphysical professor. Yes, as every one knows, meditation and water are
          wedded for ever. But here is an artist. He desires to paint you the dreamiest, shadiest,
          quietest, most enchanting bit of romantic landscape in all the valley of the Saco. What is
          the chief element he employs? There stand his trees, each with a hollow trunk, as if a
          hermit and a crucifix were within; and here sleeps his meadow, and there sleep his cattle;
          and up from yonder cottage goes a sleepy smoke. Deep into distant woodlands winds a mazy
          way, reaching to overlapping spurs of mountains bathed in their hill-side blue. But though
          the picture lies thus tranced, and though this pine-tree shakes down its sighs like leaves
          upon this shepherd’s head, yet all were vain, unless the shepherd’s eye were fixed upon
          the magic stream before him. Go visit the Prairies in June, when for scores on scores of
          miles you wade knee-deep among Tiger-lilies—what is the one charm wanting?—Water—there is
          not a drop of water there! Were Niagara but a cataract of sand, would you travel your
          thousand miles to see it? Why did the poor poet of Tennessee, upon suddenly receiving two
          handfuls of silver, deliberate whether to buy him a coat, which he sadly needed, or invest
          his money in a pedestrian trip to Rockaway Beach? Why is almost every robust healthy boy
          with a robust healthy soul in him, at some time or other crazy to go to sea? Why upon your
          first voyage as a passenger, did you yourself feel such a mystical vibration, when first
          told that you and your ship were now out of sight of land? Why did the old Persians hold
          the sea holy? Why did the Greeks give it a separate deity, and own brother of Jove? Surely
          all this is not without meaning. And still deeper the meaning of that story of Narcissus,
          who because he could not grasp the tormenting, mild image he saw in the fountain, plunged
          into it and was drowned. But that same image, we ourselves see in all rivers and oceans.
          It is the image of the ungraspable phantom of life; and this is the key to it all. Now,
          when I say that I am in the habit of going to sea whenever I begin to grow hazy about the
          eyes, and begin to be over conscious of my lungs, I do not mean to have it inferred that I
          ever go to sea as a passenger. For to go as a passenger you must needs have a purse, and a
          purse is but a rag unless you have something in it. Besides, passengers get sea-sick—grow
          quarrelsome—don’t sleep of nights—do not enjoy themselves much, as a general thing;—no, I
          never go as a passenger; nor, though I am something of a salt, do I ever go to sea as a
          Commodore, or a Captain, or a Cook. I abandon the glory and distinction of such offices to
          those who like them. For my part, I abominate all honorable respectable toils, trials, and
          tribulations of every kind whatsoever. It is quite as much as I can do to take care of
          myself, without taking care of ships, barques, brigs, schooners, and what not. And as for
          going as cook,—though I confess there is considerable glory in that, a cook being a sort
          of officer on ship-board—yet, somehow, I never fancied broiling fowls;—though once
          broiled, judiciously buttered, and judgmatically salted and peppered, there is no one who
          will speak more respectfully, not to say reverentially, of a broiled fowl than I will. It
          is out of the idolatrous dotings of the old Egyptians upon broiled ibis and roasted river
          horse, that you see the mummies of those creatures in their huge bake-houses the pyramids.
          No, when I go to sea, I go as a simple sailor, right before the mast, plumb down into the
          forecastle, aloft there to the royal mast-head. True, they rather order me about some, and
          make me jump from spar to spar, like a grasshopper in a May meadow. And at first, this
          sort of thing is unpleasant enough. It touches one’s sense of honor, particularly if you
          come of an old established family in the land, the Van Rensselaers, or Randolphs, or
          Hardicanutes. And more than all, if just previous to putting your hand into the tar-pot,
          you have been lording it as a country schoolmaster, making the tallest boys stand in awe
          of you. The transition is a keen one, I assure you, from a schoolmaster to a sailor, and
          requires a strong decoction of Seneca and the Stoics to enable you to grin and bear it.
          But even this wears off in time. What of it, if some old hunks of a sea-captain orders me
          to get a broom and sweep down the decks? What does that indignity amount to, weighed, I
          mean, in the scales of the New Testament? Do you think the archangel Gabriel thinks
          anything the less of me, because I promptly and respectfully obey that old hunks in that
          particular instance? Who ain’t a slave? Tell me that. Well, then, however the old
          sea-captains may order me about—however they may thump and punch me about, I have the
          satisfaction of knowing that it is all right; that everybody else is one way or other
          served in much the same way—either in a physical or metaphysical point of view, that is;
          and so the universal thump is passed round, and all hands should rub each other’s
          shoulder-blades, and be content. Again, I always go to sea as a sailor, because they make
          a point of paying me for my trouble, whereas they never pay passengers a single penny that
          I ever heard of. On the contrary, passengers themselves must pay. And there is all the
          difference in the world between paying and being paid. The act of paying is perhaps the
          most uncomfortable infliction that the two orchard thieves entailed upon us. But being
          paid,—what will compare with it? The urbane activity with which a man receives money is
          really marvellous, considering that we so earnestly believe money to be the root of all
          earthly ills, and that on no account can a monied man enter heaven. Ah! how cheerfully we
          consign ourselves to perdition! Finally, I always go to sea as a sailor, because of the
          wholesome exercise and pure air of the fore-castle deck. For as in this world, head winds
          are far more prevalent than winds from astern (that is, if you never violate the
          Pythagorean maxim), so for the most part the Commodore on the quarter-deck gets his
          atmosphere at second hand from the sailors on the forecastle. He thinks he breathes it
          first; but not so. In much the same way do the commonalty lead their leaders in many other
          things, at the same time that the leaders little suspect it. But wherefore it was that
          after having repeatedly smelt the sea as a merchant sailor, I should now take it into my
          head to go on a whaling voyage; this the invisible police officer of the Fates, who has
          the constant surveillance of me, and secretly dogs me, and influences me in some
          unaccountable way—he can better answer than any one else. And, doubtless, my going on this
          whaling voyage, formed part of the grand programme of Providence that was drawn up a long
          time ago. It came in as a sort of brief interlude and solo between more extensive
          performances. I take it that this part of the bill must have run something like this:
          “Grand Contested Election for the Presidency of the United States. “WHALING VOYAGE BY ONE
          ISHMAEL. “BLOODY BATTLE IN AFFGHANISTAN.” Though I cannot tell why it was exactly that
          those stage managers, the Fates, put me down for this shabby part of a whaling voyage,
          when others were set down for magnificent parts in high tragedies, and short and easy
          parts in genteel comedies, and jolly parts in farces—though I cannot tell why this was
          exactly; yet, now that I recall all the circumstances, I think I can see a little into the
          springs and motives which being cunningly presented to me under various disguises, induced
          me to set about performing the part I did, besides cajoling me into the delusion that it
          was a choice resulting from my own unbiased freewill and discriminating judgment. Chief
          among these motives was the overwhelming idea of the great whale himself. Such a
          portentous and mysterious monster roused all my curiosity. Then the wild and distant seas
          where he rolled his island bulk; the undeliverable, nameless perils of the whale; these,
          with all the attending marvels of a thousand Patagonian sights and sounds, helped to sway
          me to my wish. With other men, perhaps, such things would not have been inducements; but
          as for me, I am tormented with an everlasting itch for things remote. I love to sail
          forbidden seas, and land on barbarous coasts. Not ignoring what is good, I am quick to
          perceive a horror, and could still be social with it—would they let me—since it is but
          well to be on friendly terms with all the inmates of the place one lodges in. By reason of
          these things, then, the whaling voyage was welcome; the great flood-gates of the
          wonder-world swung open, and in the wild conceits that swayed me to my purpose, two and
          two there floated into my inmost soul, endless processions of the whale, and, mid most of
          them all, one grand hooded phantom, like a snow hill in the air.
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
            The 5 versions of the game will all have different feedback mechanisms. Try to get as many combinations correct as possible.
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
            You will play this next round for 2 1/2 minutes. Remember, to verify your guess, press "Check". You will then receive feedback on whether
            your guess was correct or not. Please continue and try to guess the correct solution if
            your guess was not correct. If you would like to skip the current color code to be
            guessed and instead be given a new one, please press "Skip".
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
            You will play this next round for 5 minutes. Remember, to verify your guess, press "Check". You will then receive feedback on whether
            your guess was correct or, if not, on how many positions are correct (✓), how many are
            incorrect (X), and how many different colors should be placed in another spot (C). If
            you would like to skip the current color code to be guessed and instead be given a new
            one, please press "Skip".
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
            You will play this next round for 5 minutes.  Remember, to verify your guess, press "Check". You will then receive feedback on whether
            your guess was correct or, if not, which positions are correct (✓), which are incorrect
            (X), and which have a correct colour which is found in another spot (C). If you would
            like to skip the current color code to be guessed and instead be given a new one, please
            press "Skip".
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
            Thank you! Your data has been successfully submitted. <br /> You can now close the
            browser tab.
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

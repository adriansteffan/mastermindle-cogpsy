import { useEffect, useRef, useState } from 'react';
import { Bounce, toast } from 'react-toastify';
import Quest from './quest';

const COLORS = {
  red: '#D81B60',
  blue: '#1E88E5',
  yellow: '#FFC107',
  green: '#01463A',
  grey: '#D4D4D4',
} as const;

type ColorKey = keyof typeof COLORS;
type Size = 8 | 10 | 12 | 14 | 16 | 20 | 24 | 28 | 32;

interface ColorOrbProps {
  color: ColorKey;
  /** Size in Tailwind units (8-32). Defaults to 12 */
  size?: Size;
  interactive?: boolean;
  pressed?: boolean;
  hoverborder?: boolean;
  onClick?: () => void;
}

type GuessResult = {
  color: ColorKey;
  status: 'correct' | 'wrong-position' | 'incorrect';
};

const ColorOrb: React.FC<ColorOrbProps> = ({
  color,
  size = 12,
  interactive = false,
  hoverborder = false,
  pressed = false,
  onClick,
}) => {
  const letter = color === 'grey' ? '?' : color[0].toUpperCase();

  const sizeClasses = {
    8: 'h-8 w-8 text-sm',
    10: 'h-10 w-10 text-base',
    12: 'h-12 w-12 text-lg',
    14: 'h-14 w-14 text-xl',
    16: 'h-16 w-16 text-xl',
    20: 'h-20 w-20 text-2xl',
    24: 'h-24 w-24 text-3xl',
    28: 'h-28 w-28 text-3xl',
    32: 'h-32 w-32 text-4xl',
  }[size];

  return (
    <div
      style={{
        backgroundColor: COLORS[color],
        color: color === 'grey' ? '#000000' : '#FFFFFF',
      }}
      className={`
        ${sizeClasses}
        rounded-full 
        flex items-center justify-center 
        font-bold
        border-2
        border-black
        
        ${interactive ? ' shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none cursor-pointer' : ''}
        ${pressed ? ' translate-x-[2px] translate-y-[2px] shadow-none' : ''}
        ${hoverborder ? ' hover:border-4 cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      {letter}
    </div>
  );
};

// to pass up to the next function
interface GuessData {
  index: number;
  colors: ColorKey[];
  results: GuessResult[];
  start: number;
  end: number;
  duration: number;
}

function MasterMindle({
  feedback,
  next,
  maxTime,
  timeLeft,
  setTimeLeft,
  setQuitLastGame,
}: {
  feedback: 1 | 2 | 3 | 4 | 5;
  next: (data: object) => void;
  maxTime: number;
  timeLeft: number;
  setTimeLeft: (time: number) => void;
  setQuitLastGame: (quit: boolean) => void;
}) {
  const [selectedColor, setSelectedColor] = useState<ColorKey | null>(null);
  const [currentGuess, setCurrentGuess] = useState<(ColorKey | null)[]>([null, null, null, null]);
  const [localTimeLeft, setLocalTimeLeft] = useState<number>(timeLeft);
  const [roundOver, setRoundOver] = useState<boolean>(false);

  const [guessStartTime, setGuessStartTime] = useState<number>(performance.now());
  const [accumulatedGuesses, setAccumulatedGuesses] = useState<GuessData[]>([]);

  const warningShownRef = useRef(false);

  useEffect(() => {
    warningShownRef.current = false;
  }, [maxTime]);

  useEffect(() => {
    const timer = setInterval(() => {
      setLocalTimeLeft((prev) => {
        const newTime = Math.max(0, prev - 1);

        if (newTime === 30 && !warningShownRef.current) {
          warningShownRef.current = true;
          toast('30 seconds remaining!', {
            position: 'top-center',
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: 'light',
            transition: Bounce,
            autoClose: 4000,
          });
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [setLocalTimeLeft]);

  const [previousGuesses, setPreviousGuesses] = useState<
    { colors: ColorKey[]; results: GuessResult[] }[]
  >([]);

  const [solution] = useState<ColorKey[]>(() => {
    const colors = Object.keys(COLORS).filter((color) => color !== 'grey') as ColorKey[];
    return Array(4)
      .fill(null)
      .map(() => colors[Math.floor(Math.random() * colors.length)]);
  });

  // Add effect to scroll to bottom when previousGuesses changes
  const guessesContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (guessesContainerRef.current) {
      guessesContainerRef.current.scrollTop = guessesContainerRef.current.scrollHeight;
    }
  }, [previousGuesses]);

  const checkGuess = (guess: ColorKey[]): GuessResult[] => {
    // Count color frequencies in solution
    const solutionColorCounts = solution.reduce(
      (counts, color) => {
        counts[color] = (counts[color] || 0) + 1;
        return counts;
      },
      {} as Record<ColorKey, number>,
    );

    // First pass: Mark correct positions
    const results: GuessResult[] = guess.map((color, i) => {
      if (color === solution[i]) {
        solutionColorCounts[color]--;
        return { color, status: 'correct' as const };
      }
      return { color, status: 'incorrect' as const };
    });

    // Second pass: Check wrong positions
    guess.forEach((color, i) => {
      if (results[i].status === 'correct') return;
      if (solutionColorCounts[color] > 0) {
        results[i] = { color, status: 'wrong-position' as const };
      }
    });

    return results;
  };

  const handleCheck = () => {
    if (currentGuess.some((color) => color === null)) {
      toast('Please complete your guess!', {
        position: 'top-center',
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });

      return;
    }

    const currentTime = performance.now();
    const guessResults = checkGuess(currentGuess as ColorKey[]);
    const isCorrect = guessResults.every((result) => result.status === 'correct');

    const guessData: GuessData = {
      index: previousGuesses.length,
      colors: currentGuess as ColorKey[],
      results: guessResults,
      start: guessStartTime,
      end: currentTime,
      duration: currentTime - guessStartTime,
    };

    setAccumulatedGuesses((prev) => [...prev, guessData]);

    setPreviousGuesses((prev) => [
      ...prev,
      {
        colors: currentGuess as ColorKey[],
        results: guessResults,
      },
    ]);

    if (isCorrect) {
      setRoundOver(true);
      return;
    }
    if (localTimeLeft == 0) {
      setRoundOver(true);
    }
    setSelectedColor(null);
    setCurrentGuess([null, null, null, null]);
    setGuessStartTime(currentTime);
  };

  const handleNext = () => {
    setTimeLeft(localTimeLeft);
    next({ solution: solution, timeLeft: timeLeft, guesses: accumulatedGuesses });
  };

  return (
    <div className='p-8 max-w-7xl mx-auto flex flex-row space-x-12 justify-between items'>
      <div className='absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]'></div>
      <div className='flex gap-6 flex flex-col'>
        {/* Action Buttons */}
        <button
          className='bg-white px-8 py-3 border-2 border-black font-bold text-lg rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'
          onClick={handleCheck}
        >
          CHECK
        </button>
        <button
          className='bg-white px-8 py-3 border-2 border-black font-bold text-lg rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'
          onClick={() => setCurrentGuess([null, null, null, null])}
        >
          CLEAR
        </button>
        {!roundOver && (
          <button
            className='bg-white px-8 py-3 border-2 border-red-500 font-bold text-red-500 text-lg rounded-full shadow-[2px_2px_0px_rgba(239,68,68,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'
            onClick={() => {
              setQuitLastGame(true);
              handleNext();
            }}
          >
            SKIP
          </button>
        )}
        {roundOver && (
          <button
            className='bg-white px-8 py-3 border-2 border-blue-500 font-bold text-blue-500 text-lg rounded-full shadow-[2px_2px_0px_rgba(59,130,246,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none'
            onClick={() => {
              handleNext();
            }}
          >
            NEXT
          </button>
        )}
      </div>

      <div className='flex justify-between'>
        <div className='space-y-8 flex-1'>
          {/* Timer and Progress */}
          <div className='flex justify-between items-center gap-6'>
            <div className='text-2xl font-bold w-20 text-left'>
              {Math.floor(localTimeLeft / 60)}:{(localTimeLeft % 60).toString().padStart(2, '0')}
            </div>
            <div className='flex-1 h-6 bg-gray-200 rounded-full overflow-hidden'>
              <div
                className={`h-full bg-gray-200 rounded-full duration-300 ${Math.ceil(localTimeLeft / 30) * 30 !== maxTime ? ' border-black border-2' : ''}`}
                style={{
                  width: `${100 - (100 * Math.ceil(localTimeLeft / 30) * 30) / maxTime}%`,
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
          </div>
          {/* Current Guess Slots */}
          <div className='p-10 rounded-lg'>
            <div className='flex gap-8 justify-center relative'>
              <div className='absolute top-1/2 left-0 right-0 h-1 bg-gray-300 -z-10' />
              {currentGuess.map((color: ColorKey | null, index: number) => (
                <ColorOrb
                  key={index}
                  color={color ?? 'grey'}
                  size={24}
                  hoverborder={selectedColor != null || (!!color && color !== 'grey')}
                  onClick={() => {
                    if (!selectedColor || selectedColor === 'grey') {
                      if (!!color && color != 'grey') {
                        setCurrentGuess((prevGuess) =>
                          prevGuess.map((color, i) => (i === index ? null : color)),
                        );
                        return;
                      }
                      toast('Please select a color first!', {
                        position: 'top-center',
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: false,
                        progress: undefined,
                        theme: 'light',
                        transition: Bounce,
                      });
                      return;
                    }

                    if (selectedColor === color) {
                      setCurrentGuess((prevGuess) =>
                        prevGuess.map((color, i) => (i === index ? null : color)),
                      );
                      return;
                    }

                    setCurrentGuess((prevGuess) =>
                      prevGuess.map((color, i) => (i === index ? selectedColor : color)),
                    );
                  }}
                />
              ))}
            </div>
          </div>

          {/* Previous Guesses */}
          <div
            ref={guessesContainerRef}
            className='space-y-6 p-16 border-gray-400 h-[500px] overflow-y-auto'
          >
            {previousGuesses.map((guess, rowNum) => (
              <div key={rowNum} className='flex items-center gap-8 justify-center'>
                <div className='w-8 text-xl'>{rowNum + 1}</div>
                <div className='flex gap-4 flex'>
                  {guess.colors.map((color, index) => (
                    <div key={index} className='flex flex-col items-center'>
                      <ColorOrb key={index} color={color} size={12} />
                      {feedback == 4 && (
                        <span>
                          {guess.results[index].status === 'correct' && '✓'}
                          {guess.results[index].status !== 'correct' && <>&nbsp;</>}
                        </span>
                      )}
                      {feedback == 5 && (
                        <span>
                          {guess.results[index].status == 'correct' && '✓'}
                          {guess.results[index].status == 'incorrect' && '✗'}
                          {guess.results[index].status == 'wrong-position' && 'C'}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <div className='flex items-center gap-4 text-lg'>
                  {feedback == 1 && (
                    <span>
                      {guess.results.filter((result) => result.status !== 'correct').length == 0 ? (
                        <span className='font-bold text-blue-600'>✓</span>
                      ) : (
                        <span className='font-bold text-red-600'>✗</span>
                      )}
                    </span>
                  )}
                  {feedback == 2 && (
                    <>
                      <span className='font-bold text-blue-600'>✓</span>
                      <span>
                        {guess.results.filter((result) => result.status === 'correct').length}
                      </span>
                      <span className='font-bold text-red-600'>✗</span>
                      <span>
                        {guess.results.filter((result) => result.status !== 'correct').length}
                      </span>
                    </>
                  )}
                  {feedback == 3 && (
                    <>
                      <span className='font-bold text-blue-600'>✓</span>
                      <span>
                        {guess.results.filter((result) => result.status === 'correct').length}
                      </span>
                      <span className='font-bold text-red-600'>✗</span>
                      <span>
                        {guess.results.filter((result) => result.status === 'incorrect').length}
                      </span>
                      <span className='font-bold'>C</span>
                      <span>
                        {
                          guess.results.filter((result) => result.status === 'wrong-position')
                            .length
                        }
                      </span>
                    </>
                  )}
                  {feedback == 4 && (
                    <>
                      <span className='font-bold text-red-600'>✗</span>
                      <span>
                        {guess.results.filter((result) => result.status === 'incorrect').length}
                      </span>
                      <span className='font-bold'>C</span>
                      <span>
                        {
                          guess.results.filter((result) => result.status === 'wrong-position')
                            .length
                        }
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Color Selection */}
      <div className='space-y-6 px-8'>
        {(Object.keys(COLORS) as ColorKey[])
          .filter((color) => color !== 'grey')
          .map((color) => (
            <div key={color} className='flex items-center gap-4'>
              <ColorOrb
                color={color}
                size={16}
                interactive={selectedColor != color}
                pressed={selectedColor == color}
                onClick={() => {
                  if (selectedColor == color) {
                    setSelectedColor(null);
                    return;
                  }
                  setSelectedColor(color);
                }}
              />
              <span
                className={`uppercase text-lg ${selectedColor == color ? 'underline underline-offset-2' : ''}`}
              >
                {color}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}

interface MMTrialData {
  type: 'game' | 'survey';
  index: number;
  start: number;
  end: number;
  duration: number;
  data: object;
  quitLastGame?: boolean;
}

function MasterMindleWrapper({
  next,
  blockpos,
  feedback,
  timeLimit = 300,
}: {
  next: (data: object) => void;
  blockpos: number;
  feedback: 1 | 2 | 3 | 4 | 5;
  timeLimit: number;
}) {
  const [gameState, setGameState] = useState<'game' | 'survey'>('game');
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [trialStartTime, setTrialStartTime] = useState(performance.now());
  const [accumulatedData, setAccumulatedData] = useState<MMTrialData[]>([]);
  const [quitLastGame, setQuitLastGame] = useState<boolean>(false);
  const [trialIndex, setTrialIndex] = useState(0);

  function switchGameState(newData: object) {
    const currentTime = performance.now();

    const trialData: MMTrialData = {
      type: gameState,
      index: trialIndex,
      start: trialStartTime,
      end: currentTime,
      duration: currentTime - trialStartTime,
      data: newData,
      ...(gameState === 'survey' && { quitLastGame }),
    };

    setAccumulatedData((prev) => [...prev, trialData]);

    if (gameState === 'survey' && timeLimit <= 0) {
      next({
        blockpos: blockpos,
        feedbacktype: feedback,
        timelimit: timeLimit,
        data: accumulatedData,
      });
      return;
    }

    if (gameState === 'survey') {
      setQuitLastGame(false);
    }

    setTrialStartTime(currentTime);
    setTrialIndex((prev) => prev + 1);
    setGameState(gameState === 'survey' ? 'game' : 'survey');
  }

  if (gameState === 'survey') {
    return (
      <Quest
        next={() => switchGameState({})}
        surveyJson={{
          pages: [
            {
              elements: [
                {
                  type: 'rating',
                  name: 'intensityOfEffort',
                  title: 'How effortful was guessing this combination for you?',
                  isRequired: true,
                  rateValues: [
                    { value: 1, text: 'Very Low' },
                    { value: 2, text: 'Low' },
                    { value: 3, text: 'Somewhat Low' },
                    { value: 4, text: 'Somewhat High' },
                    { value: 5, text: 'High' },
                    { value: 6, text: 'Very High' },
                  ],
                  minRateDescription: 'Minimal Effort',
                  maxRateDescription: 'Maximum Effort',
                },
                ...(quitLastGame
                  ? [
                      {
                        type: 'voicerecorder',
                        name: 'userVoiceResponse',
                        title: 'Why did you chose to quit before you found the solution?',
                        isRequired: true,
                      },
                    ]
                  : [{}]),
              ],
            },
          ],
        }}
      />
    );
  }
  return (
    <MasterMindle
      feedback={5}
      next={switchGameState}
      maxTime={timeLimit}
      timeLeft={timeLeft}
      setTimeLeft={setTimeLeft}
      setQuitLastGame={setQuitLastGame}
    />
  );
}

export default MasterMindleWrapper;

const COLORS = {
    red: '#D81B60',
    blue: '#1E88E5',
    yellow: '#1E88E5',
    green: '#01463A',
    grey: '#AAAAAA',
} as const;

type ColorKey = keyof typeof COLORS;

type Size = 8 | 10 | 12 | 14 | 16 | 20 | 24 | 28 | 32;

const getFontSize = (size: Size): string => {
  const sizeMap: Record<Size, string> = {
    8: 'text-sm',
    10: 'text-base',
    12: 'text-lg',
    14: 'text-xl',
    16: 'text-xl',
    20: 'text-2xl',
    24: 'text-3xl',
    28: 'text-3xl',
    32: 'text-4xl',
  };
  return sizeMap[size];
};

interface ColorOrbProps {
    color: ColorKey;
    /** Size in Tailwind units (8-32). Defaults to 12 */
    size?: Size;
}

const ColorOrb: React.FC<ColorOrbProps> = ({ 
    color, 
    size = 12
}) => {
  const letter = color === 'grey' ? '' : color[0].toUpperCase();

  return (
    <div 
      style={{
        backgroundColor: COLORS[color],
        color: color === 'grey' ? '#000000' : '#FFFFFF',
      }}
      className={`
        w-${size} h-${size}
        ${getFontSize(size)}
        rounded-full 
        flex items-center justify-center 
        font-bold
        border-2 border-opacity-20 border-black
        shadow-sm
      `}
    >
      {letter}
    </div>
  );
};

const quit = true;
const surveyJson = {
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
        ...(quit
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
};

function MasterMindle(){
    return <>
      <ColorOrb color='blue' size={20} />
      <ColorOrb color='red' size={20} />
      <ColorOrb color='yellow' size={20} />
      <ColorOrb color='grey' size={20} />
      <ColorOrb color='green' size={20} />
      
    </>
}

function AfterTrialSurvey(){

}

function MasterMindleWrapper({ next, data }: { next: () => void; data: object }) {
  console.log(data);
  console.log(surveyJson);
  console.log(MasterMindle)
  console.log(AfterTrialSurvey)
  return (
    <button onClick={next}>Skip</button>
  );
}

export default MasterMindleWrapper;

interface ProseContainerProps {
    content: React.ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
  next: (newData: object) => void;
}

const Text: React.FC<ProseContainerProps> = ({
  content,
  buttonText = "Click me",
  className = "",
  next,
}) => {
  const handleClick = () => {
    next({ timestamp: new Date().toISOString() });
  };

  return (
    <div className={`max-w-prose mx-auto ${className} mt-20`}>
      <article className="prose-lg prose-slate lg:prose-xl text-lg">
        <div className="text-slate-700 leading-relaxed">
          {content}
        </div>
      </article>
      
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleClick}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
                   transition-colors duration-200 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 
                   disabled:cursor-not-allowed"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Text;
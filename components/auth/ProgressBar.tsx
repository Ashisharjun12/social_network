'use client'

interface Stage {
  id: string;
  label: string;
  icon: string;
  description: string;
}

const stages: Stage[] = [
  { 
    id: 'username', 
    label: 'Choose Identity', 
    icon: '🎭',
    description: 'Create your anonymous persona'
  },
  { 
    id: 'avatar', 
    label: 'Avatar', 
    icon: '👤',
    description: 'Express yourself visually'
  },
  { 
    id: 'personal', 
    label: 'Basic Info', 
    icon: '📝',
    description: 'Tell us about yourself'
  },
  { 
    id: 'personality', 
    label: 'Personality', 
    icon: '✨',
    description: 'Share your unique traits'
  },
  { 
    id: 'interests', 
    label: 'Interests', 
    icon: '🎯',
    description: 'Choose your favorite topics'
  },
  { 
    id: 'recovery', 
    label: 'Security', 
    icon: '🔒',
    description: 'Keep your account safe'
  },
];

interface ProgressBarProps {
  currentStage: string;
}

export default function ProgressBar({ currentStage }: ProgressBarProps) {
  const currentIndex = stages.findIndex(stage => stage.id === currentStage);
  
  // Add safety check
  if (currentIndex === -1) return null;

  const currentStageData = stages[currentIndex];

  return (
    <div className="mb-12">
      {/* Current Stage Info */}
      <div className="text-center mb-8">
        <div className="text-primary text-sm font-medium mb-2">
          Step {currentIndex + 1} of {stages.length}
        </div>
        <h2 className="text-2xl font-bold mb-2">
          {currentStageData.label}
        </h2>
        <p className="text-gray-400 text-sm">
          {currentStageData.description}
        </p>
      </div>

      {/* Progress Steps */}
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-700">
          <div 
            className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
            style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {stages.map((stage, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = stage.id === currentStage;
            
            return (
              <div 
                key={stage.id}
                className={`flex flex-col items-center ${
                  index <= currentIndex ? 'text-primary' : 'text-gray-500'
                }`}
              >
                <div 
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-300 mb-2
                    ${isCompleted ? 'bg-primary text-white scale-90' : 
                      isCurrent ? 'bg-primary/20 text-primary border-2 border-primary scale-110' : 
                      'bg-gray-800 text-gray-500 border-2 border-gray-700'}
                  `}
                >
                  {isCompleted ? '✓' : stage.icon}
                </div>
                <span className={`text-xs font-medium ${isCurrent ? 'text-white' : ''}`}>
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 
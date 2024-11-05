'use client'
import { motion } from 'framer-motion'

interface PersonalityStageProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function PersonalityStage({ formData, setFormData }: PersonalityStageProps) {
  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [field]: value
      }
    });
  };

  const personalities = [
    { type: 'introvert', icon: '🤔', description: 'Prefer quiet, solitary activities' },
    { type: 'extrovert', icon: '🎉', description: 'Energized by social interactions' },
    { type: 'ambivert', icon: '🤝', description: 'Balance of both worlds' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          ✨ Your Personality
        </motion.div>
        <h3 className="text-2xl font-bold mb-2">What's your vibe?</h3>
        <p className="text-gray-400">Help us match you with like-minded people</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Choose your personality type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {personalities.map((type, index) => (
              <motion.button
                key={type.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                type="button"
                onClick={() => handleChange('personality', type.type)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.personalInfo.personality === type.type
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-700 hover:border-primary/50'
                }`}
              >
                <div className="text-2xl mb-2">{type.icon}</div>
                <div className="text-sm capitalize font-medium mb-1">{type.type}</div>
                <div className="text-xs text-gray-400">{type.description}</div>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            What's your field/profession?
          </label>
          <input
            type="text"
            required
            placeholder="e.g., Computer Science Student"
            className="form-input"
            value={formData.personalInfo.profession}
            onChange={(e) => handleChange('profession', e.target.value)}
          />
        </motion.div>
      </div>
    </motion.div>
  );
} 
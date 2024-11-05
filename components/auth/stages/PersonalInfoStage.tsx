'use client'
import { motion } from 'framer-motion'

interface PersonalInfoStageProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function PersonalInfoStage({ formData, setFormData }: PersonalInfoStageProps) {
  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [field]: value
      }
    });
  };

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
          📝 Basic Details
        </motion.div>
        <h3 className="text-2xl font-bold mb-2">Tell us about yourself</h3>
        <p className="text-gray-400">This helps us personalize your experience</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-medium text-gray-300">Age</label>
          <input
            type="number"
            min="13"
            max="100"
            required
            className="form-input"
            value={formData.personalInfo.age}
            onChange={(e) => handleChange('age', e.target.value)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-medium text-gray-300">Gender</label>
          <select
            required
            className="form-select"
            value={formData.personalInfo.gender}
            onChange={(e) => handleChange('gender', e.target.value)}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </motion.div>
      </div>
    </motion.div>
  );
} 
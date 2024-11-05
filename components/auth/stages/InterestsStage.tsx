'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface InterestsStageProps {
  formData: any;
  setFormData: (data: any) => void;
}

const interestCategories = [
  {
    name: 'Entertainment',
    icon: '🎮',
    interests: [
      { id: 'memes', icon: '😂', label: 'Memes & Humor' },
      { id: 'videos', icon: '🎥', label: 'Videos' },
      { id: 'music', icon: '🎵', label: 'Music' },
      { id: 'movies', icon: '🍿', label: 'Movies & TV' },
      { id: 'gaming', icon: '🎮', label: 'Gaming' }
    ]
  },
  {
    name: 'College Life',
    icon: '🎓',
    interests: [
      { id: 'campus_life', icon: '🏛️', label: 'Campus Life' },
      { id: 'dorm_life', icon: '🏠', label: 'Dorm Life' },
      { id: 'study_tips', icon: '📚', label: 'Study Tips' },
      { id: 'exams', icon: '📝', label: 'Exams' },
      { id: 'professors', icon: '👨‍🏫', label: 'Professor Reviews' }
    ]
  },
  {
    name: 'Social',
    icon: '👥',
    interests: [
      { id: 'relationships', icon: '💝', label: 'Relationships' },
      { id: 'confessions', icon: '🤫', label: 'Confessions' },
      { id: 'meetups', icon: '🤝', label: 'Meetups' },
      { id: 'clubs', icon: '🎪', label: 'Clubs & Events' }
    ]
  },
  {
    name: 'Career',
    icon: '💼',
    interests: [
      { id: 'internships', icon: '💼', label: 'Internships' },
      { id: 'placements', icon: '🎯', label: 'Placements' },
      { id: 'career_advice', icon: '💡', label: 'Career Advice' },
      { id: 'interviews', icon: '🤝', label: 'Interview Prep' }
    ]
  }
];

export default function InterestsStage({ formData, setFormData }: InterestsStageProps) {
  const [activeCategory, setActiveCategory] = useState(interestCategories[0].name);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleInterest = (interestId: string) => {
    const currentInterests = formData.interests || [];
    const newInterests = currentInterests.includes(interestId)
      ? currentInterests.filter((id: string) => id !== interestId)
      : [...currentInterests, interestId];
    
    setFormData({ ...formData, interests: newInterests });
  };

  const filteredCategories = searchTerm
    ? interestCategories.map(category => ({
        ...category,
        interests: category.interests.filter(interest =>
          interest.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.interests.length > 0)
    : interestCategories;

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          ✨ Personalize Your Feed
        </motion.div>
        <h3 className="text-2xl font-bold mb-2">What interests you?</h3>
        <p className="text-gray-400">Choose at least 3 topics to get started</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search interests..."
          className="w-full px-4 py-3 rounded-xl bg-surface border-2 border-white/10 focus:border-primary/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          🔍
        </span>
      </div>

      {/* Categories Navigation - Updated to use flex-wrap */}
      {!searchTerm && (
        <div className="flex flex-wrap gap-2">
          {interestCategories.map((category) => (
            <motion.button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all ${
                activeCategory === category.name
                  ? 'bg-primary text-white'
                  : 'bg-surface hover:bg-primary/20'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </motion.button>
          ))}
        </div>
      )}

      {/* Interests Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {(searchTerm ? filteredCategories : interestCategories.filter(c => c.name === activeCategory))
          .map(category => (
            <AnimatePresence key={category.name} mode="wait">
              {category.interests.map(interest => {
                const isSelected = (formData.interests || []).includes(interest.id);
                
                return (
                  <motion.button
                    key={interest.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleInterest(interest.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/10 text-white' 
                        : 'border-gray-700 hover:border-primary/50 text-gray-400'
                    }`}
                  >
                    <div className="text-3xl mb-2">{interest.icon}</div>
                    <div className="text-sm">{interest.label}</div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          ))}
      </div>

      {/* Selected Count */}
      <div className="text-center text-sm">
        <span className={`font-medium ${
          (formData.interests || []).length >= 3 ? 'text-green-500' : 'text-yellow-500'
        }`}>
          {(formData.interests || []).length} selected
        </span>
        <span className="text-gray-400"> (minimum 3 required)</span>
      </div>
    </div>
  );
} 
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, MapPin, School } from 'lucide-react'
import { colleges } from '@/data/colleges'

interface CollegeStageProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function CollegeStage({ formData, setFormData }: CollegeStageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredColleges, setFilteredColleges] = useState<any[]>([])

  // Combine all colleges into a single array
  const allColleges = [...colleges.bihar, ...colleges.other_states]

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filtered = allColleges.filter(college => 
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredColleges(filtered)
    } else {
      setFilteredColleges([])
    }
  }, [searchTerm])

  const handleCollegeSelect = (college: any) => {
    setFormData({
      ...formData,
      college: {
        id: college.id,
        name: college.name,
        location: college.location,
        type: college.type
      }
    });
    setSearchTerm(''); // Clear search after selection
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          <School className="inline-block mr-2" size={18} />
          Find Your College
        </motion.div>
        <h3 className="text-2xl font-bold mb-2">Select Your College</h3>
        <p className="text-gray-400">Connect with your campus community</p>
      </div>

      {/* Selected College Display */}
      {formData.college && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/10 p-4 rounded-xl mb-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-primary">{formData.college.name}</div>
              <div className="text-sm text-gray-400 flex items-center gap-1">
                <MapPin size={12} />
                {formData.college.location}
              </div>
            </div>
            <button
              onClick={() => setFormData({ ...formData, college: null })}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Start typing your college name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-surface rounded-xl border border-white/10 focus:border-primary/50"
        />
      </div>

      {/* Search Results */}
      {searchTerm.length >= 2 && (
        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
          {filteredColleges.length > 0 ? (
            filteredColleges.map((college) => (
              <motion.button
                key={college.id}
                onClick={() => handleCollegeSelect(college)}
                whileHover={{ x: 4 }}
                className="w-full p-4 rounded-xl border border-white/10 hover:border-primary/50 text-left transition-all"
              >
                <div className="font-medium mb-1">{college.name}</div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin size={14} />
                  {college.location}
                  <span className="px-2 py-0.5 bg-surface/50 rounded-full text-xs">
                    {college.type}
                  </span>
                </div>
              </motion.button>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              No colleges found matching "{searchTerm}"
            </div>
          )}
        </div>
      )}

      {/* Search Hint */}
      {searchTerm.length < 2 && (
        <div className="text-center text-sm text-gray-400 mt-4">
          Type at least 2 characters to search for your college
        </div>
      )}
    </div>
  )
} 
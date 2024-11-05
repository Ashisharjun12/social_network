'use client'
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

interface UsernameStageProps {
  formData: any;
  setFormData: (data: any) => void;
  isAvailable: boolean | null;
  setIsAvailable: (value: boolean | null) => void;
}

export default function UsernameStage({ formData, setFormData, isAvailable, setIsAvailable }: UsernameStageProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const checkUsername = async (username: string) => {
    if (!username) {
      setIsAvailable(null);
      setSuggestions([]);
      return;
    }
    
    setIsChecking(true);
    try {
      const response = await fetch('/api/auth/check-username', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });

      const data = await response.json();
      setIsAvailable(data.available);

      if (data.available) {
        setSuggestions([]);
      } else {
        setSuggestions(data.suggestions);
        toast.error('Username already taken. Try our suggestions!', {
          icon: '🤔'
        });
      }
    } catch (error) {
      toast.error('Error checking username');
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    if (formData.username) {
      checkUsername(formData.username);
    }
  }, [formData.username]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          🎭 Create Your Secret Identity
        </motion.div>
        <h3 className="text-2xl font-bold mb-2">Choose Your Username</h3>
        <p className="text-gray-400">This will be your anonymous identity</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Enter username"
            className={`form-input pr-10 ${
              isAvailable === true ? 'border-green-500' :
              isAvailable === false ? 'border-red-500' :
              ''
            }`}
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isChecking ? (
              <div className="animate-spin text-primary">⌛</div>
            ) : isAvailable ? (
              <div className="text-green-500">✓</div>
            ) : isAvailable === false ? (
              <div className="text-red-500">✗</div>
            ) : null}
          </div>
        </div>

        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <p className="text-sm text-gray-400">Available suggestions:</p>
              <div className="grid grid-cols-2 gap-2">
                {suggestions.map((suggestion) => (
                  <motion.button
                    key={suggestion}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setFormData({ ...formData, username: suggestion });
                      setSuggestions([]);
                      setIsAvailable(true);
                    }}
                    className="p-2 bg-surface hover:bg-primary/20 rounded-lg text-sm transition-colors"
                  >
                    {suggestion}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center text-sm text-gray-400">
        <p>Choose wisely! This will be your anonymous identity.</p>
        <p>Make it memorable but not personally identifiable.</p>
      </div>
    </div>
  );
} 
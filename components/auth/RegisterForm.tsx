'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useAuthStore } from '@/stores/useAuthStore'
import UsernameStage from './stages/UsernameStage'
import AvatarStage from './stages/AvatarStage'
import PersonalInfoStage from './stages/PersonalInfoStage'
import PersonalityStage from './stages/PersonalityStage'
import InterestsStage from './stages/InterestsStage'
import RecoveryStage from './stages/RecoveryStage'
import CollegeStage from './stages/CollegeStage'
import ProgressBar from './ProgressBar'

type Stage = 'username' | 'avatar' | 'college' | 'personal' | 'personality' | 'interests' | 'recovery'

export default function RegisterForm() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [stage, setStage] = useState<Stage>('username')
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    avatarType: '',
    avatarUrl: '',
    cloudinaryPublicId: '',
    college: null as null | {
      id: string;
      name: string;
      location: string;
      type: string;
    },
    personalInfo: {
      age: '',
      gender: '',
      personality: '',
      profession: ''
    },
    interests: [] as string[],
    recoveryEmail: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formValid, setFormValid] = useState(false)

  useEffect(() => {
    const validateForm = () => {
      switch (stage) {
        case 'username':
          return Boolean(formData.username && isAvailable);
        case 'avatar':
          return Boolean(formData.avatarUrl);
        case 'college':
          return Boolean(formData.college?.id);
        case 'personal':
          return Boolean(formData.personalInfo.age && formData.personalInfo.gender);
        case 'personality':
          return Boolean(formData.personalInfo.personality && formData.personalInfo.profession);
        case 'interests':
          return (formData.interests || []).length >= 3;
        case 'recovery':
          return Boolean(formData.recoveryEmail);
        default:
          return false;
      }
    };

    setFormValid(validateForm());
  }, [stage, formData, isAvailable]);

  const handleNext = () => {
    const stages: Stage[] = ['username', 'avatar', 'college', 'personal', 'personality', 'interests', 'recovery'];
    const currentIndex = stages.indexOf(stage);
    if (currentIndex < stages.length - 1) {
      setStage(stages[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const stages: Stage[] = ['username', 'avatar', 'college', 'personal', 'personality', 'interests', 'recovery'];
    const currentIndex = stages.indexOf(stage);
    if (currentIndex > 0) {
      setStage(stages[currentIndex - 1]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        login(data.data.token, data.data.user);
        
        toast.success('Registration successful! Redirecting...', {
          duration: 3000
        });

        router.push(data.data.user.role === 'admin' ? '/admin' : '/feed');
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Something went wrong during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass max-w-md mx-auto rounded-2xl shadow-2xl p-8">
      <ProgressBar currentStage={stage} />

      <form onSubmit={handleSubmit} className="min-h-[400px]">
        {stage === 'username' && (
          <UsernameStage 
            formData={formData} 
            setFormData={setFormData}
            isAvailable={isAvailable}
            setIsAvailable={setIsAvailable}
          />
        )}
        {stage === 'avatar' && (
          <AvatarStage 
            formData={formData} 
            setFormData={setFormData}
          />
        )}
        {stage === 'college' && (
          <CollegeStage 
            formData={formData} 
            setFormData={setFormData}
          />
        )}
        {stage === 'personal' && (
          <PersonalInfoStage 
            formData={formData} 
            setFormData={setFormData}
          />
        )}
        {stage === 'personality' && (
          <PersonalityStage 
            formData={formData} 
            setFormData={setFormData}
          />
        )}
        {stage === 'interests' && (
          <InterestsStage 
            formData={formData} 
            setFormData={setFormData}
          />
        )}
        {stage === 'recovery' && (
          <RecoveryStage 
            formData={formData} 
            setFormData={setFormData}
          />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          {stage !== 'username' && (
            <button
              type="button"
              onClick={handleBack}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Back
            </button>
          )}
          
          {stage === 'recovery' ? (
            <button
              type="submit"
              disabled={!formValid || isSubmitting}
              className={`btn-primary relative overflow-hidden ${
                !formValid || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              } ${stage === 'recovery' ? 'w-full' : 'ml-auto'}`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-white rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={!formValid}
              className={`btn-primary ${
                !formValid ? 'opacity-50 cursor-not-allowed' : ''
              } ${stage === 'username' ? 'w-full' : 'ml-auto'}`}
            >
              Continue
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

// Stage Components will be continued in the next message... 
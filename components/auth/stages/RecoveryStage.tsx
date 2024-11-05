'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

interface RecoveryStageProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function RecoveryStage({ formData, setFormData }: RecoveryStageProps) {
  const [confirmEmail, setConfirmEmail] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, recoveryEmail: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">Recovery Email</h3>
        <p className="text-gray-400">For account recovery and important updates only</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Recovery Email
          </label>
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="form-input"
            value={formData.recoveryEmail}
            onChange={handleEmailChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Confirm Recovery Email
          </label>
          <input
            type="email"
            required
            placeholder="Confirm your email"
            className="form-input"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
          />
        </div>

        <div className="bg-surface/30 rounded-lg p-4 text-sm text-gray-400">
          <div className="flex items-start gap-3">
            <span className="text-lg">🔒</span>
            <p>
              Your email will only be used for:
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li>Account recovery</li>
                <li>Security notifications</li>
                <li>Important updates</li>
              </ul>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
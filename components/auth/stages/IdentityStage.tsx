'use client'
import { useState } from 'react'
import Avatar from '@/components/common/Avatar'
import toast from 'react-hot-toast'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

interface IdentityStageProps {
  formData: any;
  setFormData: (data: any) => void;
  generateAvatar: (username: string) => void;
  getRootProps: any;
  getInputProps: any;
}

export default function IdentityStage({
  formData,
  setFormData,
  generateAvatar,
  getRootProps,
  getInputProps
}: IdentityStageProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [avatarType, setAvatarType] = useState<'none' | 'generated' | 'uploaded'>('none');
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    setFormData({ ...formData, username });
    if (username) {
      setShowAvatarOptions(true);
    } else {
      setShowAvatarOptions(false);
      setAvatarType('none');
    }
  };

  const handleGenerateAvatar = async () => {
    setIsGenerating(true);
    NProgress.start();

    try {
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      generateAvatar(formData.username + Date.now());
      setAvatarType('generated');
      toast.success('New avatar generated!');
    } catch (error) {
      toast.error('Failed to generate avatar');
    } finally {
      setIsGenerating(false);
      NProgress.done();
    }
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      NProgress.start();
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (response.ok) {
        setFormData(prev => ({ 
          ...prev, 
          avatarUrl: data.url,
          avatarType: 'uploaded',
          cloudinaryPublicId: data.public_id
        }));
        setAvatarType('uploaded');
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Upload error:', error);
    } finally {
      NProgress.done();
    }
  };

  return (
    <div className="space-y-6">
      {/* Username Input First */}
      <div>
        <label className="block text-sm font-medium text-gray-300">
          Choose Your Username
        </label>
        <input
          type="text"
          required
          placeholder="e.g., NightOwl42"
          className="form-input"
          value={formData.username}
          onChange={handleUsernameChange}
        />
      </div>

      {/* Avatar Selection - Only shown after username is entered */}
      {showAvatarOptions && (
        <div className="text-center animate-fadeIn">
          <div className="mb-4">
            {avatarType === 'uploaded' && formData.avatarUrl ? (
              <div className="relative">
                <img
                  src={formData.avatarUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover mx-auto"
                />
                <button
                  onClick={() => {
                    setAvatarType('none');
                    setFormData(prev => ({ ...prev, avatarUrl: '', cloudinaryPublicId: null }));
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : avatarType === 'generated' && formData.username ? (
              <div className={`w-24 h-24 mx-auto relative ${isGenerating ? 'animate-pulse' : ''}`}>
                <Avatar 
                  username={formData.username} 
                  size={96} 
                />
                <button
                  onClick={() => {
                    setAvatarType('none');
                    setFormData(prev => ({ ...prev, avatarUrl: '' }));
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 mx-auto bg-gray-700 rounded-full flex items-center justify-center border-2 border-gray-600">
                <span className="text-3xl">👤</span>
              </div>
            )}
          </div>

          {avatarType === 'none' && (
            <div className="flex flex-col gap-4">
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-600 rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-colors relative overflow-hidden group"
              >
                <input {...getInputProps()} onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }} />
                <div className="relative z-10">
                  <p className="text-sm text-gray-400 group-hover:text-white transition-colors">
                    Drop an image here or click to upload
                  </p>
                </div>
                <div className="absolute inset-0 bg-primary/5 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
              </div>

              <div className="text-sm text-gray-400">
                - or -
              </div>

              <button
                type="button"
                onClick={handleGenerateAvatar}
                disabled={isGenerating}
                className={`btn-secondary text-sm relative overflow-hidden ${
                  isGenerating ? 'cursor-not-allowed opacity-75' : ''
                }`}
              >
                {isGenerating ? 'Generating...' : 'Generate Random Avatar'}
                {isGenerating && (
                  <div className="absolute inset-0 bg-primary/10 animate-pulse"></div>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Email Input */}
      <div>
        <label className="block text-sm font-medium text-gray-300">
          Recovery Email
        </label>
        <input
          type="email"
          required
          placeholder="For account recovery only"
          className="form-input"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <p className="mt-1 text-xs text-gray-400">
          Only used for account recovery. Never shown publicly.
        </p>
      </div>
    </div>
  );
} 
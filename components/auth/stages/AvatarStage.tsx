'use client'
import { useState } from 'react'
import Avatar from '@/components/common/Avatar'
import toast from 'react-hot-toast'
import NProgress from 'nprogress'
import { motion } from 'framer-motion'

interface AvatarStageProps {
  formData: any;
  setFormData: (data: any) => void;
}

export default function AvatarStage({ formData, setFormData }: AvatarStageProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const getRandomBackground = () => {
    const backgrounds = [
      '4D61FC,FF4B91,00D8B4', // Default blue-pink-teal
      'FF4B91,4D61FC,00D8B4', // Pink-blue-teal
      '00D8B4,4D61FC,FF4B91', // Teal-blue-pink
      'FF6B6B,4ECDC4,45B7D1', // Coral-mint-sky
      'A66CFF,9C27B0,FF4B91', // Purple-violet-pink
      '4CAF50,45B7D1,FF4B91', // Green-sky-pink
      'FF9800,FF4B91,4D61FC', // Orange-pink-blue
    ];
    return backgrounds[Math.floor(Math.random() * backgrounds.length)];
  };

  const handleGenerateAvatar = async () => {
    setIsGenerating(true);
    NProgress.start();

    try {
      const styles = [
        'adventurer',
        'avataaars',
        'fun-emoji',
        'pixel-art',
        'miniavs'
      ];
      const randomStyle = styles[Math.floor(Math.random() * styles.length)];
      const seed = `${formData.username}-${Date.now()}`;
      const backgroundColor = getRandomBackground();
      const avatarUrl = `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${backgroundColor}`;

      setFormData({
        ...formData,
        avatarType: 'generated',
        avatarUrl,
      });

      toast.success('Avatar generated!');
    } catch (error) {
      toast.error('Failed to generate avatar');
    } finally {
      setIsGenerating(false);
      NProgress.done();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    NProgress.start();

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          avatarType: 'uploaded',
          avatarUrl: data.url,
          cloudinaryPublicId: data.public_id
        }));
        toast.success('Image uploaded successfully!');
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
      NProgress.done();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
        >
          🎭 Express Yourself
        </motion.div>
        <h3 className="text-2xl font-bold mb-2">Choose Your Avatar</h3>
        <p className="text-gray-400">Your anonymous visual identity</p>
      </div>

      {/* Avatar Preview */}
      <motion.div 
        className="flex justify-center mb-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {formData.avatarUrl ? (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img
              src={formData.avatarUrl}
              alt="Avatar"
              className="w-40 h-40 rounded-full object-cover border-4 border-white/10 group-hover:border-primary/50 transition-colors duration-300"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setFormData({ ...formData, avatarUrl: '', avatarType: '' })}
              className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg"
            >
              ×
            </motion.button>
          </div>
        ) : (
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-800 to-gray-700 border-4 border-gray-700 flex items-center justify-center group hover:border-primary/50 transition-colors duration-300">
            <span className="text-5xl group-hover:scale-110 transition-transform duration-300">👤</span>
          </div>
        )}
      </motion.div>

      {/* Avatar Options */}
      <div className="space-y-4 max-w-sm mx-auto">
        {/* Upload Option */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="avatar-upload"
            disabled={isUploading}
          />
          <label
            htmlFor="avatar-upload"
            className="btn-secondary w-full flex items-center justify-center gap-2 cursor-pointer"
          >
            {isUploading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  ⚡
                </motion.div>
                Uploading...
              </>
            ) : (
              <>
                📸 Upload Custom Avatar
              </>
            )}
          </label>
        </motion.div>

        <div className="text-center text-gray-400">- or -</div>

        {/* Generate Option */}
        <motion.button
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          type="button"
          onClick={handleGenerateAvatar}
          disabled={isGenerating}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                ✨
              </motion.div>
              Generating...
            </>
          ) : (
            <>
              🎲 Generate Random Avatar
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
} 
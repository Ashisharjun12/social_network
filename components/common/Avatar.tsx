'use client'

interface AvatarProps {
  username: string;
  size?: number;
  className?: string;
  customBackground?: string;
}

export default function Avatar({ 
  username, 
  size = 40, 
  className = '',
  customBackground 
}: AvatarProps) {
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

  const getAvatarUrl = (seed: string) => {
    const styles = [
      'adventurer',
      'adventurer-neutral',
      'avataaars',
      'big-ears',
      'big-ears-neutral',
      'croodles',
      'fun-emoji',
      'icons',
      'identicon',
      'micah',
      'miniavs',
      'personas',
      'pixel-art'
    ];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const backgroundColor = customBackground || getRandomBackground();
    return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=${backgroundColor}`;
  };

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <img
        src={getAvatarUrl(username)}
        alt={`${username}'s avatar`}
        width={size}
        height={size}
        className={`rounded-full bg-primary/10 relative z-10 transition-transform duration-300 group-hover:scale-105 ${className}`}
        loading="lazy"
      />
    </div>
  );
} 
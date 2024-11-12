'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Users, School } from 'lucide-react'
import Image from 'next/image'
import { useAuthStore } from '@/stores/useAuthStore'

interface Group {
  _id: string;
  name: string;
  description: string;
  createdBy: {
    username: string;
    avatarUrl: string;
  };
  college?: {
    name: string;
  };
  memberCount: number;
  isJoined: boolean;
}

export default function Groups() {
  const { user } = useAuthStore()
  const [myGroups, setMyGroups] = useState<Group[]>([])
  const [suggestedGroups, setSuggestedGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      if (!user?.username) return;
      
      const response = await fetch(`/api/groups?username=${user.username}`);
      const data = await response.json();
      
      if (data.myGroups) setMyGroups(data.myGroups);
      if (data.suggestedGroups) setSuggestedGroups(data.suggestedGroups);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading groups...</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/10 p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Groups</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 rounded-full text-primary transition-colors"
          >
            <Plus size={20} />
            Create Group
          </button>
        </div>
      </div>

      {/* My Groups */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">My Groups</h2>
        {myGroups.length > 0 ? (
          <div className="space-y-3">
            {myGroups.map((group) => (
              <GroupCard 
                key={group._id} 
                group={group} 
                onJoinLeave={fetchGroups} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            You haven't joined any groups yet
          </div>
        )}
      </div>

      {/* Suggested Groups */}
      <div className="p-4 border-t border-white/10">
        <h2 className="text-lg font-semibold mb-4">Suggested Groups</h2>
        <div className="space-y-3">
          {suggestedGroups.map((group) => (
            <GroupCard 
              key={group._id} 
              group={group} 
              onJoinLeave={fetchGroups} 
            />
          ))}
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <CreateGroupModal 
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchGroups}
        />
      )}
    </div>
  );
}

function GroupCard({ group, onJoinLeave }: { group: Group; onJoinLeave: () => void }) {
  const handleJoinLeave = async () => {
    try {
      const endpoint = group.isJoined ? '/api/groups/leave' : '/api/groups/join';
      await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId: group._id })
      });
      onJoinLeave();
    } catch (error) {
      console.error('Error joining/leaving group:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 bg-surface/50 rounded-lg hover:bg-surface/80 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Users size={24} className="text-primary" />
        </div>
        <div>
          <h3 className="font-medium">{group.name}</h3>
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Users size={14} />
              {group.memberCount} members
            </span>
            {group.college && (
              <span className="flex items-center gap-1">
                <School size={14} />
                {group.college.name}
              </span>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleJoinLeave}
        className={`px-4 py-2 rounded-full text-sm transition-colors ${
          group.isJoined
            ? 'bg-surface text-gray-400 hover:bg-red-500/10 hover:text-red-500'
            : 'bg-primary/10 text-primary hover:bg-primary/20'
        }`}
      >
        {group.isJoined ? 'Leave' : 'Join'}
      </button>
    </motion.div>
  );
}

function CreateGroupModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/groups/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description })
      });
      onCreated();
      onClose();
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-surface p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create New Group</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Group Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-dark rounded-lg border border-white/10"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 bg-dark rounded-lg border border-white/10 h-24"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { 
  User, 
  Shield, 
  UserX, 
  Mail, 
  Calendar,
  Activity,
  Award,
  AlertTriangle,
  BadgeCheck,
  BadgeX,
  Search,
  Filter
} from 'lucide-react'

interface UserData {
  _id: string;
  username: string;
  recoveryEmail: string;
  role: 'user' | 'admin';
  isEmailVerified: boolean;
  karmaPoints: number;
  createdAt: string;
  lastActive: Date;
  isVerified: boolean;
  verifiedAt?: Date;
  verifiedBy?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified'>('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      if (Array.isArray(data)) {
        setUsers(data)
      } else {
        console.error('Expected array of users but got:', data)
        setUsers([])
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to fetch users')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  const handleBanUser = async (userId: string) => {
    if (!confirm('Are you sure you want to ban this user?')) return

    try {
      const response = await fetch(`/api/admin/users/${userId}/ban`, {
        method: 'POST'
      })

      if (response.ok) {
        toast.success('User banned successfully')
        fetchUsers() // Refresh the list
      } else {
        throw new Error('Failed to ban user')
      }
    } catch (error) {
      toast.error('Failed to ban user')
    }
  }

  const handleVerification = async (username: string, action: 'verify' | 'unverify') => {
    try {
      const response = await fetch('/api/admin/users/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          action,
          adminUsername: 'admin' // Get from auth store
        })
      });

      if (response.ok) {
        toast.success(`User ${action === 'verify' ? 'verified' : 'unverified'} successfully`);
        fetchUsers(); // Refresh user list
      } else {
        throw new Error('Failed to update verification status');
      }
    } catch (error) {
      toast.error('Failed to update verification status');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'verified' ? user.isVerified :
      !user.isVerified;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <LoadingState />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User size={24} className="text-primary" />
          User Management
        </h1>
        <div className="flex gap-4">
          <button className="btn-secondary">
            Export Data
          </button>
          <button className="btn-primary">
            Send Mass Email
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface rounded-lg border border-white/10 focus:border-primary/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="bg-surface border border-white/10 rounded-lg px-3 py-2"
          >
            <option value="all">All Users</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard 
          icon={<User size={20} />}
          label="Total Users"
          value={users.length}
          trend="+12%"
          trendUp={true}
        />
        <StatCard 
          icon={<BadgeCheck size={20} />}
          label="Verified Users"
          value={users.filter(u => u.isVerified).length}
          trend="+5%"
          trendUp={true}
        />
        <StatCard 
          icon={<Activity size={20} />}
          label="Active Today"
          value="234"
          trend="+8%"
          trendUp={true}
        />
        <StatCard 
          icon={<AlertTriangle size={20} />}
          label="Reported Users"
          value="12"
          trend="-2%"
          trendUp={false}
        />
      </div>

      {/* Users Table */}
      {loading ? (
        <LoadingState />
      ) : (
        <div className="bg-surface rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">User</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Verification</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t border-white/10 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <User size={20} className="text-primary" />
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {user.username}
                            {user.isVerified && (
                              <BadgeCheck size={16} className="text-primary fill-primary/20" />
                            )}
                          </div>
                          <div className="text-sm text-gray-400">
                            Karma: {user.karmaPoints}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        user.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-gray-700 text-gray-300'
                      }`}>
                        {user.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.isVerified ? (
                        <div className="flex items-center gap-2">
                          <BadgeCheck size={16} className="text-primary fill-primary/20" />
                          <span className="text-sm">
                            Verified by @{user.verifiedBy}
                          </span>
                          <button
                            onClick={() => handleVerification(user.username, 'unverify')}
                            className="ml-2 p-1 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Remove verification"
                          >
                            <BadgeX size={16} className="text-red-400" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleVerification(user.username, 'verify')}
                          className="flex items-center gap-2 px-3 py-1 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                        >
                          <BadgeCheck size={16} />
                          <span className="text-sm">Verify User</span>
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <span>{user.recoveryEmail}</span>
                        {user.isEmailVerified && (
                          <span className="text-green-500 text-sm">✓</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={16} />
                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleBanUser(user._id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                          title="Ban User"
                        >
                          <UserX size={18} className="text-red-400 group-hover:text-red-300" />
                        </button>
                        <button 
                          className="p-2 hover:bg-primary/10 rounded-lg transition-colors group"
                          title="Send Email"
                        >
                          <Mail size={18} className="text-gray-400 group-hover:text-primary" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ 
  icon, 
  label, 
  value, 
  trend, 
  trendUp 
}: { 
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
}) {
  return (
    <div className="bg-surface p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-primary/20 rounded-lg">
          {icon}
        </div>
        <span className={`text-sm ${trendUp ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </span>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-surface rounded-lg animate-pulse"></div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-surface rounded-xl animate-pulse"></div>
        ))}
      </div>
      <div className="h-[400px] bg-surface rounded-xl animate-pulse"></div>
    </div>
  )
} 
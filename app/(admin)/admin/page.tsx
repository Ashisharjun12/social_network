'use client'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalGroups: 0,
    activeUsers: 0
  })

  useEffect(() => {
    // Fetch dashboard stats
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button className="btn-primary">Generate Report</button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon="👥"
          label="Total Users"
          value={stats.totalUsers}
          trend="+12%"
        />
        <StatCard
          icon="📝"
          label="Total Posts"
          value={stats.totalPosts}
          trend="+8%"
        />
        <StatCard
          icon="👥"
          label="Total Groups"
          value={stats.totalGroups}
          trend="+15%"
        />
        <StatCard
          icon="⚡"
          label="Active Users"
          value={stats.activeUsers}
          trend="+5%"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-surface rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        {/* Add activity list here */}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, trend }: {
  icon: string;
  label: string;
  value: number;
  trend: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-surface p-6 rounded-xl border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className="text-green-500 text-sm">{trend}</span>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </motion.div>
  )
} 
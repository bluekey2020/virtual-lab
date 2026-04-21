import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔬</span>
              <h1 className="text-xl font-bold text-gray-900">虚拟实验室 · 教师端</h1>
            </div>

            <nav className="flex items-center gap-4">
              <a
                href="/teacher"
                className="px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg"
              >
                仪表盘
              </a>
              <a
                href="/teacher/tasks"
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                任务管理
              </a>
              <a
                href="/teacher/grading"
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                批改报告
              </a>

              <div className="h-6 w-px bg-gray-200" />

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">👨‍🏫 {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  退出
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            教学仪表盘 👨‍🏫
          </h2>
          <p className="text-gray-500 mt-1">
            欢迎回来，{user?.name} · 查看班级实验进度和学生表现
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <button
            onClick={() => navigate('/teacher/tasks')}
            className="bg-white rounded-xl p-6 border border-gray-200 text-left hover:shadow-md hover:border-purple-300 transition-all"
          >
            <div className="text-3xl mb-3">📋</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">布置实验任务</h3>
            <p className="text-sm text-gray-500">创建新任务并分配给学生</p>
          </button>

          <button
            onClick={() => navigate('/teacher/grading')}
            className="bg-white rounded-xl p-6 border border-gray-200 text-left hover:shadow-md hover:border-purple-300 transition-all"
          >
            <div className="text-3xl mb-3">✍️</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">批改实验报告</h3>
            <p className="text-sm text-gray-500">查看学生提交的报告并打分</p>
          </button>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">数据分析</h3>
            <p className="text-sm text-gray-500">查看学生实验数据与趋势</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-500">活跃班级</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-indigo-600">0</div>
            <div className="text-sm text-gray-500">学生总数</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-500">已布置任务</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-amber-600">0</div>
            <div className="text-sm text-gray-500">待批改报告</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">最近动态</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-1.5" />
              <div>
                <p className="text-gray-700">暂无动态</p>
                <p className="text-gray-400 text-xs mt-0.5">开始布置第一个实验任务吧</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

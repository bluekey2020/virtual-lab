import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { experiments } from '../data/experiments'
import { useLabStore } from '../store/labStore'
import { useResponsive } from '../hooks/useResponsive'

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const setCurrentExperiment = useLabStore((state) => state.setCurrentExperiment)
  const { isMobile } = useResponsive()
  const [showMenu, setShowMenu] = useState(false)

  const handleSelectExperiment = (id: string) => {
    setCurrentExperiment(id)
    navigate(`/experiment/${id}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const physicsExperiments = experiments.filter((e) => e.subject === '物理')
  const chemistryExperiments = experiments.filter((e) => e.subject === '化学')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className={`${isMobile ? 'px-3' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'}`}>
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xl sm:text-2xl">🔬</span>
              <h1 className="text-base sm:text-xl font-bold text-gray-900">虚拟实验室</h1>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden sm:flex items-center gap-4">
              <a href="/" className="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg">
                实验列表
              </a>
              <a href="/my-tasks" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                我的任务
              </a>
              <a href="/my-reports" className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                我的报告
              </a>
              <div className="h-6 w-px bg-gray-200" />
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">👨‍🎓 {user?.name}</span>
                <button onClick={handleLogout} className="px-3 py-1.5 text-sm text-gray-500 hover:text-red-600 transition-colors">
                  退出
                </button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 sm:hidden">
              <span className="text-xs text-gray-600">{user?.name}</span>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <span className="text-lg">{showMenu ? '✕' : '☰'}</span>
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {showMenu && (
            <div className="sm:hidden pb-3 border-t border-gray-100 pt-2 space-y-1">
              <a href="/" className="block px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg">
                实验列表
              </a>
              <a href="/my-tasks" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
                我的任务
              </a>
              <a href="/my-reports" className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">
                我的报告
              </a>
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                退出登录
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className={`${isMobile ? 'px-3 py-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        {/* Welcome */}
        <div className="mb-4 sm:mb-8">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
            欢迎回来，{user?.name} 👋
          </h2>
          <p className="text-xs sm:text-base text-gray-500 mt-1">
            {user?.grade && `${user.grade}${user.classNo ? user.classNo : ''} · `}
            共 {experiments.length} 个实验可选
          </p>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8`}>
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
            <div className="text-xl sm:text-2xl font-bold text-indigo-600">{experiments.length}</div>
            <div className="text-xs sm:text-sm text-gray-500">总实验数</div>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
            <div className="text-xl sm:text-2xl font-bold text-green-600">0</div>
            <div className="text-xs sm:text-sm text-gray-500">已完成</div>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
            <div className="text-xl sm:text-2xl font-bold text-amber-600">0</div>
            <div className="text-xs sm:text-sm text-gray-500">待完成任务</div>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
            <div className="text-xl sm:text-2xl font-bold text-purple-600">0</div>
            <div className="text-xs sm:text-sm text-gray-500">已提交报告</div>
          </div>
        </div>

        {/* Physics Experiments */}
        {physicsExperiments.length > 0 && (
          <section className="mb-6 sm:mb-8">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              ⚛️ 物理实验
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {physicsExperiments.map((exp) => (
                <ExperimentCard key={exp.id} exp={exp} onSelect={() => handleSelectExperiment(exp.id)} />
              ))}
            </div>
          </section>
        )}

        {/* Chemistry Experiments */}
        {chemistryExperiments.length > 0 && (
          <section>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              🧪 化学实验
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {chemistryExperiments.map((exp) => (
                <ExperimentCard key={exp.id} exp={exp} onSelect={() => handleSelectExperiment(exp.id)} />
              ))}
            </div>
          </section>
        )}

        {experiments.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <div className="text-4xl sm:text-5xl mb-4">🧫</div>
            <p className="text-gray-500 text-sm sm:text-base">暂无可用实验，请联系管理员</p>
          </div>
        )}
      </main>
    </div>
  )
}

interface ExperimentCardProps {
  exp: {
    id: string
    title: string
    subject: string
    gradeLevel: string
    duration: number
    difficulty: number
    knowledgePoints: string[]
  }
  onSelect: () => void
}

const ExperimentCard: React.FC<ExperimentCardProps> = ({ exp, onSelect }) => (
  <button
    onClick={onSelect}
    className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-5 text-left hover:shadow-md hover:border-indigo-300 transition-all group"
  >
    <div className="flex items-start justify-between mb-2 sm:mb-3">
      <span className="text-2xl sm:text-3xl">{exp.subject === '物理' ? '⚛️' : '🧪'}</span>
      <span
        className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium rounded-full ${
          exp.difficulty <= 2
            ? 'bg-green-50 text-green-600'
            : exp.difficulty <= 3
            ? 'bg-amber-50 text-amber-600'
            : 'bg-red-50 text-red-600'
        }`}
      >
        难度 {exp.difficulty}
      </span>
    </div>

    <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 sm:mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
      {exp.title}
    </h4>

    <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">{exp.gradeLevel}</p>

    <div className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-400 mb-2 sm:mb-3">
      <span>⏱ {exp.duration} 分钟</span>
      <span>📚 {exp.knowledgePoints.length} 个知识点</span>
    </div>

    <div className="pt-2 sm:pt-3 border-t border-gray-100">
      <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-2">
        {exp.knowledgePoints.join(' · ')}
      </p>
    </div>
  </button>
)

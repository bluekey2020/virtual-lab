import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { experiments } from '../data/experiments'
import { useLabStore } from '../store/labStore'

export const StudentDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const setCurrentExperiment = useLabStore((state) => state.setCurrentExperiment)

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔬</span>
              <h1 className="text-xl font-bold text-gray-900">虚拟实验室</h1>
            </div>

            <nav className="flex items-center gap-4">
              <a
                href="/"
                className="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg"
              >
                实验列表
              </a>
              <a
                href="/my-tasks"
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                我的任务
              </a>
              <a
                href="/my-reports"
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                我的报告
              </a>

              <div className="h-6 w-px bg-gray-200" />

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {user?.role === 'student' ? '👨‍🎓' : '👨‍🏫'} {user?.name}
                </span>
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
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            欢迎回来，{user?.name} 👋
          </h2>
          <p className="text-gray-500 mt-1">
            {user?.grade && `${user.grade}${user.classNo ? user.classNo : ''} · `}
            共 {experiments.length} 个实验可选
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-indigo-600">{experiments.length}</div>
            <div className="text-sm text-gray-500">总实验数</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-sm text-gray-500">已完成</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-amber-600">0</div>
            <div className="text-sm text-gray-500">待完成任务</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-purple-600">0</div>
            <div className="text-sm text-gray-500">已提交报告</div>
          </div>
        </div>

        {/* Physics Experiments */}
        {physicsExperiments.length > 0 && (
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              ⚛️ 物理实验
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {physicsExperiments.map((exp) => (
                <ExperimentCard
                  key={exp.id}
                  exp={exp}
                  onSelect={() => handleSelectExperiment(exp.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Chemistry Experiments */}
        {chemistryExperiments.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              🧪 化学实验
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {chemistryExperiments.map((exp) => (
                <ExperimentCard
                  key={exp.id}
                  exp={exp}
                  onSelect={() => handleSelectExperiment(exp.id)}
                />
              ))}
            </div>
          </section>
        )}

        {experiments.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🧫</div>
            <p className="text-gray-500">暂无可用实验，请联系管理员</p>
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
    className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-left hover:shadow-md hover:border-indigo-300 transition-all group"
  >
    <div className="flex items-start justify-between mb-3">
      <span className="text-3xl">{exp.subject === '物理' ? '⚛️' : '🧪'}</span>
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
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

    <h4 className="text-base font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
      {exp.title}
    </h4>

    <p className="text-sm text-gray-500 mb-3">{exp.gradeLevel}</p>

    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
      <span>⏱ {exp.duration} 分钟</span>
      <span>📚 {exp.knowledgePoints.length} 个知识点</span>
    </div>

    <div className="pt-3 border-t border-gray-100">
      <p className="text-xs text-gray-500 line-clamp-2">
        {exp.knowledgePoints.join(' · ')}
      </p>
    </div>
  </button>
)

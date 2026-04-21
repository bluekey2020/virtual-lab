import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

// Mock data
const mockTasks = [
  {
    id: 'task_1',
    title: '欧姆定律验证实验',
    description: '完成欧姆定律验证实验，记录至少3组数据，提交实验报告。',
    experimentId: 'ohm-law',
    assignedBy: '李老师',
    assignedAt: '2026-04-15',
    dueDate: '2026-04-25',
    status: 'pending',
  },
  {
    id: 'task_2',
    title: '串并联电路探究',
    description: '探究串联和并联电路的特点，测量各元件电压和电流。',
    experimentId: 'series-parallel',
    assignedBy: '李老师',
    assignedAt: '2026-04-18',
    dueDate: '2026-04-28',
    status: 'in-progress',
  },
  {
    id: 'task_3',
    title: '牛顿第二定律',
    description: '验证 F=ma 关系，探究力、质量与加速度的关系。',
    experimentId: 'newton-law',
    assignedBy: '王老师',
    assignedAt: '2026-04-10',
    dueDate: '2026-04-20',
    status: 'completed',
    score: 90,
  },
]

export const StudentTasks: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleStartTask = (experimentId: string) => {
    navigate(`/experiment/${experimentId}`)
  }

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
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                实验列表
              </a>
              <a
                href="/my-tasks"
                className="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg"
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
                <span className="text-sm text-gray-600">👨‍🎓 {user?.name}</span>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">我的任务</h2>
          <p className="text-gray-500 mt-1">查看老师布置的实验任务</p>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-amber-600">
              {mockTasks.filter((t) => t.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-500">待完成</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-indigo-600">
              {mockTasks.filter((t) => t.status === 'in-progress').length}
            </div>
            <div className="text-sm text-gray-500">进行中</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {mockTasks.filter((t) => t.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-500">已完成</div>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {mockTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        task.status === 'completed'
                          ? 'bg-green-50 text-green-600'
                          : task.status === 'in-progress'
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {task.status === 'completed'
                        ? '已完成'
                        : task.status === 'in-progress'
                        ? '进行中'
                        : '待完成'}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>👨‍🏫 {task.assignedBy}</span>
                    <span>📅 布置于 {task.assignedAt}</span>
                    <span
                      className={
                        task.status !== 'completed' && new Date(task.dueDate) < new Date()
                          ? 'text-red-500 font-medium'
                          : ''
                      }
                    >
                      ⏰ 截止 {task.dueDate}
                    </span>
                  </div>
                </div>

                <div className="ml-4 flex items-center gap-2">
                  {task.status === 'completed' && task.score && (
                    <div className="text-right mr-2">
                      <div className="text-lg font-bold text-green-600">{task.score}</div>
                      <div className="text-xs text-gray-400">分</div>
                    </div>
                  )}
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => handleStartTask(task.experimentId)}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      {task.status === 'in-progress' ? '继续实验' : '开始实验'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

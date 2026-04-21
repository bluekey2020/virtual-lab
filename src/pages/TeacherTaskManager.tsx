import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { experiments } from '../data/experiments'

interface Task {
  id: string
  title: string
  experimentId: string
  experimentTitle: string
  description: string
  assignedClass: string
  dueDate: string
  status: 'draft' | 'published' | 'expired'
  createdAt: string
}

export const TeacherTaskManager: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [tasks, setTasks] = useState<Task[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [experimentId, setExperimentId] = useState('')
  const [description, setDescription] = useState('')
  const [assignedClass, setAssignedClass] = useState('')
  const [dueDate, setDueDate] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const resetForm = () => {
    setTitle('')
    setExperimentId('')
    setDescription('')
    setAssignedClass('')
    setDueDate('')
    setShowCreate(false)
    setEditingTask(null)
  }

  const handleCreate = () => {
    if (!title || !experimentId || !dueDate) return

    const experiment = experiments.find((e) => e.id === experimentId)
    const newTask: Task = {
      id: `task_${Date.now()}`,
      title,
      experimentId,
      experimentTitle: experiment?.title || '',
      description,
      assignedClass,
      dueDate,
      status: 'draft',
      createdAt: new Date().toISOString(),
    }

    setTasks((prev) => [...prev, newTask])
    resetForm()
  }

  const handlePublish = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'published' as const } : t))
    )
  }

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
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
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                仪表盘
              </a>
              <a
                href="/teacher/tasks"
                className="px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg"
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">实验任务管理</h2>
            <p className="text-gray-500 mt-1">创建、编辑和发布实验任务给学生</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
          >
            + 新建任务
          </button>
        </div>

        {/* Task List */}
        {tasks.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">暂无实验任务</h3>
            <p className="text-gray-500 mb-4">点击「新建任务」开始布置第一个实验</p>
            <button
              onClick={() => setShowCreate(true)}
              className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              创建第一个任务
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          task.status === 'published'
                            ? 'bg-green-50 text-green-600'
                            : task.status === 'draft'
                            ? 'bg-gray-100 text-gray-600'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {task.status === 'published' ? '已发布' : task.status === 'draft' ? '草稿' : '已过期'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      实验：{task.experimentTitle}
                      {task.assignedClass && ` · 班级：${task.assignedClass}`}
                      {task.dueDate && ` · 截止：${task.dueDate}`}
                    </p>
                    {task.description && (
                      <p className="text-sm text-gray-600">{task.description}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {task.status === 'draft' && (
                      <button
                        onClick={() => handlePublish(task.id)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                      >
                        发布
                      </button>
                    )}
                    <button
                      onClick={() => setEditingTask(task)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Modal */}
      {(showCreate || editingTask) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingTask ? '编辑任务' : '新建实验任务'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  任务名称 *
                </label>
                <input
                  type="text"
                  value={editingTask?.title ?? title}
                  onChange={(e) => editingTask ? setEditingTask({ ...editingTask, title: e.target.value }) : setTitle(e.target.value)}
                  placeholder="如：欧姆定律验证实验"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  选择实验 *
                </label>
                <select
                  value={editingTask?.experimentId ?? experimentId}
                  onChange={(e) => editingTask ? setEditingTask({ ...editingTask, experimentId: e.target.value }) : setExperimentId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">请选择实验</option>
                  {experiments.map((exp) => (
                    <option key={exp.id} value={exp.id}>
                      {exp.title} ({exp.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  任务描述
                </label>
                <textarea
                  value={editingTask?.description ?? description}
                  onChange={(e) => editingTask ? setEditingTask({ ...editingTask, description: e.target.value }) : setDescription(e.target.value)}
                  placeholder="任务要求和说明..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    分配班级
                  </label>
                  <input
                    type="text"
                    value={editingTask?.assignedClass ?? assignedClass}
                    onChange={(e) => editingTask ? setEditingTask({ ...editingTask, assignedClass: e.target.value }) : setAssignedClass(e.target.value)}
                    placeholder="如：初三1班"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    截止日期 *
                  </label>
                  <input
                    type="date"
                    value={editingTask?.dueDate ?? dueDate}
                    onChange={(e) => editingTask ? setEditingTask({ ...editingTask, dueDate: e.target.value }) : setDueDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={editingTask ? () => {
                  setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? editingTask : t)))
                  resetForm()
                } : handleCreate}
                disabled={!(editingTask?.title ?? title) || !(editingTask?.experimentId ?? experimentId) || !(editingTask?.dueDate ?? dueDate)}
                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {editingTask ? '保存修改' : '创建任务'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

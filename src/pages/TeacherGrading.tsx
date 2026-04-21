import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface Submission {
  id: string
  studentName: string
  studentClass: string
  experimentTitle: string
  submittedAt: string
  score?: number
  comment?: string
  status: 'pending' | 'graded'
  report: string
}

// Mock data
const mockSubmissions: Submission[] = [
  {
    id: 'sub_1',
    studentName: '张三',
    studentClass: '初三1班',
    experimentTitle: '欧姆定律验证实验',
    submittedAt: '2026-04-19 14:30',
    status: 'pending',
    report: `实验报告

实验名称：欧姆定律验证实验
实验日期：2026-04-19
实验者：张三

一、实验目的
验证电流、电压、电阻关系、欧姆定律 I=U/R 相关原理。

二、实验器材
- battery
- switch
- resistor
- ammeter
- voltmeter

三、实验数据
共记录 3 组数据：

序号 | 电压(V) | 电流(A) | 电阻(Ω) | 备注
-----|---------|---------|---------|------
1    | 3.00    | 0.300   | 10.00   | 第一次测量
2    | 6.00    | 0.600   | 10.00   | 第二次测量
3    | 9.00    | 0.900   | 10.00   | 第三次测量

四、实验结论
通过本实验，我们验证了电流、电压、电阻关系、欧姆定律 I=U/R 的基本原理。`,
  },
  {
    id: 'sub_2',
    studentName: '李四',
    studentClass: '初三1班',
    experimentTitle: '串并联电路探究',
    submittedAt: '2026-04-18 16:45',
    status: 'pending',
    report: `实验报告

实验名称：串并联电路探究
实验者：李四

一、实验目的
验证电路连接、基尔霍夫定律、串并联电阻计算相关原理。

二、实验数据
暂无数据记录`,
  },
  {
    id: 'sub_3',
    studentName: '王五',
    studentClass: '初三2班',
    experimentTitle: '欧姆定律验证实验',
    submittedAt: '2026-04-17 10:20',
    status: 'graded',
    score: 85,
    comment: '实验数据记录完整，结论正确。建议增加误差分析部分。',
    report: `实验报告

实验名称：欧姆定律验证实验
实验者：王五

一、实验目的
验证欧姆定律 I=U/R 相关原理。

二、实验数据
共记录 2 组数据：

序号 | 电压(V) | 电流(A) | 电阻(Ω) | 备注
-----|---------|---------|---------|------
1    | 3.00    | 0.298   | 10.00   | 
2    | 6.00    | 0.602   | 10.00   |`,
  },
]

export const TeacherGrading: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [score, setScore] = useState('')
  const [comment, setComment] = useState('')
  const [filter, setFilter] = useState<'all' | 'pending' | 'graded'>('all')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleGrade = () => {
    if (!selectedSubmission || !score) return

    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === selectedSubmission.id
          ? { ...s, status: 'graded' as const, score: parseInt(score), comment }
          : s
      )
    )
    setSelectedSubmission(null)
    setScore('')
    setComment('')
  }

  const filteredSubmissions = submissions.filter((s) => {
    if (filter === 'all') return true
    return s.status === filter
  })

  const pendingCount = submissions.filter((s) => s.status === 'pending').length

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
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                任务管理
              </a>
              <a
                href="/teacher/grading"
                className="px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-lg"
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
            <h2 className="text-2xl font-bold text-gray-900">批改实验报告</h2>
            <p className="text-gray-500 mt-1">
              {pendingCount > 0 ? `${pendingCount} 份报告待批改` : '所有报告已批改完成'}
            </p>
          </div>

          {/* Filter */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['all', 'pending', 'graded'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                }`}
              >
                {f === 'all' ? '全部' : f === 'pending' ? `待批改 (${pendingCount})` : '已批改'}
              </button>
            ))}
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-3">
          {filteredSubmissions.map((sub) => (
            <div
              key={sub.id}
              className={`bg-white rounded-xl border p-5 hover:shadow-sm transition-all cursor-pointer ${
                sub.status === 'pending' ? 'border-amber-200' : 'border-gray-200'
              }`}
              onClick={() => setSelectedSubmission(sub)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-medium">
                    {sub.studentName[0]}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">
                      {sub.studentName}
                      <span className="text-sm text-gray-500 ml-2">{sub.studentClass}</span>
                    </h4>
                    <p className="text-sm text-gray-500">{sub.experimentTitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{sub.submittedAt}</p>
                    {sub.status === 'graded' && sub.score && (
                      <p className="text-sm font-medium text-green-600">{sub.score} 分</p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      sub.status === 'pending'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-green-50 text-green-600'
                    }`}
                  >
                    {sub.status === 'pending' ? '待批改' : '已批改'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">暂无报告</h3>
            <p className="text-gray-500">
              {filter === 'all' ? '学生还没有提交实验报告' : '该分类下没有报告'}
            </p>
          </div>
        )}
      </main>

      {/* Grading Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedSubmission.studentName} - {selectedSubmission.experimentTitle}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedSubmission.studentClass} · 提交于 {selectedSubmission.submittedAt}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedSubmission(null)
                  setScore('')
                  setComment('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-hidden flex">
              {/* Report Content */}
              <div className="flex-1 overflow-y-auto p-5 border-r border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-3">实验报告内容</h4>
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans bg-gray-50 p-4 rounded-lg">
                  {selectedSubmission.report}
                </pre>
              </div>

              {/* Grading Panel */}
              <div className="w-80 p-5 overflow-y-auto">
                <h4 className="text-sm font-medium text-gray-700 mb-4">评分</h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      分数 (0-100)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      placeholder="输入分数"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      评语
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="输入评语和建议..."
                      rows={6}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>

                  {selectedSubmission.status === 'graded' && selectedSubmission.comment && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs text-green-700 font-medium mb-1">已有评语：</p>
                      <p className="text-sm text-green-800">{selectedSubmission.comment}</p>
                    </div>
                  )}

                  <button
                    onClick={handleGrade}
                    disabled={!score}
                    className="w-full py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    提交评分
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface Report {
  id: string
  experimentTitle: string
  submittedAt: string
  score?: number
  comment?: string
  status: 'draft' | 'submitted' | 'graded'
  content: string
}

// Mock data
const mockReports: Report[] = [
  {
    id: 'report_1',
    experimentTitle: '欧姆定律验证实验',
    submittedAt: '2026-04-19 14:30',
    status: 'submitted',
    content: `实验报告

实验名称：欧姆定律验证实验
实验日期：2026-04-19

一、实验目的
验证电流、电压、电阻关系、欧姆定律 I=U/R 相关原理。

二、实验数据
共记录 3 组数据：

序号 | 电压(V) | 电流(A) | 电阻(Ω)
-----|---------|---------|--------
1    | 3.00    | 0.300   | 10.00
2    | 6.00    | 0.600   | 10.00
3    | 9.00    | 0.900   | 10.00

三、实验结论
通过本实验，我们验证了欧姆定律的基本原理。`,
  },
  {
    id: 'report_2',
    experimentTitle: '牛顿第二定律',
    submittedAt: '2026-04-17 10:20',
    status: 'graded',
    score: 90,
    comment: '实验数据记录完整，分析到位。建议增加误差讨论。',
    content: `实验报告

实验名称：牛顿第二定律
实验日期：2026-04-17

一、实验目的
验证力、质量、加速度、F=ma 相关原理。

二、实验数据
共记录 4 组数据：

序号 | 力(N) | 质量(kg) | 加速度(m/s²)
-----|-------|----------|-------------
1    | 1.0   | 0.5      | 2.0
2    | 2.0   | 0.5      | 4.0
3    | 1.0   | 1.0      | 1.0
4    | 2.0   | 1.0      | 2.0

三、实验结论
实验数据验证了 F=ma 的关系，加速度与力成正比，与质量成反比。`,
  },
  {
    id: 'report_3',
    experimentTitle: '串并联电路探究',
    submittedAt: '2026-04-15 09:00',
    status: 'draft',
    content: `实验报告

实验名称：串并联电路探究

一、实验目的
验证电路连接、基尔霍夫定律、串并联电阻计算相关原理。`,
  },
]

export const StudentReports: React.FC = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

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
                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                我的任务
              </a>
              <a
                href="/my-reports"
                className="px-3 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg"
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
          <h2 className="text-2xl font-bold text-gray-900">我的实验报告</h2>
          <p className="text-gray-500 mt-1">查看已提交和已批改的实验报告</p>
        </div>

        {/* Report Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-gray-600">
              {mockReports.filter((r) => r.status === 'draft').length}
            </div>
            <div className="text-sm text-gray-500">草稿</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-amber-600">
              {mockReports.filter((r) => r.status === 'submitted').length}
            </div>
            <div className="text-sm text-gray-500">待批改</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="text-2xl font-bold text-green-600">
              {mockReports.filter((r) => r.status === 'graded').length}
            </div>
            <div className="text-sm text-gray-500">已批改</div>
          </div>
        </div>

        {/* Report List */}
        <div className="space-y-4">
          {mockReports.map((report) => (
            <div
              key={report.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => setSelectedReport(report)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {report.experimentTitle}
                  </h3>
                  <p className="text-sm text-gray-500">提交于 {report.submittedAt}</p>
                </div>

                <div className="flex items-center gap-3">
                  {report.status === 'graded' && report.score && (
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{report.score}</div>
                      <div className="text-xs text-gray-400">分</div>
                    </div>
                  )}
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      report.status === 'graded'
                        ? 'bg-green-50 text-green-600'
                        : report.status === 'submitted'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {report.status === 'graded'
                      ? '已批改'
                      : report.status === 'submitted'
                      ? '待批改'
                      : '草稿'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {selectedReport.experimentTitle}
                </h3>
                <p className="text-sm text-gray-500">提交于 {selectedReport.submittedAt}</p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans bg-gray-50 p-4 rounded-lg">
                {selectedReport.content}
              </pre>

              {selectedReport.status === 'graded' && selectedReport.comment && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="text-sm font-medium text-green-700 mb-2">
                    教师评语 · {selectedReport.score} 分
                  </h4>
                  <p className="text-sm text-green-800">{selectedReport.comment}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

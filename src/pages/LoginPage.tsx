import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

type Role = 'student' | 'teacher'

export const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false)
  const [role, setRole] = useState<Role>('student')
  const [name, setName] = useState('')
  const [schoolId, setSchoolId] = useState('')
  const [grade, setGrade] = useState('')
  const [classNo, setClassNo] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [apiError, setApiError] = useState('')

  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)
  const navigate = useNavigate()

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = '请输入姓名'
    if (!schoolId.trim()) newErrors.schoolId = '请输入学校编号'
    if (role === 'student' && !grade.trim()) newErrors.grade = '请选择年级'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setApiError('')
    try {
      await login({
        name: name.trim(),
        schoolId: schoolId.trim(),
        role,
        grade: grade || undefined,
        classNo: classNo || undefined,
      })
      navigate(role === 'teacher' ? '/teacher' : '/')
    } catch (err: any) {
      setApiError(err.message || '登录失败，请重试')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔬</div>
          <h1 className="text-3xl font-bold text-gray-900">虚拟实验室</h1>
          <p className="text-gray-500 mt-1">物理 · 化学 · 实验操作仿真系统</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {/* Tab Switch */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                !isRegister ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              登录
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                isRegister ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              注册
            </button>
          </div>

          {/* Role Selection */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setRole('student')}
              className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                role === 'student'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">👨‍🎓</div>
              <div className="text-sm font-medium">学生</div>
            </button>
            <button
              onClick={() => setRole('teacher')}
              className={`flex-1 py-3 rounded-xl border-2 transition-all ${
                role === 'teacher'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">👨‍🏫</div>
              <div className="text-sm font-medium">教师</div>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {role === 'student' ? '学生姓名' : '教师姓名'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入姓名"
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.name ? 'border-red-400' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                学校编号
              </label>
              <input
                type="text"
                value={schoolId}
                onChange={(e) => setSchoolId(e.target.value)}
                placeholder="请输入学校编号"
                className={`w-full px-4 py-2.5 rounded-lg border ${
                  errors.schoolId ? 'border-red-400' : 'border-gray-200'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
              />
              {errors.schoolId && <p className="text-red-500 text-xs mt-1">{errors.schoolId}</p>}
            </div>

            {role === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    年级
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      errors.grade ? 'border-red-400' : 'border-gray-200'
                    } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
                  >
                    <option value="">请选择年级</option>
                    <option value="初一">初一</option>
                    <option value="初二">初二</option>
                    <option value="初三">初三</option>
                    <option value="高一">高一</option>
                    <option value="高二">高二</option>
                    <option value="高三">高三</option>
                  </select>
                  {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    班级（可选）
                  </label>
                  <input
                    type="text"
                    value={classNo}
                    onChange={(e) => setClassNo(e.target.value)}
                    placeholder="如：1班"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </>
            )}

            {apiError && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-200 mb-4">
                <p className="text-xs text-red-700">{apiError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? '登录中...' : isRegister ? '注册并登录' : '登录'}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-700">
              💡 <strong>演示模式</strong>：输入任意信息即可登录，数据仅保存在本地
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

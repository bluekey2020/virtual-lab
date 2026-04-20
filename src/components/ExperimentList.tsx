import React from 'react'
import { experiments } from '../data/experiments'

interface ExperimentListProps {
  onSelect: (id: string) => void
}

export const ExperimentList: React.FC<ExperimentListProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">虚拟实验室</h1>
          <p className="text-lg text-gray-600">物理 · 化学 · 实验操作仿真系统</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((exp) => (
            <button
              key={exp.id}
              onClick={() => onSelect(exp.id)}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-left hover:shadow-md hover:border-indigo-300 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{exp.subject === '物理' ? '⚛️' : '🧪'}</span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-600">
                  难度 {exp.difficulty}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                {exp.title}
              </h3>
              
              <p className="text-sm text-gray-500 mb-3">{exp.gradeLevel}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>⏱ {exp.duration} 分钟</span>
                <span>📚 {exp.knowledgePoints.length} 个知识点</span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 line-clamp-2">
                  {exp.knowledgePoints.join(' · ')}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

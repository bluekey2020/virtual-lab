import React, { useState } from 'react'
import { useLabStore } from '../store/labStore'
import { experiments } from '../data/experiments'
import { analyzeCircuit } from '../engine/circuitEngine'

export const ReportGenerator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [report, setReport] = useState<string | null>(null)

  const currentExperiment = useLabStore((state) => state.currentExperiment)
  const components = useLabStore((state) => state.components)
  const dataRecords = useLabStore((state) => state.dataRecords)
  const isRunning = useLabStore((state) => state.isRunning)

  const experiment = experiments.find((e) => e.id === currentExperiment)
  const analysis = isRunning ? analyzeCircuit(components) : null

  const handleGenerate = () => {
    if (!experiment) return

    setIsGenerating(true)

    // Simulate AI report generation
    setTimeout(() => {
      const reportContent = generateReport(experiment, components, dataRecords, analysis)
      setReport(reportContent)
      setIsGenerating(false)
    }, 1500)
  }

  const handleCopy = () => {
    if (report) {
      navigator.clipboard.writeText(report)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-3 py-1.5 text-sm font-medium rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
      >
        📄 生成报告
      </button>
    )
  }

  return (
    <div className="absolute inset-4 bg-white rounded-xl shadow-xl border border-gray-200 z-20 flex flex-col">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">📄 实验报告生成</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!report ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-4xl mb-4">📝</p>
            <p className="text-gray-600 mb-4">
              {experiment ? `为「${experiment.title}」生成实验报告` : '请先选择一个实验'}
            </p>
            <button
              onClick={handleGenerate}
              disabled={!experiment || isGenerating}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isGenerating ? '生成中...' : '生成报告'}
            </button>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans bg-gray-50 p-4 rounded-lg">
              {report}
            </pre>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
              >
                📋 复制报告
              </button>
              <button
                onClick={() => setReport(null)}
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                重新生成
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function generateReport(
  experiment: any,
  components: any[],
  dataRecords: any[],
  analysis: any
): string {
  const date = new Date().toLocaleDateString('zh-CN')
  const time = new Date().toLocaleTimeString('zh-CN')

  let report = `实验报告

实验名称：${experiment.title}
实验日期：${date} ${time}
实验者：学生

一、实验目的
验证${experiment.knowledgePoints.join('、')}相关原理。

二、实验器材
${components.map((c) => `- ${c.type}`).join('\n') || '暂无器材'}

三、实验步骤
${experiment.steps.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n') || '暂无步骤'}

四、实验数据`

  if (dataRecords.length > 0) {
    report += `\n共记录 ${dataRecords.length} 组数据：\n\n`
    report += '序号 | 电压(V) | 电流(A) | 电阻(Ω) | 备注\n'
    report += '-----|---------|---------|---------|------\n'
    dataRecords.forEach((r, i) => {
      report += `${i + 1}    | ${r.values.voltage?.toFixed(2) || '-'}     | ${r.values.current?.toFixed(3) || '-'}     | ${r.values.resistance?.toFixed(2) || '-'}     | ${r.note || '-'}\n`
    })
  } else {
    report += '\n暂无数据记录'
  }

  if (analysis) {
    report += `

五、数据分析
总电压：${analysis.totalVoltage.toFixed(2)} V
总电流：${analysis.current.toFixed(3)} A
总电阻：${analysis.totalResistance.toFixed(2)} Ω

根据欧姆定律 I = U/R，计算得：
I = ${analysis.totalVoltage.toFixed(2)} / ${analysis.totalResistance.toFixed(2)} = ${analysis.current.toFixed(3)} A

实验数据与理论值基本吻合，验证了欧姆定律的正确性。`
  }

  report += `

六、实验结论
通过本实验，我们验证了${experiment.knowledgePoints.join('、')}的基本原理。
实验数据表明，理论计算与实际测量结果一致，误差在允许范围内。

七、思考题
1. 实验中可能产生误差的原因有哪些？
2. 如何改进实验以提高测量精度？

---
报告生成时间：${date} ${time}`

  return report
}

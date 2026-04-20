import React, { useState } from 'react'
import { useLabStore } from '../store/labStore'
import { experiments } from '../data/experiments'

interface AIPanelProps {
  onClose: () => void
}

export const AIPanel: React.FC<AIPanelProps> = ({ onClose }) => {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const currentExperiment = useLabStore((state) => state.currentExperiment)
  const experiment = experiments.find((e) => e.id === currentExperiment)

  const handleSend = async () => {
    if (!question.trim()) return

    setMessages((prev) => [...prev, { role: 'user', content: question }])
    setIsThinking(true)

    setTimeout(() => {
      const aiResponse = generateAIResponse(question, experiment)
      setMessages((prev) => [...prev, { role: 'ai', content: aiResponse }])
      setIsThinking(false)
      setQuestion('')
    }, 1000)
  }

  const handleQuickAction = (action: string) => {
    if (!experiment) return

    let response = ''
    switch (action) {
      case 'principle':
        response = `**${experiment.title} - 实验原理**\n\n${experiment.knowledgePoints.join('、')}。\n\n本实验通过实际操作验证相关物理/化学定律，帮助你深入理解理论知识。`
        break
      case 'analyze':
        response = '请完成实验操作后，我将为你分析实验数据和结果趋势。'
        break
      case 'report':
        response = '实验完成后，我可以帮你生成结构化的实验报告草稿，包括实验目的、器材清单、数据表格和结论。'
        break
    }

    setMessages((prev) => [...prev, { role: 'ai', content: response }])
  }

  return (
    <div className="absolute bottom-4 right-4 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-20 flex flex-col max-h-[500px]">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🤖</span>
          <h3 className="font-semibold text-gray-800">AI 实验助手</h3>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          ✕
        </button>
      </div>

      <div className="p-3 flex gap-2 border-b border-gray-100">
        <button
          onClick={() => handleQuickAction('principle')}
          className="px-2 py-1 text-xs rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
        >
          原理讲解
        </button>
        <button
          onClick={() => handleQuickAction('analyze')}
          className="px-2 py-1 text-xs rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
        >
          AI 分析
        </button>
        <button
          onClick={() => handleQuickAction('report')}
          className="px-2 py-1 text-xs rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-colors"
        >
          生成报告
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[300px]">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm py-8">
            <p>你好！我是 AI 实验助手</p>
            <p className="mt-1">可以问我任何关于实验的问题</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg px-3 py-2 text-sm text-gray-500">
              思考中...
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="输入你的问题..."
          className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          发送
        </button>
      </div>
    </div>
  )
}

function generateAIResponse(question: string, experiment?: any): string {
  const q = question.toLowerCase()
  
  if (q.includes('欧姆') || q.includes('电流') || q.includes('电压') || q.includes('电阻')) {
    return `欧姆定律指出：导体中的电流 (I) 与导体两端的电压 (U) 成正比，与导体的电阻 (R) 成反比。

公式：I = U / R

其中：
• I - 电流，单位安培 (A)
• U - 电压，单位伏特 (V)  
• R - 电阻，单位欧姆 (Ω)

在实验中，你可以通过改变电压或电阻来观察电流的变化，验证这一定律。`
  }
  
  if (q.includes('怎么') || q.includes('如何')) {
    return `进行${experiment?.title || '本实验'}的步骤：

1. 从左侧器材库拖拽所需器材到实验台
2. 按照电路图连接各器材
3. 检查电路连接是否正确
4. 点击「运行实验」观察数据
5. 记录测量数据并分析

如果遇到困难，可以随时向我提问！`
  }

  return `这是一个很好的问题！关于"${question}"，我建议：

1. 仔细观察实验中的现象
2. 记录相关数据
3. 对比理论知识进行分析

你可以尝试操作实验，我会根据你的操作给出更具体的建议。`
}

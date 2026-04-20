import { ExperimentRecord, Equipment } from '../types'

export const experiments: ExperimentRecord[] = [
  {
    id: 'ohm-law',
    title: '欧姆定律验证实验',
    subject: '物理',
    gradeLevel: '初三 / 高一',
    duration: 25,
    difficulty: 2,
    knowledgePoints: ['电流', '电压', '电阻关系', '欧姆定律 I=U/R'],
    steps: [
      '连接电路：将电源、开关、定值电阻、电流表串联',
      '将电压表并联在定值电阻两端',
      '闭合开关，记录电流表和电压表示数',
      '改变电源电压，重复测量 3 次',
      '分析数据，验证 I=U/R 关系',
    ],
    equipmentList: ['battery', 'switch', 'resistor', 'ammeter', 'voltmeter', 'wire'],
  },
  {
    id: 'series-parallel',
    title: '串并联电路探究',
    subject: '物理',
    gradeLevel: '初三',
    duration: 30,
    difficulty: 3,
    knowledgePoints: ['电路连接', '基尔霍夫定律', '串并联电阻计算'],
    steps: [],
    equipmentList: ['battery', 'switch', 'resistor', 'ammeter', 'voltmeter', 'wire'],
  },
  {
    id: 'newton-law',
    title: '牛顿第二定律',
    subject: '物理',
    gradeLevel: '高一',
    duration: 30,
    difficulty: 3,
    knowledgePoints: ['力', '质量', '加速度', 'F=ma'],
    steps: [],
    equipmentList: ['cart', 'pulley', 'weight', 'timer', 'ruler'],
  },
]

export const equipmentCatalog: Equipment[] = [
  { id: 'battery', name: '电源', category: '电源类', icon: '🔋', properties: { voltage: 3 }, width: 80, height: 50 },
  { id: 'switch', name: '开关', category: '控制类', icon: '🔘', properties: { closed: 0 }, width: 60, height: 40 },
  { id: 'resistor', name: '定值电阻', category: '元件类', icon: '⚡', properties: { resistance: 10 }, width: 80, height: 30 },
  { id: 'ammeter', name: '电流表', category: '测量类', icon: '📊', properties: { range: 1 }, width: 70, height: 70 },
  { id: 'voltmeter', name: '电压表', category: '测量类', icon: '📊', properties: { range: 10 }, width: 70, height: 70 },
  { id: 'bulb', name: '小灯泡', category: '元件类', icon: '💡', properties: { resistance: 5, brightness: 0 }, width: 50, height: 50 },
  { id: 'wire', name: '导线', category: '连接类', icon: '〰️', properties: {}, width: 100, height: 10 },
]

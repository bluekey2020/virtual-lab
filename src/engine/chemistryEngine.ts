import type { CircuitComponent } from '../types'

// ===== 化学物质定义 =====

export interface ChemicalSubstance {
  id: string
  name: string
  formula: string
  type: 'acid' | 'base' | 'salt' | 'metal' | 'indicator' | 'solvent' | 'gas'
  concentration?: number // mol/L
  volume?: number // mL
  mass?: number // g
  pH?: number
  color?: string
  state: 'solid' | 'liquid' | 'gas' | 'aqueous'
}

// ===== 化学反应定义 =====

export interface ChemicalReaction {
  id: string
  name: string
  equation: string
  type: 'neutralization' | 'electrolysis' | 'displacement' | 'precipitation' | 'decomposition'
  reactants: string[]
  products: string[]
  conditions?: string
  observablePhenomena: string[]
  heatChange?: 'exothermic' | 'endothermic' | 'none'
}

// ===== 实验状态 =====

export interface ChemistryExperimentState {
  substances: ChemicalSubstance[]
  reactions: ChemicalReaction[]
  temperature: number // °C
  pressure: number // kPa
  time: number // seconds
  isRunning: boolean
  observations: string[]
  gasVolume: Record<string, number> // gas type -> volume in mL
  precipitate: Record<string, number> // precipitate type -> mass in g
  ph: number
  color: string
}

// ===== 预定义化学物质 =====

export const SUBSTANCES: Record<string, ChemicalSubstance> = {
  hcl: {
    id: 'hcl',
    name: '盐酸',
    formula: 'HCl',
    type: 'acid',
    concentration: 1.0,
    pH: 0,
    color: '无色',
    state: 'aqueous',
  },
  naoh: {
    id: 'naoh',
    name: '氢氧化钠',
    formula: 'NaOH',
    type: 'base',
    concentration: 1.0,
    pH: 14,
    color: '无色',
    state: 'aqueous',
  },
  h2so4: {
    id: 'h2so4',
    name: '稀硫酸',
    formula: 'H₂SO₄',
    type: 'acid',
    concentration: 1.0,
    pH: 0.3,
    color: '无色',
    state: 'aqueous',
  },
  na2s2o3: {
    id: 'na2s2o3',
    name: '硫代硫酸钠',
    formula: 'Na₂S₂O₃',
    type: 'salt',
    concentration: 0.1,
    color: '无色',
    state: 'aqueous',
  },
  cuso4: {
    id: 'cuso4',
    name: '硫酸铜',
    formula: 'CuSO₄',
    type: 'salt',
    concentration: 0.5,
    color: '蓝色',
    state: 'aqueous',
  },
  phenolphthalein: {
    id: 'phenolphthalein',
    name: '酚酞',
    formula: 'C₂₀H₁₄O₄',
    type: 'indicator',
    color: '无色',
    state: 'aqueous',
  },
  mg: {
    id: 'mg',
    name: '镁条',
    formula: 'Mg',
    type: 'metal',
    mass: 0.5,
    color: '银白色',
    state: 'solid',
  },
  zn: {
    id: 'zn',
    name: '锌粒',
    formula: 'Zn',
    type: 'metal',
    mass: 1.0,
    color: '银灰色',
    state: 'solid',
  },
  fe: {
    id: 'fe',
    name: '铁钉',
    formula: 'Fe',
    type: 'metal',
    mass: 2.0,
    color: '银灰色',
    state: 'solid',
  },
  cu: {
    id: 'cu',
    name: '铜片',
    formula: 'Cu',
    type: 'metal',
    mass: 2.0,
    color: '紫红色',
    state: 'solid',
  },
  h2: {
    id: 'h2',
    name: '氢气',
    formula: 'H₂',
    type: 'gas',
    color: '无色',
    state: 'gas',
  },
  o2: {
    id: 'o2',
    name: '氧气',
    formula: 'O₂',
    type: 'gas',
    color: '无色',
    state: 'gas',
  },
  h2o: {
    id: 'h2o',
    name: '水',
    formula: 'H₂O',
    type: 'solvent',
    volume: 100,
    pH: 7,
    color: '无色',
    state: 'liquid',
  },
}

// ===== 预定义化学反应 =====

export const REACTIONS: Record<string, ChemicalReaction> = {
  hcl_naoh: {
    id: 'hcl_naoh',
    name: '盐酸与氢氧化钠中和',
    equation: 'HCl + NaOH → NaCl + H₂O',
    type: 'neutralization',
    reactants: ['hcl', 'naoh'],
    products: ['nacl', 'h2o'],
    observablePhenomena: ['溶液温度升高', '酚酞由红色变为无色'],
    heatChange: 'exothermic',
  },
  electrolysis_water: {
    id: 'electrolysis_water',
    name: '电解水',
    equation: '2H₂O → 2H₂↑ + O₂↑',
    type: 'electrolysis',
    reactants: ['h2o'],
    products: ['h2', 'o2'],
    conditions: '直流电',
    observablePhenomena: ['阴极产生氢气', '阳极产生氧气', '气体体积比 H₂:O₂ = 2:1'],
  },
  mg_hcl: {
    id: 'mg_hcl',
    name: '镁与盐酸反应',
    equation: 'Mg + 2HCl → MgCl₂ + H₂↑',
    type: 'displacement',
    reactants: ['mg', 'hcl'],
    products: ['mgcl2', 'h2'],
    observablePhenomena: ['剧烈反应', '产生大量气泡', '镁条逐渐溶解'],
    heatChange: 'exothermic',
  },
  zn_hcl: {
    id: 'zn_hcl',
    name: '锌与盐酸反应',
    equation: 'Zn + 2HCl → ZnCl₂ + H₂↑',
    type: 'displacement',
    reactants: ['zn', 'hcl'],
    products: ['zncl2', 'h2'],
    observablePhenomena: ['产生气泡', '锌粒逐渐溶解'],
    heatChange: 'exothermic',
  },
  fe_hcl: {
    id: 'fe_hcl',
    name: '铁与盐酸反应',
    equation: 'Fe + 2HCl → FeCl₂ + H₂↑',
    type: 'displacement',
    reactants: ['fe', 'hcl'],
    products: ['fecl2', 'h2'],
    observablePhenomena: ['缓慢产生气泡', '溶液变为浅绿色'],
    heatChange: 'exothermic',
  },
  cu_hcl: {
    id: 'cu_hcl',
    name: '铜与盐酸反应',
    equation: 'Cu + HCl → 不反应',
    type: 'displacement',
    reactants: ['cu', 'hcl'],
    products: [],
    observablePhenomena: ['无明显现象', '铜不溶于稀盐酸'],
  },
  fe_cuso4: {
    id: 'fe_cuso4',
    name: '铁与硫酸铜反应',
    equation: 'Fe + CuSO₄ → FeSO₄ + Cu',
    type: 'displacement',
    reactants: ['fe', 'cuso4'],
    products: ['feso4', 'cu'],
    observablePhenomena: ['铁钉表面析出红色铜', '溶液由蓝色变为浅绿色'],
  },
  na2s2o3_h2so4: {
    id: 'na2s2o3_h2so4',
    name: '硫代硫酸钠与硫酸反应',
    equation: 'Na₂S₂O₃ + H₂SO₄ → Na₂SO₄ + S↓ + SO₂↑ + H₂O',
    type: 'decomposition',
    reactants: ['na2s2o3', 'h2so4'],
    products: ['na2so4', 's', 'so2', 'h2o'],
    observablePhenomena: ['溶液变浑浊', '产生淡黄色硫沉淀', '有刺激性气味'],
  },
}

// ===== 金属活动性顺序 =====

export const METAL_ACTIVITY_SERIES = ['K', 'Ca', 'Na', 'Mg', 'Al', 'Zn', 'Fe', 'Sn', 'Pb', '(H)', 'Cu', 'Hg', 'Ag', 'Pt', 'Au']

export function getMetalActivity(metal: string): number {
  // Case-insensitive search
  const symbol = metal.charAt(0).toUpperCase() + metal.slice(1).toLowerCase()
  const searchSymbol = symbol === 'H' ? '(H)' : symbol
  const index = METAL_ACTIVITY_SERIES.indexOf(searchSymbol)
  return index >= 0 ? METAL_ACTIVITY_SERIES.length - index : 0
}

export function canDisplace(metal1: string, metal2: string): boolean {
  return getMetalActivity(metal1) > getMetalActivity(metal2)
}

// ===== 化学仿真引擎 =====

export interface ChemistryAnalysisResult {
  reactions: {
    reactionId: string
    reactionName: string
    equation: string
    isHappening: boolean
    rate: number // 0-1
    phenomena: string[]
  }[]
  ph: number
  temperature: number
  gasProduced: Record<string, number>
  precipitate: Record<string, number>
  solutionColor: string
  observations: string[]
}

/**
 * 分析当前化学实验状态，计算所有可能发生的反应
 */
export function analyzeChemistry(components: CircuitComponent[]): ChemistryAnalysisResult {
  const componentTypes = components.map((c) => c.type)
  const result: ChemistryAnalysisResult = {
    reactions: [],
    ph: 7,
    temperature: 25,
    gasProduced: {},
    precipitate: {},
    solutionColor: '无色',
    observations: [],
  }

  // 检测每种可能的反应
  for (const [reactionId, reaction] of Object.entries(REACTIONS)) {
    const allReactantsPresent = reaction.reactants.every((r) =>
      componentTypes.includes(r) || componentTypes.some((t) => isSubstanceOfType(t, r))
    )

    if (allReactantsPresent) {
      const rate = calculateReactionRate(reaction, components)
      const phenomena = getReactionPhenomena(reaction, components)

      result.reactions.push({
        reactionId,
        reactionName: reaction.name,
        equation: reaction.equation,
        isHappening: rate > 0,
        rate,
        phenomena,
      })

      // 收集气体产物
      if (reaction.products.includes('h2')) {
        result.gasProduced['H₂'] = (result.gasProduced['H₂'] || 0) + rate * 50
      }
      if (reaction.products.includes('o2')) {
        result.gasProduced['O₂'] = (result.gasProduced['O₂'] || 0) + rate * 25
      }

      // 收集沉淀
      if (reaction.products.includes('s')) {
        result.precipitate['S'] = (result.precipitate['S'] || 0) + rate * 0.5
      }

      // 温度变化
      if (reaction.heatChange === 'exothermic') {
        result.temperature += rate * 10
      }

      // 观察现象
      result.observations.push(...phenomena)
    }
  }

  // 计算 pH
  result.ph = calculatePH(components)

  // 溶液颜色
  result.solutionColor = calculateSolutionColor(components, result.reactions)

  return result
}

/**
 * 判断组件类型是否对应某种化学物质
 */
function isSubstanceOfType(componentType: string, substanceId: string): boolean {
  const mapping: Record<string, string[]> = {
    'acid-solution': ['hcl', 'h2so4'],
    'na2s2o3-solution': ['na2s2o3'],
    'metal-mg': ['mg'],
    'metal-zn': ['zn'],
    'metal-fe': ['fe'],
    'metal-cu': ['cu'],
    'indicator': ['phenolphthalein'],
    'electrolyzer': ['h2o'],
    'beaker': ['h2o'],
    'test-tube': ['h2o'],
    'conical-flask': ['h2o'],
    'burette': ['hcl', 'naoh'],
  }
  return (mapping[componentType] || []).includes(substanceId)
}

/**
 * 计算反应速率 (0-1)
 */
function calculateReactionRate(reaction: ChemicalReaction, components: CircuitComponent[]): number {
  const baseRate = 0.8

  // 金属活动性影响
  if (reaction.type === 'displacement') {
    const metalComp = components.find((c) => c.type.startsWith('metal-'))
    if (metalComp) {
      const metalSymbol = metalComp.type.replace('metal-', '').toUpperCase()
      const activity = getMetalActivity(metalSymbol)
      return Math.min(baseRate * (activity / METAL_ACTIVITY_SERIES.length) * 2, 1)
    }
  }

  // 浓度影响
  if (reaction.type === 'decomposition') {
    return baseRate * 0.7
  }

  // 中和反应
  if (reaction.type === 'neutralization') {
    return baseRate * 0.9
  }

  // 电解反应
  if (reaction.type === 'electrolysis') {
    const hasBattery = components.some((c) => c.type === 'battery')
    const voltage = components.find((c) => c.type === 'battery')?.properties.voltage || 0
    return hasBattery && voltage > 1.5 ? baseRate * 0.6 : 0
  }

  return baseRate
}

/**
 * 获取反应现象描述
 */
function getReactionPhenomena(reaction: ChemicalReaction, _components: CircuitComponent[]): string[] {
  return reaction.observablePhenomena
}

/**
 * 计算溶液 pH 值
 */
function calculatePH(components: CircuitComponent[]): number {
  const hasAcid = components.some((c) => c.type === 'acid-solution')
  const hasBase = components.some((c) => c.type === 'na2s2o3-solution')

  if (hasAcid && !hasBase) return 1
  if (hasBase && !hasAcid) return 12
  if (hasAcid && hasBase) return 7
  return 7
}

/**
 * 计算溶液颜色
 */
function calculateSolutionColor(
  components: CircuitComponent[],
  reactions: ChemistryAnalysisResult['reactions']
): string {
  const hasCuSO4 = components.some((c) => c.type === 'cuso4' || c.type === 'acid-solution')
  const hasFeReaction = reactions.some((r) => r.reactionId === 'fe_cuso4' && r.isHappening)

  if (hasFeReaction) return '浅绿色'
  if (hasCuSO4) return '蓝色'
  return '无色'
}

/**
 * 滴定计算
 */
export interface TitrationResult {
  volumeUsed: number // 滴定剂体积 mL
  concentration: number // 待测液浓度 mol/L
  equivalencePoint: boolean
  indicatorColor: string
  pH: number
}

export function calculateTitration(
  titrantConcentration: number,
  titrantVolume: number,
  analyteConcentration: number,
  analyteVolume: number,
  stoichiometry: number = 1
): TitrationResult {
  const analyteMoles = analyteConcentration * (analyteVolume / 1000)
  const equivalenceVolume = (analyteMoles * stoichiometry) / titrantConcentration * 1000

  const isAtEquivalence = Math.abs(titrantVolume - equivalenceVolume) < 1.0
  const isPastEquivalence = titrantVolume > equivalenceVolume + 0.5

  // 酚酞变色范围 pH 8.2-10.0
  const pH = isPastEquivalence ? 10 : isAtEquivalence ? 8.5 : 3
  const indicatorColor = isPastEquivalence ? '红色' : '无色'

  const calculatedConcentration = (titrantConcentration * titrantVolume) / (analyteVolume * stoichiometry)

  return {
    volumeUsed: titrantVolume,
    concentration: calculatedConcentration,
    equivalencePoint: isAtEquivalence,
    indicatorColor,
    pH,
  }
}

/**
 * 气体定律计算 (玻意耳定律 PV = nRT)
 */
export interface GasLawResult {
  pressure: number
  volume: number
  temperature: number
  isValid: boolean
  pvProduct: number
}

export function calculateBoyleLaw(
  p1: number,
  v1: number,
  v2: number,
  temperature: number = 298
): GasLawResult {
  const p2 = (p1 * v1) / v2
  const pvProduct = p1 * v1

  return {
    pressure: p2,
    volume: v2,
    temperature,
    isValid: Math.abs(p2 * v2 - pvProduct) < 0.01,
    pvProduct,
  }
}

/**
 * 反应速率计算
 */
export interface ReactionRateResult {
  rate: number // mol/(L·s)
  concentration: number
  time: number
  order: number
}

export function calculateReactionRate2(
  concentration: number,
  rateConstant: number,
  order: number = 1
): ReactionRateResult {
  const rate = rateConstant * Math.pow(concentration, order)
  return {
    rate,
    concentration,
    time: 0,
    order,
  }
}

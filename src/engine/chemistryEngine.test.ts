import { describe, it, expect } from 'vitest'
import {
  getMetalActivity,
  canDisplace,
  calculateTitration,
  calculateBoyleLaw,
  calculateReactionRate2,
  analyzeChemistry,
  REACTIONS,
  SUBSTANCES,
  METAL_ACTIVITY_SERIES,
} from './chemistryEngine'

describe('Chemistry Engine', () => {
  describe('Metal Activity Series', () => {
    it('should return correct activity order', () => {
      expect(getMetalActivity('Mg')).toBeGreaterThan(getMetalActivity('Zn'))
      expect(getMetalActivity('Zn')).toBeGreaterThan(getMetalActivity('Fe'))
      expect(getMetalActivity('Fe')).toBeGreaterThan(getMetalActivity('Cu'))
    })

    it('should correctly predict displacement reactions', () => {
      expect(canDisplace('Mg', 'Zn')).toBe(true)
      expect(canDisplace('Zn', 'Fe')).toBe(true)
      expect(canDisplace('Fe', 'Cu')).toBe(true)
      expect(canDisplace('Cu', 'Fe')).toBe(false)
      expect(canDisplace('Cu', 'Zn')).toBe(false)
    })

    it('should include all common metals', () => {
      expect(METAL_ACTIVITY_SERIES).toContain('Mg')
      expect(METAL_ACTIVITY_SERIES).toContain('Zn')
      expect(METAL_ACTIVITY_SERIES).toContain('Fe')
      expect(METAL_ACTIVITY_SERIES).toContain('Cu')
      expect(METAL_ACTIVITY_SERIES).toContain('(H)')
    })
  })

  describe('Titration Calculation', () => {
    it('should calculate equivalence point correctly', () => {
      // 0.1 mol/L HCl titrating 25 mL of 0.1 mol/L NaOH
      const result = calculateTitration(0.1, 25, 0.1, 25)
      expect(result.equivalencePoint).toBe(true)
      expect(result.indicatorColor).toBe('无色') // At equivalence pH~8.5, phenolphthalein just starting
      expect(result.pH).toBeGreaterThan(8)
    })

    it('should detect before equivalence point', () => {
      const result = calculateTitration(0.1, 10, 0.1, 25)
      expect(result.equivalencePoint).toBe(false)
      expect(result.indicatorColor).toBe('无色')
      expect(result.pH).toBeLessThan(7)
    })

    it('should detect past equivalence point', () => {
      const result = calculateTitration(0.1, 30, 0.1, 25)
      expect(result.equivalencePoint).toBe(false)
      expect(result.indicatorColor).toBe('红色')
      expect(result.pH).toBeGreaterThan(8)
    })

    it('should calculate unknown concentration', () => {
      const result = calculateTitration(0.1, 20, 0, 25)
      expect(result.concentration).toBeCloseTo(0.08, 2)
    })
  })

  describe('Boyle Law (PV = constant)', () => {
    it('should calculate pressure when volume changes', () => {
      const result = calculateBoyleLaw(101.3, 50, 25)
      expect(result.pressure).toBeCloseTo(202.6, 0)
    })

    it('should verify PV product is constant', () => {
      const result = calculateBoyleLaw(100, 40, 20)
      expect(result.isValid).toBe(true)
      expect(result.pressure * result.volume).toBeCloseTo(100 * 40, 0)
    })

    it('should handle volume increase', () => {
      const result = calculateBoyleLaw(101.3, 20, 40)
      expect(result.pressure).toBeCloseTo(50.65, 0)
    })
  })

  describe('Reaction Rate', () => {
    it('should calculate first-order rate', () => {
      const result = calculateReactionRate2(1.0, 0.05, 1)
      expect(result.rate).toBeCloseTo(0.05, 3)
    })

    it('should calculate second-order rate', () => {
      const result = calculateReactionRate2(2.0, 0.01, 2)
      expect(result.rate).toBeCloseTo(0.04, 3)
    })

    it('should show rate proportional to concentration for first-order', () => {
      const r1 = calculateReactionRate2(1.0, 0.1, 1)
      const r2 = calculateReactionRate2(2.0, 0.1, 1)
      expect(r2.rate).toBeCloseTo(r1.rate * 2, 3)
    })
  })

  describe('Chemical Reactions', () => {
    it('should have all expected reactions defined', () => {
      expect(REACTIONS).toHaveProperty('hcl_naoh')
      expect(REACTIONS).toHaveProperty('electrolysis_water')
      expect(REACTIONS).toHaveProperty('mg_hcl')
      expect(REACTIONS).toHaveProperty('zn_hcl')
      expect(REACTIONS).toHaveProperty('fe_cuso4')
    })

    it('should have correct neutralization equation', () => {
      expect(REACTIONS.hcl_naoh.equation).toBe('HCl + NaOH → NaCl + H₂O')
      expect(REACTIONS.hcl_naoh.type).toBe('neutralization')
    })

    it('should have correct electrolysis equation', () => {
      expect(REACTIONS.electrolysis_water.equation).toBe('2H₂O → 2H₂↑ + O₂↑')
      expect(REACTIONS.electrolysis_water.products).toContain('h2')
      expect(REACTIONS.electrolysis_water.products).toContain('o2')
    })
  })

  describe('Substances', () => {
    it('should have all expected substances', () => {
      expect(SUBSTANCES).toHaveProperty('hcl')
      expect(SUBSTANCES).toHaveProperty('naoh')
      expect(SUBSTANCES).toHaveProperty('h2so4')
      expect(SUBSTANCES).toHaveProperty('cuso4')
      expect(SUBSTANCES).toHaveProperty('phenolphthalein')
    })

    it('should have correct acid properties', () => {
      expect(SUBSTANCES.hcl.type).toBe('acid')
      expect(SUBSTANCES.hcl.pH).toBe(0)
    })

    it('should have correct base properties', () => {
      expect(SUBSTANCES.naoh.type).toBe('base')
      expect(SUBSTANCES.naoh.pH).toBe(14)
    })
  })

  describe('Chemistry Analysis', () => {
    it('should return empty results with no components', () => {
      const result = analyzeChemistry([])
      expect(result.reactions).toHaveLength(0)
      expect(result.ph).toBe(7)
    })

    it('should detect acid presence', () => {
      const result = analyzeChemistry([
        { id: '1', type: 'acid-solution', x: 0, y: 0, rotation: 0, properties: {}, connections: [] },
      ])
      expect(result.ph).toBeLessThan(7)
    })
  })
})

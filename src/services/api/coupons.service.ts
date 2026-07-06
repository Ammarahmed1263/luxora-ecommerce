import { http } from '../http'
import type { ApiResponse } from '@/types/api.types'

export interface Coupon {
  _id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minimumPurchase: number
  maximumDiscount?: number
  usageLimit?: number
  usageCount: number
  perUserLimit: number
  isActive: boolean
  expiresAt?: string
  createdAt: string
  updatedAt: string
}

export const couponsService = {
  getAll: async (): Promise<Coupon[]> => {
    try {
      const response = await http.get<ApiResponse<{ coupons: Coupon[] }>>('/coupons')
      if (response.data?.success && response.data?.data?.coupons) {
        return response.data.data.coupons
      }
      return []
    } catch {
      return []
    }
  },
  create: async (payload: Partial<Coupon>): Promise<Coupon> => {
    const res = await http.post<ApiResponse<{ coupon: Coupon }>>('/coupons', payload)
    return res.data.data.coupon
  },
  update: async (id: string, payload: Partial<Coupon>): Promise<Coupon> => {
    const res = await http.patch<ApiResponse<{ coupon: Coupon }>>(`/coupons/${id}`, payload)
    return res.data.data.coupon
  },
  delete: async (id: string): Promise<void> => {
    await http.delete(`/coupons/${id}`)
  }
}

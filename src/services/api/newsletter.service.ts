import { http } from '../http'
import type { ApiResponse } from '@/types/api.types'
import type { AdminPaginatedResult } from '@/types/admin.types'

export interface Subscriber {
  _id: string
  email: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export const newsletterService = {
  subscribe: async (email: string): Promise<any> => {
    const res = await http.post<ApiResponse<any>>('/newsletter/subscribe', { email })
    return res.data
  },
  unsubscribe: async (email: string): Promise<any> => {
    const res = await http.post<ApiResponse<any>>('/newsletter/unsubscribe', { email })
    return res.data
  },
  getSubscribers: async (params: any): Promise<AdminPaginatedResult<Subscriber>> => {
    const res = await http.get('/newsletter', { params })
    return {
      data: res.data.data.subscribers,
      total: res.data.meta.total,
      page: res.data.meta.page,
      limit: res.data.meta.limit,
      totalPages: Math.ceil(res.data.meta.total / res.data.meta.limit)
    }
  }
}

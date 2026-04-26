import { apiFetch } from './base-api.service';
import type { Block } from '../types';

// Hardcoded student ID for demonstration since there's no auth yet
const STUDENT_ID = '123e4567-e89b-12d3-a456-426614174000';

export const ForbiddenZonesService = {
  getAll: async () => {
    const data = await apiFetch<any[]>(`/students/${STUDENT_ID}/time-blocks`);
    return data.map(b => {
      const blockData = b.props ? b.props : b;
      return { 
        ...blockData, 
        dayOfWeek: parseInt(blockData.dayOfWeek),
        startDate: blockData.recurrenceStartDate ? blockData.recurrenceStartDate.split('T')[0] : undefined,
        endDate: blockData.recurrenceEndDate ? blockData.recurrenceEndDate.split('T')[0] : undefined
      };
    });
  },
  
  create: async (block: Omit<Block, 'id'>) => {
    const payload = { ...block, dayOfWeek: String(block.dayOfWeek) };
    const saved = await apiFetch<any>(`/students/${STUDENT_ID}/time-blocks`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const blockData = saved.props ? saved.props : saved;
    return { 
      ...blockData, 
      dayOfWeek: parseInt(blockData.dayOfWeek),
      startDate: blockData.recurrenceStartDate ? blockData.recurrenceStartDate.split('T')[0] : undefined,
      endDate: blockData.recurrenceEndDate ? blockData.recurrenceEndDate.split('T')[0] : undefined
    };
  },
  
  update: async (id: string, block: Partial<Block>) => {
    const payload = { ...block, dayOfWeek: block.dayOfWeek ? String(block.dayOfWeek) : undefined };
    const updated = await apiFetch<any>(`/students/${STUDENT_ID}/time-blocks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    const blockData = updated.props ? updated.props : updated;
    return { 
      ...blockData, 
      dayOfWeek: parseInt(blockData.dayOfWeek),
      startDate: blockData.recurrenceStartDate ? blockData.recurrenceStartDate.split('T')[0] : undefined,
      endDate: blockData.recurrenceEndDate ? blockData.recurrenceEndDate.split('T')[0] : undefined
    };
  },
  
  delete: (id: string) => apiFetch<void>(`/students/${STUDENT_ID}/time-blocks/${id}`, {
    method: 'DELETE'
  })
};

export type BlockType = 'TRABAJO' | 'BIENESTAR' | 'OTRO';

export interface Block {
  id: string;
  dayOfWeek: number; // 1 = Lunes, 7 = Domingo
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  type: BlockType;
  isRecurring: boolean;
  startDate?: string; // "YYYY-MM-DD"
  endDate?: string;   // "YYYY-MM-DD"
}

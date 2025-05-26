export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: 'pendente' | 'em_andamento' | 'concluida';
  priority: 'baixa' | 'media' | 'alta';
  due_date?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: number;
}
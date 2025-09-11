export type Writer = {
  _id: string;
  username: string;
  email: string;
  phone: number;
  role: 'admin' | 'client' | 'writer';
  assigned_tasks: []; 
  posted_jobs: []; 
  is_assigned: boolean;
  created_at: string;
}

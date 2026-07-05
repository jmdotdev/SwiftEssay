export type UserRole = 'admin' | 'writer'

export type OrderStatus = 'unassigned' | 'assigned' | 'in_progress' | 'revision' | 'completed' | 'cancelled'

export type PaymentStatus = 'pending' | 'paid' | 'cancelled'

export interface User {
  _id: string
  username: string
  email: string
  role: UserRole
  status: 'active' | 'inactive'
  avatar?: string
  createdAt: string
}

export interface Writer extends User {
  role: 'writer'
  tasksCompleted: number
  pendingTasks: number
  inRevision: number
  canceledTasks?: number
  currentActiveTask?: string
  activeOrderCount?: number
  hasActiveOrder?: boolean
}

export interface Order {
  _id: string
  id?: string
  title: string
  description: string
  status: OrderStatus
  totalPrice: number
  isPaid?: boolean
  price_per_page?: number
  total_pages?: number
  deadline: string | Date
  discipline: string
  posted_by: User | string
  assigned_to?: User | string
  assignedWriterId?: string
  assignedWriter?: Writer
  files: FileAttachment[]
  submitted_files?: OrderFile[]
  createdAt: string
  updatedAt: string
  comments?: Comment[]
}

export interface Comment {
  id: string
  orderId: string
  userId: string
  userName: string
  content: string
  createdAt: string
}

export interface FileAttachment {
  id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: string
}

export interface OrderFile {
  public_id: string
  url: string
  name: string
}

export interface Payment {
  id: string
  orderId: string
  orderTitle: string
  writerId: string
  writerName: string
  amount: number
  status: PaymentStatus
  paidAt?: string
  createdAt: string
}

export interface DashboardMetrics {
  totalTasks: number
  assignedTasks: number
  pendingTasks: number
  completedTasks: number
}

export interface WriterMetrics {
  completedOrders: number
  pendingOrders: number
  inRevision: number
  cancelledOrders: number
}

export interface PaymentMetrics {
  totalPaid: number
  totalPending: number
  totalCancelled: number
}

export interface ChartData {
  date: string
  tasks: number
  completed: number
}

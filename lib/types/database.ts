export type UserRole = 'superadmin' | 'admin' | 'empleado'

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  company_id: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Company {
  id: string
  name: string
  ruc: string
  address: string | null
  phone: string | null
  email: string | null
  logo_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserWithCompany extends User {
  companies: Company | null
}

export interface Category {
  id: string
  company_id: string
  name: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  company_id: string
  category_id: string | null
  sku: string
  name: string
  description: string | null
  purchase_price: number
  sale_price: number
  current_stock: number
  min_stock: number
  unit: string
  image_url: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Sale {
  id: string
  company_id: string
  user_id: string
  sale_number: string
  subtotal: number
  tax: number
  discount: number
  total: number
  payment_method: 'efectivo' | 'tarjeta' | 'transferencia' | 'otro'
  status: 'completada' | 'pendiente' | 'cancelada'
  notes: string | null
  created_at: string
  updated_at: string
}

export interface SaleItem {
  id: string
  sale_id: string
  product_id: string
  quantity: number
  unit_price: number
  discount: number
  subtotal: number
  created_at: string
}

export interface Invoice {
  id: string
  company_id: string
  sale_id: string
  invoice_number: string
  customer_name: string
  customer_ruc: string | null
  customer_address: string | null
  issue_date: string
  due_date: string | null
  subtotal: number
  tax: number
  total: number
  status: 'emitida' | 'pagada' | 'anulada'
  pdf_url: string | null
  created_at: string
  updated_at: string
}

export interface InventoryLog {
  id: string
  company_id: string
  product_id: string
  user_id: string
  type: 'entrada' | 'salida' | 'ajuste'
  quantity: number
  previous_stock: number
  new_stock: number
  reason: string | null
  reference_id: string | null
  created_at: string
}

// Tipos extendidos con relaciones
export interface UserWithCompany extends User {
  companies: Company | null
}

export interface ProductWithCategory extends Product {
  category: Category | null
}

export interface SaleWithItems extends Sale {
  items: (SaleItem & { product: Product })[]
  user: User
}

export interface InvoiceWithSale extends Invoice {
  sale: Sale
}

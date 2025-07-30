// Base Types
export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

// User Types
export interface User extends BaseEntity {
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  avatar: string;
  gender: "male" | "female";
  is_active: boolean;
  roles: Role[];
  referral_code: string | null;
  last_login_at: string;
}

export interface Role extends BaseEntity {
  name: string;
  guard_name: string;
  permissions: Permission[];
}

export interface Permission extends BaseEntity {
  name: string;
  guard_name: string;
}

// Product Types
export interface Product extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price?: number;
  stock: number;
  category_id: number;
  store_id: number;
  is_active: boolean;
  images: ProductImage[];
  category: Category;
  store: Store;
  attributes: ProductAttribute[];
  variants: ProductVariant[];
}

export interface ProductImage extends BaseEntity {
  url: string;
  is_primary: boolean;
  product_id: number;
}

export interface ProductAttribute extends BaseEntity {
  name: string;
  value: string;
  product_id: number;
}

export interface ProductVariant extends BaseEntity {
  sku: string;
  price: number;
  stock: number;
  product_id: number;
  attributes: ProductVariantAttribute[];
}

export interface ProductVariantAttribute {
  name: string;
  value: string;
}

// Category Types
export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description?: string;
  parent_id?: number | null;
  image?: string;
  is_active: boolean;
  children?: Category[];
  parent?: Category;
}

// Store Types
export interface Store extends BaseEntity {
  name: string;
  slug: string;
  description: string;
  logo: string;
  cover: string;
  address: string;
  phone: string;
  email: string;
  is_active: boolean;
  owner_id: number;
  owner: User;
  categories: Category[];
}

// Order Types
export interface Order extends BaseEntity {
  number: string;
  total: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  shipping_address: Address;
  billing_address: Address;
  customer_id: number;
  store_id: number;
  items: OrderItem[];
  customer: User;
  store: Store;
}

export interface OrderItem extends BaseEntity {
  quantity: number;
  price: number;
  product_id: number;
  order_id: number;
  product: Product;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  phone: string;
}

// Enums
export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

// API Response Types
export interface ApiResponse<T> {
  status: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

// Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  gender: "male" | "female";
}

// Query Types
export interface QueryParams {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
  [key: string]: any;
}

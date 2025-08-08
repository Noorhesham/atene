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
  client_id: number;
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
  [key: string]: string | number | boolean;
}
export interface ApiCategory extends BaseEntity {
  id: number;
  name: string;
  image: string | null;
  status: "active" | "inactive";
  parent_id: number | null;
}
export interface ApiOrder extends BaseEntity {
  id: number;
  reference_id: string;
  status: "pending" | "completed" | "cancelled";
  client_id: number;
  client: {
    id: number;
    avatar: string | null;
    avatar_url: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    roles: string[];
    is_active: number;
    date_of_birth: string | null;
    gender: "male" | "female";
    referral_code: string | null;
    verified_code: string | null;
    last_login_at: string;
  };
  name: string;
  email: string;
  phone: string;
  notes: string;
  address: string;
  sub_total: number;
  discount_total: number;
  shipping_cost: number;
  total: number;
  items: {
    id: number;
    product_id: number;
    product: {
      id: number;
      name: string;
      sku: string;
      price: number;
    };
    quantity: number;
    price: number;
    price_after_discount: number;
  }[];
  created_at: string;
  updated_at: string;
}

export interface ApiStory extends BaseEntity {
  id: number;
  image: string | null;
  text: string;
  color: string;
}

export interface ApiHighlight {
  id: number;
  name: string;
  stories: number[];
  thumbnail?: string;
}

export interface Follower {
  id: number;
  followed_type: "store";
  followed: {
    id: number;
    slug: string;
    name: string;
    status: "active" | "inactive";
    phone: string;
    whats_app: string | null;
    email: string;
    address: string;
    lat: number | null;
    lng: number | null;
    logo: string | null;
    cover: string | null;
    is_favorite: boolean;
    review_rate: number;
    review_count: number;
    open_status: string;
    am_i_following: boolean;
    created_at: string;
    updated_at: string;
    orders_count: number;
  };
}

export interface ApiFollowersResponse {
  status: boolean;
  message: string;
  followers: Follower[];
  total: number;
}

export interface ApiResponseWithTotal extends ApiResponse<unknown> {
  total?: number;
  followers?: Follower[];
}
export interface ApiResponse<T> {
  status: boolean;
  message: string;
  recordsTotal?: number;
  recordsFiltered?: number;
  data: T[];
}

// Base response type for single entity operations
export interface ApiSingleResponse<T> {
  status: boolean;
  message: string;
  record: T;
  data?: T;
}

// Base entity interface that all entities should extend
export interface BaseEntity {
  id: number;
  created_at?: string;
  updated_at?: string;
  name?: string;
  title?: string;
  status?: string;
  slug?: string;
  type?: string;
  [key: string]: string | number | undefined;
}

// Specific entity interfaces
export interface ApiUser extends BaseEntity {
  avatar_url: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  roles: number[];
  is_active: number;
  gender: "male" | "female";
  last_login_at: string;
}

export interface ApiPermission extends BaseEntity {
  id: number;
  title: string;
  name: string;
}

export interface ApiRole extends BaseEntity {
  name: string;
  permissions: ApiPermission[];
  permission_ids?: number[]; // For updates
}

export interface ApiCategory extends BaseEntity {
  name: string;
  slug: string;
  image: string | null;
  status: "active" | "inactive";
  parent_id: number | null;
}

export interface ApiReport extends BaseEntity {
  title: string;
  description: string;
  status: string;
  user_id: number;
}

export interface ApiWorkingTime {
  id?: number;
  day: string;
  from: string;
  to: string;
  open_always: boolean;
  closed_always: boolean;
}

export interface ApiManager {
  id?: number;
  title: string;
  email: string;
  status: string;
}

export interface ApiSpecification {
  id?: number;
  title: string;
  icon: string;
}

export interface ApiStore extends BaseEntity {
  slug: string;
  name: string;
  logo: string | null;
  logo_url: string | null;
  cover: string[];
  covers: string[];
  mainCover?: string;
  cover_url: string | null;
  status: "active" | "inactive";
  description: string | null;
  address: string | null;
  lng: number | null;
  lat: number | null;
  email: string;
  client_id: number;
  currency_id: number;
  phone: string;
  whats_app: string | null;
  tiktok: string | null;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  youtube: string | null;
  linkedin: string | null;
  pinterest: string | null;
  open_status: string | null;
  workingtimes: ApiWorkingTime[];
  managers: ApiManager[];
  specifications: ApiSpecification[];
}

export interface ApiCouponInput {
  code: string;
  type: "value" | "percentage";
  value: number;
  start_date: string;
  end_date: string;
  store_id?: number;
  categories?: number[];
  products?: number[];
}

export interface ApiCoupon extends BaseEntity {
  code: string;
  type: "value" | "percentage";
  value: number;
  start_date: string;
  end_date: string;
  store_id: number | null;
  store: ApiStore | null;
  categories: {
    id: number;
    slug: string;
    name: string;
    image: string;
    parent_id: number | null;
    products_count: number | null;
  }[];
  products: {
    id: number;
    slug: string;
    name: string;
    cover: string;
    is_favorite: boolean;
    in_compare: boolean;
    price: number;
    price_after_discount: number;
    discount_present: number;
  }[];
}

export interface ApiProduct extends BaseEntity {
  sku: string;
  name: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  cover: string | null;
  cover_url: string | null;
  gallary: string[];
  gallary_url: string[];
  type: "simple" | "variation";
  condition: "new" | "used" | "refurbished";
  category_id: number;
  category: ApiCategory;
  section_id: number;
  section: { id: number; name: string };
  status: "active" | "inactive";
  review_rate: number;
  review_count: number;
  price: number;
  store_id: number | null;
  store: ApiStore | null;
  cross_sells_price: number;
  crossSells: any[]; // Define more specifically if needed
  upSells: any[]; // Define more specifically if needed
  tags: any[]; // Define more specifically if needed
  specifications: any[]; // Define more specifically if needed
  variations: any[]; // Define more specifically if needed
}

// Type mapping for entity names to their interfaces
export interface EntityTypeMap {
  users: ApiUser;
  roles: ApiRole;
  permissions: ApiPermission;
  categories: ApiCategory;
  reports: ApiReport;
  stores: ApiStore;
  products: ApiProduct;
}

// Hook return type with pagination
export interface UseAdminEntityReturn<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  totalRecords: number;
  filteredRecords: number;
  currentPage: number;
  totalPages: number;
  refetch: () => Promise<void>;
  setCurrentPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  setSearchQuery: (query: string) => void;
  create: (entityData: Partial<T>) => Promise<T>;
  update: (id: number, entityData: Partial<T>) => Promise<T>;
  remove: (id: number) => Promise<void>;
}

// Hook return type for single entity
export interface UseAdminSingleEntityReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  update: (entityData: Partial<T>) => Promise<T>;
  remove: () => Promise<void>;
}

export interface ApiCurrency extends BaseEntity {
  id: number;
  name: string;
  code: string;
  symbol: string;
  exchange_rate: number;
  status: "active" | "inactive";
}

export interface EntityTypeMap {
  followers: ApiFollowersResponse;
  following: ApiFollowersResponse;
  users: ApiUser;
  roles: ApiRole;
  permissions: ApiPermission;
  categories: ApiCategory;
  reports: ApiReport;
  stores: ApiStore;
  products: ApiProduct;
  attributes: ApiAttribute;
  "media-center": ApiMediaFile;
  coupons: ApiCoupon;
  orders: ApiOrder;
  stories: ApiStory;
  highlights: ApiHighlight;
  currencies: ApiCurrency;
}

export type EntityInputMap = {
  [K in keyof EntityTypeMap]: K extends "followers" | "following"
    ? never
    : K extends "stories" | "highlights"
    ? Partial<EntityTypeMap[K]>
    : Partial<EntityTypeMap[K]>;
};

export interface ApiAttribute {
  id: number;
  title: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  options?: ApiAttributeOption[];
}

export interface ApiAttributeOption {
  id: number;
  title: string;
  attribute_id: number;
  created_at: string;
  updated_at: string;
}

export interface ApiMediaFile {
  id: number;
  file_type: string;
  file_name: string;
  size: number;
  title: string;
  alt: string;
  dimensions: string;
  user_id: number;
  store_id: number | null;
  created_at: string;
  updated_at: string;
  url: string;
  src: string;
}

export interface UseAdminEntityQueryOptions {
  initialPage?: number;
  initialPerPage?: number;
  queryParams?: Record<string, string>;
  enabled?: boolean;
  headers?: Record<string, string>;
}

export interface EndpointConfig {
  admin: string;
  merchant: string;
  requiresAuth: boolean;
}

export interface ApiUser extends BaseEntity {
  id: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
}

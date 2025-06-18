export interface Product {
  id: number;
  sku: string;
  name: string;
  slug: string | null;
  short_description: string | null;
  description: string;
  cover: string | null;
  gallery: string[] | null;
  video_type: string | null;
  video: string | null;
  type: "simple" | "variation";
  condition: string;
  status: string;
  review_rate: number | null;
  review_count: number | null;
  price: number;
  cross_sells_price: number;
  category: Category;
  variations: Variation[];
  specifications: Specification[];
  cross_sells: Product[];
  created_at: string;
  updated_at: string;
}

export interface ProductsResponse {
  status: boolean;
  message: string;
  total: number;
  products: Product[];
}

export interface AttributeOption {
  id: number;
  title: string;
  data: any | null;
}

export interface Attribute {
  id: number;
  title: string;
  options: AttributeOption[];
}

export interface Variation {
  id: number;
  parent_id: number;
  sku: string | null;
  price: number;
  stock: number | null;
  status: string | null;
  image: string | null;
  gallery: string[] | null;
  attribute_options: VariationAttributeOption[];
  created_at: string;
  updated_at: string;
}

export interface VariationAttributeOption {
  id: number;
  optionable_id: number;
  optionable_type: string;
  attribute_id: number;
  option_id: number;
}

export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  products_count: number;
  image: string;
}

export interface Section {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  products_count: number;
}

export interface Tag {
  id: number;
  title: string;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface SearchPageData {
  categories: Category[];
  sections: Section[];
  tags: Tag[];
  price_range: PriceRange;
  attributes: Attribute[];
}

export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  category_id?: number;
  section_id?: number;
  tags?: string[];
  min_price?: number;
  max_price?: number;
  attributes?: Record<string, number[]>;
}

export type Categories = Category[];

export interface Store {
  id: number;
  slug: string;
  name: string;
  status: string;
  phone: string;
  whats_app: string | null;
  email: string;
  address: string;
  lat: number | null;
  lng: number | null;
  logo: string | null;
  cover: string | null;
  review_rate: number;
  review_count: number;
  weekends: string;
  am_i_following: boolean;
  created_at: string;
  updated_at: string;
  orders_count: number;
}

export interface Specification {
  id: number;
  title: string;
  icon: string;
}

export interface SingleProductResponse {
  status: boolean;
  message: string;
  product: {
    id: number;
    sku: string;
    name: string;
    slug: string;
    short_description: string;
    description: string;
    cover: string;
    gallery: string[];
    video_type: string | null;
    video: string | null;
    type: string;
    condition: string;
    status: string;
    review_rate: number | null;
    review_count: number | null;
    price: number;
    cross_sells_price: number;
    category: Category;
    variations: Variation[];
    specifications: Specification[];
    cross_sells: Product[];
  };
  store: Store;
  attributes: Attribute[];
  similar: Product[];
  categories: Category[];
}

export interface ProductSectionProps {
  id: string;
  title: string;
  description: string;
  shortDescription: string | null;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: { src: string; alt: string }[];
  sizes: string[];
  weights: string[];
  reviews: {
    id: number;
    name: string;
    avatar: string;
    review: string;
    rating: number | null;
    images: string[] | null;
    date: string;
  }[];
  specifications: Specification[];
  store: Store;
  similar: Product[];
  variations: Variation[];
  category: Category;
  attributes: Attribute[];
  sku: string;
  condition: string;
  status: string;
  cross_sells: {
    id: string;
    title: string;
    images: { src: string; alt: string }[];
    price: number;
  }[];
  cross_sells_price: number;
  final_price: number;
  rate_stats: Record<string, number>;
}

export interface CrossSellProduct {
  id: number;
  name: string;
  cover: string | null;
  price: number;
  price_after_discount: number;
  slug: string;
  // Add other fields from your data if needed
}

export interface CrossSellBundleData {
  cross_sells: CrossSellProduct[];
  cross_sells_price: number; // The original total price
  final_price: number; // The discounted final price
}

export interface ReviewUser {
  name: string;
  email: string;
  avatar: string;
}

export interface Review {
  id: number;
  content: string;
  parent_id: number | null;
  rate: number | null;
  images: string[] | null;
  user: ReviewUser;
}

export interface ReviewsResponse {
  status: boolean;
  message: string;
  total: number;
  reviews: Review[];
  avg_rate: string;
  rate_stats: Record<string, number>; // e.g. { "1": 5, "2": 10, "3": 15, "4": 20, "5": 50 }
}

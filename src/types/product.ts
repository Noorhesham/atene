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
  icon: string;
  slug: string;
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
  reviews: any[];
  specifications: Specification[];
  store: Store;
  similar: Product[];
  variations: Variation[];
  category: Category;
  attributes: Attribute[];
  sku: string;
  condition: string;
  status: string;
}

export interface ProductSectionProps {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  description: string;
  images: { src: string; alt: string }[];
  sizes: string[];
  weights: string[];
  reviews: {
    name: string;
    avatar: string;
    review: string;
    images?: string[];
    rating?: number;
  }[];
}
interface Message {
  id: string;
  text: string;
  isMine: boolean;
  timestamp: string;
  images?: string[];
  productInfo?: {
    title: string;
    price: string;
    image: string;
  };
}

export interface Person {
  id: string;
  name: string;
  avatar: string;
  product?: {
    name: string;
    price: string;
    image: string;
  };
}

export interface ChatProps {
  selectedPerson: string | null;
}
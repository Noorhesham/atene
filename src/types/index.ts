import { ReactNode } from "react";

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
  similarProducts: {
    id: string;
    title: string;
    price: number;
    image: string;
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
// --- TYPES ---
interface Category {
  name: string;
  count: number;
  active?: boolean;
}

interface OrderDetails {
  customer: {
    name: string;
    avatar: string;
    since: string;
    email: string;
    phone: string;
    address: string;
  };
  order: {
    store: string;
    id: string;
    date: string;
    title: string;
  };
  product: {
    name: string;
    color: string;
    size: string;
    quantity: number;
  };
}

interface Order {
  id: string;
  customerName: string;
  date: string;
  price: string;
  details: OrderDetails;
}

export interface FilterPanelProps {
  categories: Category[];
}

export interface OrdersListProps {
  orders: Order[];
  selectedOrders: string[];
  onSelectOrder: (orderId: string) => void;
}

export interface ActionButtonProps {
  children: ReactNode;
  variant?: "danger" | "primary" | "secondary";
  icon?: ReactNode;
}

export interface InfoCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export interface InfoRowProps {
  label: string;
  value: string | number;
  icon: ReactNode;
}

export interface OrderDetailsProps {
  order: Order;
}

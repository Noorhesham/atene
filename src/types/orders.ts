import { ReactNode } from "react";

export interface Category {
  name: string;
  count: number;
  active?: boolean;
}

export interface OrderDetails {
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

export interface Order {
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

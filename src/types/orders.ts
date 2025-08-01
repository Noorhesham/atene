export interface FilterPanelProps {
  categories: {
    name: string;
    count: number;
    active?: boolean;
    status: string | null;
  }[];
  onFilterChange: (status: string | null) => void;
}

export interface OrdersListProps {
  orders: Order[];
  selectedOrders: string[];
  onSelectOrder: (orderId: string) => void;
}

export interface OrderDetailsProps {
  order: Order;
}

export interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export interface InfoRowProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

export interface Order {
  id: string;
  customerName: string;
  date: string;
  price: string;
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
    gender: string;
    referral_code: string | null;
    verified_code: string | null;
    last_login_at: string;
  };
  items: {
    id: number;
    product_id: number;
    product: {
      id: number;
      sku: string;
      name: string;
      description?: string;
      price: number;
    };
    quantity: number;
    price: number;
    price_after_discount: number;
  }[];
  address: string;
  email: string;
  phone: string;
  notes: string;
  status: string;
  sub_total: number;
  discount_total: number;
  shipping_cost: number;
  total: number;
  reference_id: string;
  name: string;
}

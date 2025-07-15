import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const ProductList = ({ products, onAddToCart }: { products: any[]; onAddToCart: (product: any) => void }) => (
  <div className="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
    <div className="p-4 border-b border-gray-200">
      <div className="relative w-full">
        <Input type="text" placeholder="ابحث عن منتج" className="w-full py-2.5 pr-10 pl-4 border-gray-300 rounded-lg" />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
          <Search size={20} />
        </div>
      </div>
    </div>
    <div className="flex-grow overflow-y-auto p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-2 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onAddToCart(product)}
          >
            <img src={product.image} alt={product.name} className="w-full h-28 object-cover rounded-md mb-2" />
            <p className="font-semibold text-gray-800 truncate">{product.name}</p>
            <p className="font-bold text-main">₪ {product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ProductList;

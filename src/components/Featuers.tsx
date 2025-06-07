import { Car, Truck, Package } from "lucide-react";
import { Specification } from "@/types/product";

interface FeaturesProps {
  specifications: Specification[];
}

const Features = ({ specifications }: FeaturesProps) => {
  const getIconComponent = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'car':
        return Car;
      case 'truck':
        return Truck;
      default:
        return Package;
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-8">
      {specifications.map((spec) => {
        const IconComponent = getIconComponent(spec.icon);
        return (
          <div key={spec.id} className="flex items-center gap-2 text-right">
            <IconComponent className="w-6 h-6 text-primary" />
            <span className="text-sm text-gray-600">{spec.title}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Features;

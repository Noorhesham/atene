import * as FaIcons from "react-icons/fa";
import { Specification } from "@/types/product";

interface FeaturesProps {
  specifications: Specification[];
}

const Features = ({ specifications }: FeaturesProps) => {
  const getDynamicIcon = (iconName: string) => {
    // Convert icon name to Font Awesome format (e.g., "truck" -> "FaTruck")
    const formattedName = `Fa${iconName.charAt(0).toUpperCase() + iconName.slice(1).toLowerCase()}`;

    // Get the icon component from react-icons/fa
    const IconComponent = (FaIcons as any)[formattedName];

    // Return the icon component or a default fallback
    return IconComponent || FaIcons.FaBox;
  };

  console.log(specifications);

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
      {specifications.map((spec) => {
        const IconComponent = getDynamicIcon(spec.icon);
        return (
          <div key={spec.id} className="flex items-center text-center gap-2 p-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
              <IconComponent className="w-5 h-5 text-[#797979]" />
            </div>
            <span className="text-sm text-[#2E2E2F] font-medium">{spec.title}</span>
          </div>
        );
      })}
    </div>
  );
};

export default Features;

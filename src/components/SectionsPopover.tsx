import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAdminEntityQuery } from "@/hooks/useUsersQuery";

interface Section {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const SectionsPopover: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState("");

  const { data: sections = [] } = useAdminEntityQuery("sections");

  const handleSectionSelect = (sectionId: string) => {
    // Navigate to add product page with section_id parameter
    const basePath = user?.user?.user_type === "merchant" ? "dashboard" : "admin";
    navigate(`/${basePath}/products/add?section_id=${sectionId}`);
  };

  const filteredSections = sections.filter((section: Section) =>
    section.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="bg-main text-white hover:bg-main/90 gap-2">
          <Plus size={16} className="ml-2" /> إضافة منتج
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="ابحث عن قسم"
              className="w-full pr-10 pl-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {filteredSections.map((section: Section) => (
            <div
              key={section.id}
              className="relative p-3 cursor-pointer transition-colors hover:bg-gray-50"
              onClick={() => handleSectionSelect(section.id)}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{section.icon}</span>
                <div className="flex-1 text-right">
                  <h4 className="font-medium text-gray-900">{section.name}</h4>
                  <p className="text-xs text-gray-500">{section.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SectionsPopover;

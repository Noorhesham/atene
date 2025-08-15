import React from "react";
import DashboardNavbar from "../DashboardNavbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <section className="flex bg-[#F5F5F5]  w-full flex-col ">
      <DashboardNavbar />
      {/* <Breadcrumb className="bg-[#F0F7FF]">
        <BreadcrumbList className="flex justify-end">
          <MaxWidthWrapper className="!py-4 flex justify-between items-center">
            <h1 className="text-[#395A7D] font-semibold text-xl">
              {pathDisplayNames[pathSegments[pathSegments.length - 1]] || "الصفحة الرئيسية"}
            </h1>
            <div className="flex items-center gap-2 text-[#395A7D]">
              <BreadcrumbItem>
                <BreadcrumbLink href="/" className="text-[#395A7D] opacity-60 hover:opacity-100 transition-opacity">
                  الصفحة الرئيسية
                </BreadcrumbLink>
                <BreadcrumbSeparator className="text-[#395A7D] opacity-60 mx-2">/</BreadcrumbSeparator>
              </BreadcrumbItem>
              {getBreadcrumbItems()}
            </div>
          </MaxWidthWrapper>
        </BreadcrumbList>
      </Breadcrumb> */}

      {/* <Sidebar /> */}
      {children}
    </section>
  );
};

export default DashboardLayout;

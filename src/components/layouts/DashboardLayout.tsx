import React from "react";
import DashboardNavbar from "../DashboardNavbar";
import MaxWidthDashboard from "../(dashboard)/components/MaxWidthDashboard";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <section className="flex bg-gray-50  w-full flex-col gap-5">
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
      <MaxWidthDashboard className="flex  mx-auto  !w-full min-h-screen gap-6">
        {/* <Sidebar /> */}
        {children}
      </MaxWidthDashboard>
    </section>
  );
};

export default DashboardLayout;

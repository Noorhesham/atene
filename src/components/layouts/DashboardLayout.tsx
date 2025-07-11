import React from "react";
import DashboardNavbar from "../DashboardNavbar";
import MaxWidthDashboard from "../(dashboard)/components/MaxWidthDashboard";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  // const pathSegments = location.pathname.split("/").filter((segment) => segment);

  // // Map of path segments to Arabic display names
  // const pathDisplayNames: { [key: string]: string } = {
  //   dashboard: "لوحة التحكم",
  //   users: "إدارة المستخدمين",
  //   stores: "إدارة المتاجر",
  //   products: "إدارة المنتجات",
  //   sections: "إدارة الأقسام",
  //   reports: "إدارة البلاغات",
  //   notifications: "إدارة الإشعارات",
  //   settings: "الإعدادات",
  // };

  // // Convert path segments to breadcrumb items
  // const getBreadcrumbItems = () => {
  //   let currentPath = "";
  //   return pathSegments.map((segment, index) => {
  //     currentPath += `/${segment}`;
  //     const isLast = index === pathSegments.length - 1;

  //     // Get Arabic display name or capitalize first letter
  //     const displayText = pathDisplayNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);

  //     return isLast ? (
  //       <BreadcrumbItem key={segment} className="text-[#395A7D] font-semibold">
  //         <BreadcrumbPage>{displayText}</BreadcrumbPage>
  //       </BreadcrumbItem>
  //     ) : (
  //       <BreadcrumbItem key={segment}>
  //         <BreadcrumbLink href={currentPath} className="text-[#395A7D] opacity-60 hover:opacity-100 transition-opacity">
  //           {displayText}
  //         </BreadcrumbLink>
  //         <BreadcrumbSeparator className="text-[#395A7D] opacity-60 mx-2">/</BreadcrumbSeparator>
  //       </BreadcrumbItem>
  //     );
  //   });
  // };

  return (
    <section className="flex bg-gray-100 flex-col gap-5">
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
      <MaxWidthDashboard className="flex   w-full min-h-screen gap-6">
        {/* <Sidebar /> */}
        {children}
      </MaxWidthDashboard>
    </section>
  );
};

export default DashboardLayout;

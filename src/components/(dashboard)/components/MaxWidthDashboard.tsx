const MaxWidthDashboard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`max-w-7xl py-3 mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
};

export default MaxWidthDashboard;

const MaxWidthDashboard = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return <div className={`max-w-screen-2xl py-3 mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
};

export default MaxWidthDashboard;

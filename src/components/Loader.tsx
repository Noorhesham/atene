const Loader = () => {
  return (
    <div className="flex items-center flex-col justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-main mx-auto"></div>
      <p className="mt-4 text-gray-600">جاري التحميل...</p>
    </div>
  );
};

export default Loader;

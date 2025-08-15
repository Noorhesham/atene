const AccordionStep = ({
  title,
  isOpen,
  onToggle,
  children,
  isCompleted,
  hasErrors,
  icon,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  isCompleted: boolean;
  hasErrors: boolean;
  icon: React.ReactNode;
}) => (
  <div
    className={`border rounded-lg bg-white transition-all duration-300 ${
      isOpen ? "border-blue-500 shadow-md" : hasErrors ? "border-red-500" : "border-gray-200"
    }`}
  >
    <button type="button" onClick={onToggle} className="w-full flex justify-between items-center p-4 text-right">
      <h3
        className={`text-lg font-bold  flex items-center gap-2 ${
          isCompleted && !isOpen ? "text-gray-900" : "text-gray-600"
        } `}
      >
        {icon}
        {title}
      </h3>
      {isOpen ? (
        <div className=" p-2 rounded-full border border-main flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 12H4" stroke="#406896" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      ) : (
        <div className=" p-2 rounded-full border border-main flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 4V20M4 12H20"
              stroke="#406896"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      )}
    </button>
    {isOpen && <div className="p-6 border-t border-gray-200">{children}</div>}
  </div>
);

export default AccordionStep;

import { Check } from "lucide-react";

const ProgressSteps = ({ currentStep, steps }: { currentStep: number; steps: any[] }) => {
  const arabicNumerals = ["١", "٢", "٣", "٤", "٥"];

  return (
    <div className="relative mb-12 w-full" dir="rtl">
      {/* The connecting line */}
      <div className="absolute top-5 left-0 right-0 w-full h-0.5 w-full bg-[#406896] z-10"></div>

      {/* The progress line */}
      <div
        className="absolute top-5 right-0 h-0.5 bg-[#2D496A] transition-all duration-500 -z-10"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      ></div>

      <div className="relative flex justify-between items-start">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          let circleClasses =
            "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 border-2 ";
          let textClasses = "mt-3 text-sm font-semibold transition-colors duration-300 whitespace-nowrap";

          if (isCompleted) {
            circleClasses += "bg-[#2D496A] border-[#2D496A] text-white";
            textClasses += " text-[#2D496A]";
          } else if (isCurrent) {
            circleClasses += "bg-[#C2D1E2] border-[#406896] text-[#2D496A]";
            textClasses += " text-[#406896]";
          } else {
            circleClasses += "bg-white border-[#406896] text-[#406896]";
            textClasses += " text-[#406896]";
          }

          return (
            // The background is changed here to 'bg-white' to match the card background
            <div key={step.id} className="flex flex-col items-center text-center z-10 ">
              <div className={circleClasses}>{isCompleted ? <Check strokeWidth={3} /> : arabicNumerals[index]}</div>
              <p className={textClasses}>{step.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;   
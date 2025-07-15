import React from "react";
import { Check } from "lucide-react";

const StoreProgressSteps = ({
  steps,
  currentStep,
  onStepClick,
}: {
  steps: any;
  currentStep: number;
  onStepClick: (step: number) => void;
}) => {
  const arabicNumerals = ["١", "٢", "٣", "٤"];
  return (
    <div className="relative w-full" dir="rtl">
      <div className="absolute top-5 right-0 w-full h-0.5 bg-gray-200"></div>
      <div
        className="absolute top-5 right-0 h-0.5 bg-main transition-all duration-500"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      ></div>
      <div className="relative flex justify-between items-start">
        {steps.map((step: any, index: number) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          let circleClasses =
            "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 border-2 cursor-pointer ";
          if (isCompleted) {
            circleClasses += "bg-main border-main text-white";
          } else if (isCurrent) {
            circleClasses += "bg-blue-100 border-main text-main";
          } else {
            circleClasses += "bg-white border-gray-300 text-gray-400";
          }
          return (
            <div key={step.id} className="flex flex-col items-center text-center z-10 bg-white px-2">
              <div className={circleClasses} onClick={() => onStepClick(step.id)}>
                {isCompleted ? <Check strokeWidth={3} /> : arabicNumerals[index]}
              </div>
              <p className="mt-2 text-sm font-semibold text-gray-600">{step.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default StoreProgressSteps;

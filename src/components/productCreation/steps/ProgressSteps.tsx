import MaxWidthWrapper from "@/components/MaxwidthWrapper";
import { Check } from "lucide-react";

const ProgressSteps = ({ currentStep, steps }: { currentStep: number; steps: any[] }) => {
  const arabicNumerals = ["١", "٢", "٣", "٤", "٥"];

  return (
    <MaxWidthWrapper noPadding className="relative mb-12 w-full">
      <div className="relative flex justify-between items-start">
        <div className="absolute top-[30%] -translate-y-1/2 left-0 right-0 h-0.5 w-full bg-[#406896] z-10"></div>

        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          let circleClasses =
            "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 border-2 ";
          let textClasses = "mt-3 font-normal text-base transition-colors duration-300 whitespace-nowrap";

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
            <div key={step.id} className="flex flex-col items-center  text-center z-10 bg-gray-50 px-2">
              <div className={circleClasses}>
                {isCompleted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 14.5C5 14.5 6.5 14.5 8.5 18C8.5 18 14.059 8.833 19 7"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                ) : (
                  arabicNumerals[index]
                )}
              </div>
              <p className={textClasses}>{step.title}</p>
            </div>
          );
        })}
      </div>
    </MaxWidthWrapper>
  );
};

export default ProgressSteps;

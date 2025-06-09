import MotionItem from "../MotionItem";
import Starrating from "./Rate";
import { Progress } from "../ui/progress";

type ReviewSummaryProps = {
  reviews_counts: Record<string, number>;
  review_count: number;
  review_rate: number;
};

const ReviewSummary = ({ reviews_counts, review_count, review_rate }: ReviewSummaryProps) => {
  return (
    <div dir="rtl" className="flex flex-col-reverse lg:flex-row justify-between items-start gap-8">
      {/* Star distribution */} {/* Rating summary */}
      <div className="flex flex-col bg-[#FAFAFA] p-8 items-center  gap-3">
        <div className="text-[4rem] leading-none font-semibold">{review_rate ? review_rate : 0}</div>
        <div className="flex flex-col items-end">
          <span className="text-sm mx-auto text-gray-500">من {review_count} مراجعة</span>
          <Starrating className="mb-1" MaxRating={5} defaultRating={review_rate} change={false} size={24} />
        </div>
      </div>
      <div className="flex flex-col gap-3  w-full">
        {Object.keys(reviews_counts)
          .sort((a, b) => Number(b) - Number(a))
          .map((key: string, i: number) => (
            <div className="font-medium flex items-center gap-4" key={key}>
              <span className="text-gblack  text-right">{key}</span>
              <MotionItem
                nohover
                viewport={{ once: true }}
                initial={{ width: 0, opacity: 0 }}
                whileInView={{
                  width: "100%",
                  opacity: 1,
                  transition: {
                    duration: 0.5,
                    ease: "easeInOut",
                    stiffness: 100,
                    type: "spring",
                    delay: 0.2 * i,
                  },
                }}
                className="flex-grow  mr-10 "
              >
                <Progress
                  className="h-2 bg-gray-200"
                  style={{ "--progress-foreground": "#FF9B07" } as React.CSSProperties}
                  value={(reviews_counts[key] / review_count) * 100}
                />
              </MotionItem>
              <span className="text-gray-600  text-left">{reviews_counts[key]}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ReviewSummary;

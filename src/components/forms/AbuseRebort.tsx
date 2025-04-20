"use client";

import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import AbuseReportDetails from "./RebortDetails";
import MainButton from "../MainButton";

const reportOptions = [
  { value: "product", label: "الإبلاغ عن منتج" },
  { value: "merchant", label: "الإبلاغ عن تاجر" },
  { value: "user", label: "الإبلاغ عن زبون" },
  { value: "service", label: "الإبلاغ عن خدمة" },
  { value: "other", label: "أخرى" },
];

const AbuseReport = ({ closeModal }: { closeModal: () => void }) => {
  const [value, setValue] = React.useState("");
  const [step, setStep] = React.useState(1);

  const handleNext = () => {
    if (value) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <AnimatePresence mode="wait">
      <div className=" overflow-x-hidden">
        {" "}
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            className="p-6 bg-white rounded-lg space-y-4 max-w-md w-full"
          >
            <div className="space-y-2 text-right">
              <h3 className="text-xl font-semibold">الإبلاغ عن إساءة</h3>
              <p className="text-gray-500 text-sm">ما الذي نقدر ان نساعدك بيه ؟</p>
            </div>

            <RadioGroup dir="rtl" value={value} onValueChange={setValue} className="space-y-3">
              {reportOptions.map((option) => (
                <div
                  key={option.value}
                  className="flex items-center justify-between space-x-2  rounded-l hover:bg-gray-50 transition-colors"
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full text-right"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <MainButton disabled={!value} text="الصفحة الرئيسية" onClick={handleNext} />
          </motion.div>
        ) : (
          <AbuseReportDetails closeModal={closeModal} key="step2" onBack={handleBack} reportType={value} />
        )}
      </div>
    </AnimatePresence>
  );
};

export default AbuseReport;

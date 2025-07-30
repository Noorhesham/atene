"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, XCircle, ChevronDown, XIcon, WandSparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useFormContext } from "react-hook-form";
import { FormLabel } from "@/components/ui/form";

// Helper function to ensure values are strings - moved outside component to prevent re-creation
const ensureStringArray = (values: unknown[]): string[] => {
  if (!Array.isArray(values)) return [];

  return values.map((val) => {
    if (typeof val === "string") return val;
    if (typeof val === "number") return val.toString();
    if (typeof val === "object" && val !== null) {
      const obj = val as Record<string, unknown>;

      // Try different possible properties
      if (obj.value !== undefined) return String(obj.value);
      if (obj.id !== undefined) return String(obj.id);
      if (obj.label !== undefined) return String(obj.label);

      // Fallback to string conversion
      return String(val);
    }
    return String(val);
  });
};

const multiSelectVariants = cva(
  "m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300",
  {
    variants: {
      variant: {
        default: "border-foreground/10 text-foreground bg-main text-white hover:bg-card/80",
        secondary: "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  onValueChange: (value: string[]) => void;
  defaultValue?: string[];
  value?: string[];
  placeholder?: string;
  animation?: number;
  maxCount?: number;
  modalPopover?: boolean;
  asChild?: boolean;
  className?: string;
  name?: string;
  label?: string;
}

export const MultiSelect = React.forwardRef<HTMLButtonElement, MultiSelectProps>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      value,
      placeholder = "اختر...",
      animation = 0,
      maxCount = 3,
      modalPopover = false,

      className,

      label,
      name,
      ...props
    },
    ref
  ) => {
    const form = useFormContext();
    const [selectedValues, setSelectedValues] = React.useState<string[]>(() => {
      if (value !== undefined) return ensureStringArray(value);
      if (form && name) {
        const formValue = form.getValues(name);
        return ensureStringArray(formValue || defaultValue);
      }
      return ensureStringArray(defaultValue);
    });
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);

    // Sync selectedValues with value prop, form values or defaultValue changes
    React.useEffect(() => {
      let newValues: string[] = [];

      if (value !== undefined) {
        newValues = ensureStringArray(value);
      } else if (form && name) {
        const formValue = form.getValues(name);
        if (formValue && Array.isArray(formValue)) {
          newValues = ensureStringArray(formValue);
        } else {
          newValues = ensureStringArray(defaultValue);
        }
      } else {
        newValues = ensureStringArray(defaultValue);
      }

      // Only update if values actually changed
      setSelectedValues((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(newValues)) {
          return newValues;
        }
        return prev;
      });
    }, [value, form, name, defaultValue]);

    // Watch for form value changes (only if form and name exist)
    React.useEffect(() => {
      if (!form || !name) return;

      const subscription = form.watch((watchedValue) => {
        if (watchedValue[name] && Array.isArray(watchedValue[name])) {
          const newValues = ensureStringArray(watchedValue[name]);
          setSelectedValues((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(newValues)) {
              return newValues;
            }
            return prev;
          });
        }
      });

      return () => subscription.unsubscribe();
    }, [form, name]);

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
        if (form && name) {
          form.setValue(name, newSelectedValues, { shouldValidate: true });
        }
      }
    };

    const toggleOption = (value: string) => {
      const newSelectedValues = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];

      const ensuredValues = ensureStringArray(newSelectedValues);

      setSelectedValues(ensuredValues);
      onValueChange(ensuredValues);
      if (form && name) {
        form.setValue(name, ensuredValues, { shouldValidate: true });
      }
    };

    const handleClear = () => {
      const emptyArray: string[] = [];
      setSelectedValues(emptyArray);
      onValueChange(emptyArray);
      if (form && name) {
        form.setValue(name, emptyArray, { shouldValidate: true });
      }
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const clearExtraOptions = () => {
      const newSelectedValues = selectedValues.slice(0, maxCount);
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
      if (form && name) {
        form.setValue(name, newSelectedValues, { shouldValidate: true });
      }
    };

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        handleClear();
      } else {
        const allValues = options.map((option) => option.value);
        const ensuredValues = ensureStringArray(allValues);
        setSelectedValues(ensuredValues);
        onValueChange(ensuredValues);
        if (form && name) {
          form.setValue(name, ensuredValues, { shouldValidate: true });
        }
      }
    };

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} modal={modalPopover}>
        <PopoverTrigger asChild>
          <div className="flex space-y-2 w-full relative flex-col gap-2">
            {label && <FormLabel className="text-[18px]">{label}</FormLabel>}
            <Button
              ref={ref}
              {...props}
              onClick={(e) => {
                e.preventDefault();
                handleTogglePopover();
              }}
              className={cn(
                "flex w-full h-full rounded-md border min-h-10 items-center justify-between bg-inherit hover:bg-inherit",
                className
              )}
            >
              {selectedValues.length > 0 ? (
                <div className="flex justify-between items-center w-full">
                  <div className="flex flex-wrap items-center">
                    {selectedValues.slice(0, maxCount).map((value) => {
                      const option = options.find((o) => {
                        const optionValue = String(o.value);
                        const selectedValue = String(value);
                        return optionValue === selectedValue;
                      });
                      const IconComponent = option?.icon;
                      return (
                        <Badge
                          key={value}
                          className={cn(
                            isAnimating ? "animate-bounce !hover:text-black relative" : "",
                            multiSelectVariants({ variant })
                          )}
                          style={{ animationDuration: `${animation}s` }}
                        >
                          {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
                          {option?.label || `Unknown (${value})`}
                          <XCircle
                            className="ml-2 h-4 w-4 cursor-pointer"
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleOption(value);
                            }}
                          />
                        </Badge>
                      );
                    })}
                    {selectedValues.length > maxCount && (
                      <Badge
                        className={cn(
                          "bg-transparent text-foreground border-foreground/1 hover:bg-transparent",
                          isAnimating ? "animate-bounce" : "",
                          multiSelectVariants({ variant })
                        )}
                        style={{ animationDuration: `${animation}s` }}
                      >
                        {`+ ${selectedValues.length - maxCount} more`}
                        <XCircle
                          className="ml-2 h-4 w-4 cursor-pointer"
                          onClick={(event) => {
                            event.stopPropagation();
                            clearExtraOptions();
                          }}
                        />
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <XIcon
                      className="md:w-8 w-4 h-4 md:h-8"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleClear();
                      }}
                    />
                    <Separator orientation="vertical" className="flex min-h-6 h-full" />
                    <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full mx-auto">
                  <span className="text-sm text-muted-foreground mx-3">{placeholder}</span>
                  <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
                </div>
              )}
            </Button>
            {name && form.formState.errors[name] && (
              <p className="text-red-500 text-sm">{form.formState.errors[name]?.message as string}</p>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command>
            <CommandInput placeholder="Search..." onKeyDown={handleInputKeyDown} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                <CommandItem key="all" onSelect={toggleAll} className="cursor-pointer">
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      selectedValues.length === options.length
                        ? "bg-main text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible"
                    )}
                  >
                    <CheckIcon
                      className={cn(
                        "h-4 bg-main w-4",
                        selectedValues.length === options.length ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                  <span>تحديد الكل</span>
                </CommandItem>
                {options.map((option) => {
                  const optionValueString = String(option.value);
                  const isSelected = selectedValues.includes(optionValueString);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(optionValueString)}
                      className="cursor-pointer"
                    >
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                          isSelected ? "bg-main text-primary-foreground" : "opacity-50 [&_svg]:invisible"
                        )}
                      >
                        <CheckIcon className={cn("h-4 text-white w-4", isSelected ? "opacity-100" : "opacity-0")} />
                      </div>
                      {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between">
                  {selectedValues.length > 0 && (
                    <>
                      <CommandItem onSelect={handleClear} className="flex-1 justify-center cursor-pointer">
                        مسح الكل
                      </CommandItem>
                      <Separator orientation="vertical" className="flex min-h-6 h-full" />
                    </>
                  )}
                  <CommandItem
                    onSelect={() => setIsPopoverOpen(false)}
                    className="flex-1 justify-center cursor-pointer max-w-full"
                  >
                    إغلاق
                  </CommandItem>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
        {animation > 0 && selectedValues.length > 0 && (
          <WandSparkles
            className={cn(
              "cursor-pointer my-2 text-foreground bg-background w-3 h-3",
              isAnimating ? "" : "text-muted-foreground"
            )}
            onClick={() => setIsAnimating(!isAnimating)}
          />
        )}
      </Popover>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

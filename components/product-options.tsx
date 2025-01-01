'use client'

import { useState, useEffect } from 'react'
import { ProductOption, ProductOptionValue } from '@/lib/types'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface ProductOptionsProps {
  options: ProductOption[]
  basePrice: number
  currency: string
  onOptionSelect: (optionId: string, valueId: string) => void
  className?: string
}

export function ProductOptions({
  options,
  basePrice,
  currency,
  onOptionSelect,
  className
}: ProductOptionsProps) {
  const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});

  // Automatically select default options on mount
  useEffect(() => {
    const defaultValues: Record<string, string> = {};
    let hasChanges = false;
    
    options.forEach(option => {
      const defaultValue = option.values.find(v => v.default || v.priceModifier === 0);
      if (defaultValue && !selectedValues[option.id]) {
        defaultValues[option.id] = defaultValue.id.toString();
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      setSelectedValues(prev => ({
        ...prev,
        ...defaultValues
      }));
      // Only call onOptionSelect for new values
      Object.entries(defaultValues).forEach(([optionId, valueId]) => {
        onOptionSelect(optionId, valueId);
      });
    }
  }, [options]);

  const handleOptionChange = (optionId: string, valueId: string) => {
    setSelectedValues(prev => ({
      ...prev,
      [optionId]: valueId
    }))
    onOptionSelect(optionId, valueId)
  }

  const calculatePrice = (priceModifier: number) => {
    return basePrice + priceModifier
  }

  return (
    <div className={cn("space-y-6", className)}>
      {options.map(option => (
        <div key={option.id} className="space-y-3">
          <h3 className="font-medium text-base text-gray-900">{option.name}</h3>
          <RadioGroup
            onValueChange={(value) => handleOptionChange(option.id, value)}
            value={selectedValues[option.id]?.toString()}
            className="flex gap-2"
          >
            {option.values.map(value => (
              <div key={value.id}>
                <RadioGroupItem
                  value={value.id.toString()}
                  id={`option-${option.id}-${value.id}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`option-${option.id}-${value.id}`}
                  className={cn(
                    "flex justify-between items-center w-fit gap-3 p-2 rounded-lg border cursor-pointer",
                    "transition-all duration-200",
                    "hover:border-green-500/50 hover:bg-green-50/50",
                    "peer-data-[state=checked]:border-green-500 peer-data-[state=checked]:bg-green-50",
                    "data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
                  )}
                >
                  <span className="text-sm font-medium">{value.value}</span>
                  {value.priceModifier !== 0 && (
                    <span className={cn(
                      "text-xs",
                      value.priceModifier > 0 ? "text-gray-500" : "text-green-500"
                    )}>
                      {value.priceModifier > 0 ? '+' : ''}{value.priceModifier} {currency}
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
    </div>
  )
}

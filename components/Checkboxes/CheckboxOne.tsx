"use client";
import { useEffect, useState } from "react";

const CheckboxOne = ({label, checked}: {label?: string, checked? : boolean}) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);

  useEffect(() => {
    if(checked) {
      setIsChecked(checked)
    }
    
  }, [checked])

  return (
    <div>
      <label
        htmlFor="checkboxLabelOne"
        className="flex cursor-pointer select-none items-center"
      >
        <div className="relative">
          <input
            type="checkbox"
            id="checkboxLabelOne"
            className="sr-only"
            onChange={() => {
              setIsChecked(!isChecked);
            }}
          />
          <div
            className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
              isChecked && "border-primary bg-gray dark:bg-transparent"
            }`}
          >
            <span
              className={`h-2.5 w-2.5 rounded-sm ${isChecked && "bg-primary"}`}
            ></span>
          </div>
        </div>
        {(label && label !== '') ? label : 'Checkbox Text'}
      </label>
    </div>
  );
};

export default CheckboxOne;

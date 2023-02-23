import clsx from "clsx";
import { DetailedHTMLProps, InputHTMLAttributes, forwardRef } from "react";

import ErrorText from "../ErrorText";

type Radio = {
  label: string;
  value: number;
};

type RadioGroupProps = {
  radios: readonly Radio[];
  error?: boolean;
  errorText?: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  (props, ref) => {
    const { errorText, radios, error, ...otherProps } = props;

    return (
      <div>
        <div className="relative flex flex-wrap">
          {radios.map((radio) => (
            <div key={radio.label} className="mr-4 flex items-center">
              <input
                ref={ref}
                {...otherProps}
                id={radio.label}
                type="radio"
                value={radio.label}
                className={clsx(
                  error ? "border-red-500" : "border-gray-300",
                  "h-4 w-4 bg-surface-light"
                )}
              />
              <label
                htmlFor={radio.label}
                className={clsx(
                  error ? "text-red-500" : "text-white",
                  "ml-1 text-sm font-medium"
                )}
              >
                {radio.label}
              </label>
            </div>
          ))}
        </div>

        <ErrorText error={error}>{errorText}</ErrorText>
      </div>
    );
  }
);

export default RadioGroup;

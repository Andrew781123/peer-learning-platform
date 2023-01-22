import clsx from "clsx";
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";

type Radio = {
  label: string;
  value: number;
};

type RadioGroupProps = {
  radios: readonly Radio[];
  error?: boolean;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

const RadioGroup = forwardRef<HTMLInputElement, RadioGroupProps>(
  (props, ref) => {
    const { radios, error, ...otherProps } = props;

    return (
      <div className="flex flex-wrap">
        {radios.map((radio) => (
          <div key={radio.label} className="mr-4 flex items-center">
            <input
              ref={ref}
              {...otherProps}
              id={radio.label}
              type="radio"
              value={radio.label}
              className={clsx(
                error
                  ? "border-red-500 text-red-500"
                  : "border-gray-300 text-primary-default",
                "h-4 w-4 bg-gray-100"
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
    );
  }
);

export default RadioGroup;

import clsx from "clsx";
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";
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
        <div className="mb-4 flex items-center">
          <input
            id="default-radio-1"
            type="radio"
            value=""
            name="default-radio"
            className="h-4 w-4 dark:border-gray-600 dark:bg-red-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
          />
          <label
            htmlFor="default-radio-1"
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Default radio
          </label>
        </div>
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
                  error
                    ? "border-red-500 text-red-500"
                    : "border-gray-300 text-primary-default",
                  "h-4 w-4 bg-gray-500"
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

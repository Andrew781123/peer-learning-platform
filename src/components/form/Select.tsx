import clsx from "clsx";
import { useState } from "react";

export interface Option {
  label: string;
  value: string;
}

type SelectProps<TOption extends Option = Option> = {
  multiple?: boolean;
  options: TOption[];
  defaultValue?: TOption;
  value?: TOption;
  onChange: (value: TOption | undefined) => void;
};

const Select = (props: SelectProps) => {
  const { options, defaultValue, value, onChange } = props;

  const [isShown, setIsShown] = useState(false);

  const toggleIsShown = () => {
    setIsShown((isShown) => !isShown);
  };

  const clearOptions = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onChange(undefined);
  };

  const selectOption = (option: Option): void => {
    onChange(option);
    setIsShown(false);
  };

  const isOptionSelected = (option: Option): boolean => {
    return option.value === value?.value;
  };

  return (
    <div
      onClick={toggleIsShown}
      onBlur={() => setIsShown(false)}
      tabIndex={0}
      className="relative flex min-h-[1.5em] min-w-[9em] max-w-full items-center gap-2 rounded-lg border  border-onSurface bg-surface-light p-2 text-onSurface focus:border-primary-dark focus:ring-primary-dark"
    >
      <span className="flex-grow">{value?.label}</span>
      <button
        onClick={(e) => clearOptions(e)}
        className="focus:text-onBackground"
      >
        &times;
      </button>
      {/* divider */}
      <div className="w-[.05em] self-stretch bg-onSurface"></div>
      {/* down */}
      <div className="translate-y-[.25em] cursor-pointer border-[.25em] border-solid border-transparent border-t-onSurface"></div>

      <ul
        className={clsx(
          "absolute top-[calc(100%+0.25em)] left-0 z-50 max-h-60 w-full overflow-y-auto rounded-lg border border-onSurface bg-surface-light",
          isShown ? "block" : "hidden"
        )}
      >
        {options.map((option) => (
          <li
            key={option.value}
            onClick={(e) => {
              e.stopPropagation();
              selectOption(option);
            }}
            className={clsx(
              "cursor-pointer  py-1 px-2 hover:bg-secondary-default hover:text-onSecondary",
              isOptionSelected(option)
                ? "bg-secondary-dark text-onSecondary"
                : ""
            )}
          >
            {option.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Select;

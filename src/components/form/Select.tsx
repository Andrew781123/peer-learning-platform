import clsx from "clsx";
import { useState } from "react";
import CrossButton from "../ui/CrossButton";
import MultiSelectBadge from "./MultiSelcctBadge";

export interface Option {
  label: string;
  value: string | number;
}

type SingleSelectProps<TOption extends Option = Option> = {
  multiple: false;
  defaultValue?: TOption;
  value?: TOption;
  onChange: (value: TOption | undefined) => void;
};

type MultipleSelectProps<TOption extends Option = Option> = {
  multiple: true;
  defaultValue?: TOption[];
  value: TOption[];
  onChange: (value: TOption[]) => void;
};

type SelectProps<TOption extends Option = Option> = {
  options: TOption[];
} & (MultipleSelectProps<TOption> | SingleSelectProps<TOption>);

const Select = (props: SelectProps) => {
  const { multiple, options, defaultValue, value, onChange } = props;

  const [isShown, setIsShown] = useState(false);

  const toggleIsShown = () => {
    setIsShown((isShown) => !isShown);
  };

  const clearOptions = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    multiple ? onChange([]) : onChange(undefined);
  };

  const selectOption = (option: Option): void => {
    if (!multiple) return onChange(option);

    if (value.some((v) => v.value === option.value)) {
      const newSelectedOptions = value.filter((v) => v.value !== option.value);

      return onChange(newSelectedOptions);
    }

    onChange([...value, option]);
  };

  const isOptionSelected = (option: Option): boolean => {
    return multiple
      ? value.some((v) => v.value === option.value)
      : value?.value === option.value;
  };

  return (
    <div
      onClick={toggleIsShown}
      onBlur={() => setIsShown(false)}
      tabIndex={0}
      className="relative flex min-h-[1.5em] min-w-[15em] max-w-[50%] items-center gap-2 rounded-lg border  border-onSurface bg-surface-light p-2 text-onSurface focus:border-primary-dark focus:ring-primary-dark"
    >
      <div className="flex flex-grow flex-row flex-wrap items-center gap-1">
        {multiple ? (
          value.map((v) => (
            <MultiSelectBadge
              key={v.label}
              optionLabel={v.label}
              crossButton={
                <CrossButton
                  onClick={(e) => {
                    e.stopPropagation();
                    selectOption(v);
                  }}
                />
              }
            />
          ))
        ) : (
          <span>{value?.label}</span>
        )}
      </div>
      <CrossButton onClick={clearOptions} />
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
              setIsShown(false);
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

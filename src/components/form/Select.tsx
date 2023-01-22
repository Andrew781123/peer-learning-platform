import clsx from "clsx";
import { LegacyRef, useState } from "react";
import CrossButton from "../ui/CrossButton";
import MultiSelectBadge from "./MultiSelcctBadge";

export interface Option<TValue extends string | number = string | number> {
  label: string;
  value: TValue;
}

type SingleSelectProps<TValue extends string | number> = {
  multiple: false;
  defaultValue?: TValue;
  value?: TValue;
  onChange: (option: TValue | undefined) => void;
};

type MultipleSelectProps<TValue extends string | number> = {
  multiple: true;
  defaultValue?: TValue[];
  value: TValue[];
  onChange: (option: TValue[]) => void;
};

type SelectProps<
  TOption extends Option = Option,
  TValue extends string | number = string
> = {
  options: TOption[];
  error?: boolean;
} & (MultipleSelectProps<TValue> | SingleSelectProps<TValue>);

const Select = <TValue extends string | number>(
  props: SelectProps<Option<TValue>, TValue> & {
    myRef: LegacyRef<HTMLDivElement>;
  }
) => {
  const { multiple, options, error, value, onChange, myRef } = props;

  const [isShown, setIsShown] = useState(false);

  const toggleIsShown = () => {
    setIsShown((isShown) => !isShown);
  };

  const clearOptions = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    multiple ? onChange([]) : onChange(undefined);
  };

  const selectOption = (selectedValue: TValue): void => {
    if (!multiple) return onChange(selectedValue);

    const isOptionAlreadySelected = value.some((v) => v === selectedValue);
    if (isOptionAlreadySelected) {
      const newSelectedOptions = value.filter((v) => v !== selectedValue);

      return onChange(newSelectedOptions);
    }

    onChange([...value, selectedValue]);
  };

  const isOptionSelected = (option: Option<TValue>): boolean => {
    return multiple
      ? value.some((v) => v === option.value)
      : value === option.value;
  };

  return (
    <div
      ref={myRef}
      onClick={toggleIsShown}
      onBlur={() => setIsShown(false)}
      tabIndex={0}
      className={clsx(
        error ? "border-red-500" : "border-onSurface",
        "relative flex min-h-[3.1em] min-w-[15em] max-w-[50%] items-center gap-2 rounded-lg border   bg-surface-light p-2 text-onSurface focus:border-primary-dark focus:ring-primary-dark"
      )}
    >
      <div className="flex flex-grow flex-row flex-wrap items-center gap-1">
        {multiple ? (
          value.map((v) => (
            <MultiSelectBadge
              key={options.find((option) => option.value === v)!.label}
              optionLabel={options.find((option) => option.value === v)!.label}
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
          <span>{options.find((option) => option.value === value)!.label}</span>
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
              selectOption(option.value);
              setIsShown(false);
            }}
            className={clsx(
              "hover:text-onSecondary,  flex cursor-pointer justify-between py-1 px-2 hover:bg-surface-default"
            )}
          >
            <p>{option.label}</p>
            {isOptionSelected(option) && <p>&#10003;</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Select;

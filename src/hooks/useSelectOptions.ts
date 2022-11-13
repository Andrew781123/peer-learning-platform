type UseSelectOptionsProps<
  TLabelKey extends keyof TData,
  TValueKey extends keyof TData,
  TData = any[]
> = {
  data: TData[];
  labelKey: TLabelKey;
  valueKey: TValueKey;
};

const useSelectOptions = <
  TLabelKey extends keyof TData,
  TValueKey extends keyof TData,
  TData = any[]
>(
  props: UseSelectOptionsProps<TLabelKey, TValueKey, TData>
): {
  options: {
    label: string;
    value: TData[TValueKey];
  }[];
} => {
  const { data, labelKey, valueKey } = props;

  const options = data.map((option) => ({
    label: String(option[labelKey]),
    value: option[valueKey],
  }));

  return {
    options,
  };
};

export default useSelectOptions;

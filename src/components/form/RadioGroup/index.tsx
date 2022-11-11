type Radio = {
  label: string;
  value: number;
};

type RadioGroupProps = {
  radios: readonly Radio[];
};

const RadioGroup = (props: RadioGroupProps) => {
  const { radios } = props;

  return (
    <div className="flex flex-wrap">
      {radios.map((radio) => (
        <div key={radio.label} className="mr-4 flex items-center">
          <input
            id={radio.label}
            type="radio"
            value={radio.value}
            name={radio.label}
            className="focus:primary-dark h-4 w-4 border-gray-300 bg-gray-100 text-primary-default focus:ring-2 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-dark"
          />
          <label
            htmlFor={radio.label}
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            {radio.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default RadioGroup;

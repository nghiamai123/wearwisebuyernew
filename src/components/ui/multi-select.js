import Select from "react-select";

export const MultiSelect = ({ options, value, onChange }) => {
  return (
    <Select
      options={options}
      isMulti
      value={value}
      onChange={onChange}
      className="w-full"
    />
  );
};


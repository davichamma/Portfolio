const Input = ({
  text,
  type,
  id,
  placeholder,
  value,
  onChange,
  disabled,
  defaultValue,
  step,
  max,
}) => {
  return (
    <div className="form-group my-4">
      <label htmlFor={id} className="mb-2">
        {text}
      </label>
      <input
        disabled={disabled}
        step={step}
        type={type}
        className="form-control"
        id={id}
        name={id}
        placeholder={placeholder}
        value={value || defaultValue}
        onChange={onChange}
        max={max}
        min={1}
      />{" "}
    </div>
  );
};

export default Input;

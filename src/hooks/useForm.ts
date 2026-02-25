import { useState } from 'react';

type Validator<T> = (values: T) => Partial<Record<keyof T, string>>;

export default function useForm<T extends Record<string, any>>(params: {
  initialValues: T;
  validate?: Validator<T>;
}) {
  const { initialValues, validate } = params;
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const setField = (key: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [key]: value }));
    // clear error on change
    setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const runValidation = () => {
    if (!validate) return {} as typeof errors;
    const res = validate(values);
    setErrors(res);
    return res;
  };

  const handleSubmit = (onValid: (vals: T) => void) => {
    const res = runValidation();
    const hasErrors = Object.keys(res).length > 0;
    if (!hasErrors) onValid(values);
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return { values, setField, errors, handleSubmit, reset };
}

import React, {useRef} from 'react';
import {Path, UseFormGetFieldState} from 'react-hook-form';
import {TextInput} from 'react-native';

export const useFormInputRefs = <T extends Record<string, any>>(
  getValues: () => T,
  getFieldState: UseFormGetFieldState<T>,
  options?: {
    skipKeys?: (keyof T)[];
    onFocusScroll?: (key: keyof T) => void;
  },
) => {
  const fieldNames = Object.keys(getValues()) as (keyof T)[];
  const skipKeys = options?.skipKeys ?? [];

  const refs = useRef(
    Object.fromEntries(
      fieldNames.map(k => [k, React.createRef<TextInput>()]),
    ) as Record<keyof T, React.RefObject<TextInput>>,
  ).current;

  const getSubmitHandler = (key: keyof T) => {
    const currentIndex = fieldNames.indexOf(key);
    let nextIndex = currentIndex + 1;

    while (nextIndex < fieldNames.length) {
      const nextKey = fieldNames[nextIndex];
      if (!skipKeys.includes(nextKey) && refs[nextKey]?.current) {
        return () => {
          options?.onFocusScroll?.(nextKey);
          refs[nextKey]?.current?.focus();
        };
      }
      nextIndex++;
    }

    return () => {};
  };

  const focusErrorField = (errorFields: (keyof T)[]) => {
    for (const key of errorFields) {
      if (!skipKeys.includes(key) && refs[key]?.current) {
        options?.onFocusScroll?.(key);
        refs[key]?.current.focus();
        break;
      }
    }
  };

  const getFieldValidationState = (field: Path<T>) => {
    return getFieldState(field)?.isTouched;
  };

  return {
    refs,
    getSubmitHandler,
    focusErrorField,
    getFieldValidationState,
  };
};

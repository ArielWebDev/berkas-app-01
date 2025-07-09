import { InputHTMLAttributes, forwardRef, useEffect } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  isFocused?: boolean;
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className = '', isFocused = false, ...props }, ref) => {
    useEffect(() => {
      if (isFocused && ref && 'current' in ref && ref.current) {
        ref.current.focus();
      }
    }, [isFocused, ref]);

    return (
      <input
        {...props}
        className={
          'rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ' +
          className
        }
        ref={ref}
      />
    );
  }
);

TextInput.displayName = 'TextInput';

export default TextInput;

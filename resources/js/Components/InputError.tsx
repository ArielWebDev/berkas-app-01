interface InputErrorProps {
  message?: string;
  className?: string;
}

export default function InputError({
  message,
  className = '',
}: InputErrorProps) {
  return message ? (
    <div className={`text-sm text-red-600 ${className}`}>{message}</div>
  ) : null;
}

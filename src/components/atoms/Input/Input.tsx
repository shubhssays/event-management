import React from 'react';
import styles from './Input.module.css';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  icon?: React.ReactNode;
  error?: string;
  multiline?: boolean;
  rows?: number;
  actionButton?: {
    icon: React.ReactNode;
    onClick: () => void;
    ariaLabel?: string;
  };
}

export const Input: React.FC<InputProps> = ({
  icon,
  error,
  multiline,
  rows = 4,
  className,
  actionButton,
  ...props
}) => {
  const inputClasses = clsx(
    styles.input,
    icon && styles.withIcon,
    error && styles.error,
    className
  );

  const inputClassesWithAction = clsx(
    inputClasses,
    actionButton && styles.withActionButton
  );

  const isDateTimeInput = props.type === 'datetime-local';
  const dateTimeInputRef = React.useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = React.useState('');

  // Formatting datetime-local value
  const formatDateTime = (value: string) => {
    if (!value) return '';
    const date = new Date(value);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year}, ${hours}:${minutes}`;
  };

  // Updating display value when value changes
  React.useEffect(() => {
    if (isDateTimeInput && props.value) {
      setDisplayValue(formatDateTime(String(props.value)));
    } else if (isDateTimeInput && !props.value) {
      setDisplayValue('');
    }
  }, [props.value, isDateTimeInput]);

  const handleDateTimeWrapperClick = () => {
    if (dateTimeInputRef.current) {
      dateTimeInputRef.current.showPicker?.();
    }
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue) {
      setDisplayValue(formatDateTime(newValue));
    }
    // Calling the original onChange
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const handleDisplayInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ignoring all keyboard input except Tab and Escape
    if (e.key !== 'Tab' && e.key !== 'Escape') {
      e.preventDefault();
      // Opening date time picker when any key is pressed
      if (dateTimeInputRef.current) {
        dateTimeInputRef.current.showPicker?.();
      }
    }
  };

  if (isDateTimeInput) {
    return (
      <div className={styles.inputWrapper}>
        {icon && <span className={styles.icon}>{icon}</span>}
        {/* Hidden datetime-local input */}
        <input
          ref={dateTimeInputRef}
          type="datetime-local"
          className={styles.hiddenDateTimeInput}
          value={props.value as string}
          onChange={handleDateTimeChange}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          tabIndex={-1}
        />
        {/* Visible display input */}
        <input
          type="text"
          className={inputClassesWithAction}
          value={displayValue}
          placeholder={props.placeholder}
          onClick={handleDateTimeWrapperClick}
          onKeyDown={handleDisplayInputKeyDown}
          readOnly
          aria-label={props['aria-label'] || 'Date and time'}
        />
        {actionButton && (
          <button
            type="button"
            className={styles.actionButton}
            onClick={actionButton.onClick}
            aria-label={actionButton.ariaLabel || 'Action'}
          >
            {actionButton.icon}
          </button>
        )}
        {error && <span className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }

  return (
    <div className={styles.inputWrapper}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {multiline ? (
        <textarea
          className={inputClassesWithAction}
          rows={rows}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          className={inputClassesWithAction}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {actionButton && (
        <button
          type="button"
          className={styles.actionButton}
          onClick={actionButton.onClick}
          aria-label={actionButton.ariaLabel || 'Action'}
        >
          {actionButton.icon}
        </button>
      )}
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};

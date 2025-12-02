import React from 'react';
import { Input } from '../../atoms/Input/Input';
import styles from './FormInput.module.css';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  icon?: React.ReactNode;
  error?: string;
  multiline?: boolean;
  rows?: number;
  label?: string;
  actionButton?: {
    icon: React.ReactNode;
    onClick: () => void;
    ariaLabel?: string;
  };
  inputClassName?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  icon,
  error,
  multiline,
  rows,
  label,
  actionButton,
  inputClassName,
  ...props
}) => {
  return (
    <div className={styles.formField}>
      {label && <label className={styles.label}>{label}</label>}
      <Input
        icon={icon}
        error={error}
        multiline={multiline}
        rows={rows}
        actionButton={actionButton}
        className={inputClassName}
        {...props}
      />
    </div>
  );
};

import { FC, useState, MouseEvent, useEffect } from "react";
import styles from "./Dropdown.module.scss";

interface IDropDownProps {
  testId?: string;
  value: string | number;
  initialOption: string;
  options: string[] | number[];
  hasError?: boolean;
  onClick: (event: MouseEvent<HTMLLIElement>) => void;
}

const DropDown: FC<IDropDownProps> = ({
  value,
  initialOption,
  options,
  onClick,
  testId,
  hasError,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = (): void => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [value]);

  return (
    <div className={`${styles.dropdown} ${hasError ? styles.hasError : ""}`}>
      <div className={styles.selected} onClick={handleClick}>
        {value ? value : initialOption}
        <span className={styles.carpet}></span>
      </div>

      <ul
        data-testid={testId}
        className={`${styles.options} ${isOpen ? styles.active : ""}`}
      >
        {options.length > 0 &&
          options.map((option) => (
            <li key={crypto.randomUUID()} onClick={onClick}>
              {option}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default DropDown;

import clsx from 'clsx';
import { ComponentProps } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import styles from './DeleteButton.module.css';

type DeleteButtonPropTypes = {
    label: string;
} & ComponentProps<'button'>;

export default function DeleteButton({ label, className, onClick, ...props }: DeleteButtonPropTypes) {
    return (
        <button className={clsx(styles.deleteButton, className)} onClick={onClick}>
            {label}
            <FaTrashAlt />
        </button>
    );
}

import { ComponentProps, ReactNode } from 'react';
import styles from './ModuleContainer.module.css';
import { clsx } from 'clsx';

type ModuleContainerPropTypes = {
    heading?: string;
    children: ReactNode;
};

export default function ModuleContainer({
    heading,
    children,
    ...attributes
}: ModuleContainerPropTypes & ComponentProps<'div'>) {
    const { className } = attributes;

    return (
        // Order of attributes here matters
        <div {...attributes} className={clsx(styles.defaultContainer, className)}>
            {heading && <h3>{heading}</h3>}
            {children}
        </div>
    );
}

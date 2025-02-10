import { clsx } from 'clsx';
import { ComponentProps, ReactNode } from 'react';
import { UseMeasureRef } from 'react-use/lib/useMeasure';
import styles from './ModuleContainer.module.css';

type ModuleContainerPropTypes = {
    forwardRef?: UseMeasureRef<HTMLDivElement>;
    heading?: ReactNode;
    // For shadow effect
    elevation?: 'low' | 'medium' | 'high';
    children: ReactNode;
};

export default function ModuleContainer({
    forwardRef,
    heading,
    elevation,
    children,
    ...attributes
}: ModuleContainerPropTypes & ComponentProps<'div'>) {
    const { className } = attributes;

    const containerClass = clsx(styles.defaultContainer, className, {
        'background-secondary-elevation-low': elevation === 'low',
        'background-secondary-elevation-medium': elevation === 'medium',
        'background-secondary-elevation-high': elevation === 'high',
    });

    return (
        // Order of attributes here matters
        <div ref={forwardRef} {...attributes} className={containerClass}>
            {heading && <h3 className={styles.heading}>{heading}</h3>}
            {children}
        </div>
    );
}

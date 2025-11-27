import React from 'react';
import styles from './BottomSheet.module.css';

interface BottomSheetPropTypes {
    children: React.ReactNode;
}

export default function BottomSheet({ children }: BottomSheetPropTypes) {
    return <div className={styles.bottomSheet}>{children}</div>;
}

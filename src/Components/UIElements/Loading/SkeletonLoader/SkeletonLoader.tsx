import styles from './SkeletonLoader.module.css';

type SkeletonLoaderPropTypes = {
    children: any,
    isActive: boolean,
    height: number | string,
    width?: number | string,
    customStyling?: Record<any, string>,
    align?: 'center' | 'left' | 'right'
}

export default function SkeletonLoader({ children, isActive, height = 24, width = '100%', customStyling = {}, align }: SkeletonLoaderPropTypes) {
    if(isActive) {
        const loaderStyles: Record<string, string | number> = {
            height,
            width,
            ...customStyling
        };

        if(align === 'center') {
            loaderStyles.margin = 'auto';
        } else if(align === 'right') {
            loaderStyles.marginLeft = 'auto';
        } if(align === 'left') {
            loaderStyles.marginRight = 'auto';
        }

        return <div className={styles.loadingWrapper} style={loaderStyles} />;
    }

    return children || null;
}
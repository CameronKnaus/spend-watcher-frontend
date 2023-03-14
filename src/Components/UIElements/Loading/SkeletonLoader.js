import styles from 'Styles/Components/UIElements/Loading/SkeletonLoader.module.css';

// align - string - 'center' | 'left' | 'right'
export default function SkeletonLoader({ children, isActive, height = 24, width = '100%', customStyling = {}, align }) {
    if(isActive) {
        const loaderStyles = {
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
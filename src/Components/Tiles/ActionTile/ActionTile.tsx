import styles from './ActionTile.module.css';
import { CgChevronRight } from 'react-icons/cg';
import SkeletonLoader from 'Components/UIElements/Loading/SkeletonLoader/SkeletonLoader';
import { Color } from 'Types/StyleTypes';

interface ActionTileOptionsType {
    showValueAbove?: boolean,
    valueColor?: Color,
    minWidth?: number | string,
    maxWidth?: number | string,
    paddingBelow?: number | string
}

const defaultOptions: ActionTileOptionsType = {
    showValueAbove: false,
    valueColor: '#333333',
    minWidth: 295,
    maxWidth: 'none',
    paddingBelow: 24
};

type ActionTilePropTypes = {
    title: string,
    subtitle?: string,
    value?: string,
    fallbackActionPrompt?: string,
    fallbackDescription?: string,
    ariaValue?: string, // - alternative value for screen readers to read for value
    actionPrompt: string,
    useShadow?: boolean,
    callback?: () => void,
    options?: ActionTileOptionsType,
    isLoading: boolean,
    isInactive?: boolean
} | {
    title: string,
    subtitle?: string,
    value: undefined,
    fallbackActionPrompt: string,
    fallbackDescription?: string,
    ariaValue?: string,
    actionPrompt: string,
    useShadow?: boolean,
    callback?: () => void,
    options?: ActionTileOptionsType,
    isLoading: boolean,
    isInactive?: boolean
}

function ActionTile({
    title,
    subtitle,
    value,
    fallbackActionPrompt,
    fallbackDescription,
    ariaValue,
    actionPrompt,
    useShadow = false,
    callback = () => { /* NOOP */ },
    options,
    isLoading = false,
    isInactive = false
}: ActionTilePropTypes) {
    const args = Object.assign({}, defaultOptions, options);

    const { minWidth, maxWidth, paddingBelow } = args;
    const container = (children: any) => (
        <div style={{ paddingBottom: paddingBelow }}>
            <button className={`${styles.container} ${useShadow ? 'high-shadow' : ''}`}
                    style={{ minWidth, maxWidth }}
                    onClick={callback}
            >
                {children}
            </button>
        </div>
    );

    if(isInactive) {
        return container(
            <div className={styles.flexContainer}>
                <div className={styles.descriptionContainer}>
                    <Title title={title} />
                    {
                        fallbackDescription && (
                            <div className={`${styles.subtitle} ${styles.pb12}`}>
                                {fallbackDescription}
                            </div>
                        )
                    }
                    <div className={styles.actionPrompt}>
                        {fallbackActionPrompt}
                    </div>
                </div>
                <CgChevronRight className={styles.chevron} />
            </div>
        );
    }

    if(args.showValueAbove) {
        return container(
            <>
                {/* Accessible header */}
                <Title hideFromScreen title={title} />
                <div aria-label={ariaValue || value}
                     className={`${styles.centeredValue} ${styles.pb12}`}
                     style={{ color: args.valueColor }}
                >
                    <SkeletonLoader isActive={isLoading} height={38} width='60%' align='center'>
                        {value}
                    </SkeletonLoader>
                </div>
                <Title hideFromScreenReader title={title} />
                {
                    subtitle && (
                        <div className={`${styles.subtitle} ${styles.pb12}`}>
                            {subtitle}
                        </div>
                    )
                }
                <div className={styles.actionPrompt}>
                    {actionPrompt}
                </div>
            </>
        );
    }

    if(subtitle) {
        return container(
            <>
                <Title extraSpace title={title} />
                <div className={styles.flexContainer}>
                    <div className={styles.descriptionContainer}>
                        <div className={styles.subtitle}>
                            {subtitle}
                        </div>
                        <div aria-hidden
                             className={styles.actionPrompt}
                        >
                            {actionPrompt}
                        </div>
                    </div>
                    <div aria-label={ariaValue || value}
                         className={styles.valueContainer}
                         style={{ color: args.valueColor }}
                    >
                        <SkeletonLoader isActive={isLoading} height={34}>
                            {value}
                        </SkeletonLoader>
                    </div>
                    <div className='accessible-text'>
                        {actionPrompt}
                    </div>
                </div>
            </>
        );
    }

    return container(
        <div className={styles.flexContainer}>
            <div className={styles.descriptionContainer}>
                <Title title={title} />
                <div aria-hidden
                     className={styles.actionPrompt}
                >
                    {actionPrompt}
                </div>
            </div>
            <div aria-label={ariaValue || value}
                 className={styles.valueContainer}
                 style={{ color: args.valueColor }}
            >
                <SkeletonLoader isActive={isLoading} height={34}>
                    {value}
                </SkeletonLoader>
            </div>
            <div className='accessible-text'>
                {actionPrompt}
            </div>
        </div>
    );
}

export default ActionTile;

type TitlePropTypes = {
    title: string,
    extraSpace?: boolean,
    hideFromScreenReader?: boolean,
    hideFromScreen?: boolean
}

function Title({ title, extraSpace = false, hideFromScreenReader = false, hideFromScreen = false }: TitlePropTypes) {
    return (
        <div aria-hidden={hideFromScreenReader}
             className={`${styles.title} ${hideFromScreen ? 'accessible-text' : '' } ${extraSpace ? styles.pb12 : styles.pb8}`}
        >
            {title}
        </div>
    );
}
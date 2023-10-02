import styles from './LabelAndValueBox.module.css';
import SkeletonLoader from 'Components/UIElements/Loading/SkeletonLoader/SkeletonLoader';
import formatCurrency from 'Util/Formatters/formatCurrency';

type LabelAndValueBoxPropTypes = {
    label: string,
    value: number | string,
    isLoading: boolean,
    valueChange?: number | null,
    valueChangeLabel?: string,
    secondaryTheme?: boolean,
    fontSize?: number,
    fontWeight?: string
}

export default function LabelAndValueBox({
    label,
    value,
    isLoading,
    valueChange,
    valueChangeLabel,
    secondaryTheme = false,
    fontSize = 16,
    fontWeight = 'var(--fw-regular)'
}: LabelAndValueBoxPropTypes) {

    let valueChangeSign = '+';
    let valueChangeColor = 'var(--theme-standard-text)';
    if(valueChange && valueChange > 0) {
        valueChangeColor = 'var(--theme-money-loss)';
    } else if(valueChange && valueChange < 0) {
        valueChangeSign = '';
        valueChangeColor = 'var(--theme-money-gain)';
    }

    return (
        <div className={secondaryTheme ? `${styles.container} ${styles.secondaryTheme}` : styles.container}>
            <div style={{ fontSize, fontWeight }}>
                {label}
                <span style={{ float: 'right', color: 'var(--theme-money-loss)' }}>
                    <SkeletonLoader isActive={isLoading} height={20} width={90}>
                        {value}
                    </SkeletonLoader>
                </span>
            </div>
            { (valueChange != null && valueChange !== 0) && (
                <div className={styles.valueChange}>
                    {valueChangeLabel}
                    <span style={{ color: valueChangeColor }}>
                        {` (${valueChangeSign + formatCurrency(valueChange)})`}
                    </span>
                </div>
            )}
        </div>
    );
}
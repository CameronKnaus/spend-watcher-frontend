import styles from 'Styles/Components/UIElements/DataVisualization/LabelAndValueBox.module.css';
import SkeletonLoader from '../Loading/SkeletonLoader';
import formatCurrency from '../../../Util/formatCurrency';

export default function LabelAndValueBox({ label,
    value,
    isLoading,
    valueChange,
    valueChangeLabel,
    secondaryTheme,
    fontSize = 16,
    fontWeight = 'var(--fw-regular)' }) {

    let valueChangeSign = '+';
    let valueChangeColor = 'var(--theme-standard-text)';
    if(valueChange > 0) {
        valueChangeColor = 'var(--theme-money-loss)';
    } else if(valueChange < 0) {
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
                    <SkeletonLoader height={20} width={90}>
                        {valueChangeLabel}
                        <span style={{ color: valueChangeColor }}>
                            {` (${valueChangeSign + formatCurrency(valueChange)})`}
                        </span>
                    </SkeletonLoader>
                </div>
            )}
        </div>
    );
}
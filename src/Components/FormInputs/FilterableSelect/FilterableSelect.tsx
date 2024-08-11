import { ChangeEvent, ComponentProps, forwardRef, useEffect, useRef, useState } from 'react';
import styles from './FilterableSelect.module.css';
import useContent from 'Hooks/useContent';

type FilterableSelectOptionType = {
    value: string;
    optionName: string;
};

type FilterableSelectPropTypes = {
    opens: 'up' | 'down';
    noSelectionText: string;
    clearLabel?: string;
    optionsList: FilterableSelectOptionType[];
} & ComponentProps<'input'>;

// eslint-disable-next-line react/display-name
const FilterableSelect = forwardRef(
    (
        { opens, clearLabel, noSelectionText, optionsList, ...props }: FilterableSelectPropTypes,
        ref: React.ForwardedRef<HTMLInputElement>,
    ) => {
        const [selectedValue, setSelectedValue] = useState<FilterableSelectOptionType | null>(null);
        const containerRef = useRef<HTMLDivElement | null>(null);
        const popOverMenuRef = useRef<HTMLDivElement | null>(null);
        const getContent = useContent('GENERAL');
        const [isOpen, setIsOpen] = useState(false);
        const [filterText, setFilterText] = useState('');

        useEffect(() => {
            function toggleOpen(event: MouseEvent) {
                if (!containerRef.current) {
                    return;
                }

                const target = event.target as Node;
                const targetWithinBounds =
                    popOverMenuRef.current?.contains(target) || containerRef.current.contains(target);
                setIsOpen(targetWithinBounds);
            }

            document.addEventListener('click', toggleOpen);

            return () => document.removeEventListener('click', toggleOpen);
        }, [ref]);

        function filter(option: FilterableSelectOptionType) {
            const targetText = filterText.toLowerCase();
            const optionText = option.optionName.toLowerCase();
            return optionText.includes(targetText);
        }

        function currentSelectedValue() {
            // If the text input is still in focus only show filter text
            if (containerRef.current?.contains(document.activeElement)) {
                return filterText;
            }

            if (props.value) {
                return optionsList.find((option) => option.value === props.value)?.optionName || getContent('EMPTY');
            }

            return '';
        }

        return (
            <div ref={containerRef} className={styles.selectContainer}>
                <input
                    ref={ref}
                    type="text"
                    {...props}
                    value={currentSelectedValue()}
                    placeholder={noSelectionText}
                    onChange={(event) => {
                        setFilterText(event.target.value);
                    }}
                />
                <div className={`${styles.arrow} ${isOpen ? styles.open : ''}`} />
                {isOpen && (
                    <div
                        ref={popOverMenuRef}
                        className={styles.options}
                        style={opens === 'down' ? { top: '100%' } : { bottom: '100%' }}
                    >
                        {optionsList.filter(filter).map((option) => (
                            <div
                                key={option.value}
                                className={`${styles.option} ${selectedValue?.value === option.value ? styles.selected : ''}`}
                                onClick={() => {
                                    props.onChange?.(fakeChangeEvent(option.value));
                                    setSelectedValue(option);
                                    setFilterText('');
                                    setIsOpen(false);
                                }}
                            >
                                {option.optionName}
                            </div>
                        ))}
                        {clearLabel && (
                            <div
                                className={styles.option}
                                onClick={() => {
                                    props.onChange?.(fakeChangeEvent(''));
                                    setSelectedValue(null);
                                    setFilterText('');
                                    setIsOpen(false);
                                }}
                            >
                                <div className={styles.clearLabel}>{clearLabel}</div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    },
);

export default FilterableSelect;

function fakeChangeEvent(value: string): ChangeEvent<HTMLInputElement> {
    return {
        // @ts-expect-error - This is a synthetic event
        target: {
            value: value,
        },
    };
}

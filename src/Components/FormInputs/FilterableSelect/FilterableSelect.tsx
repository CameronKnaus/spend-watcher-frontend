import { ComponentProps, Dispatch, forwardRef, SetStateAction, useEffect, useRef, useState } from 'react';
import styles from './FilterableSelect.module.css';
import useContent from 'Hooks/useContent';

type FilterableSelectOptionType = {
    value: string;
    optionName: string;
};

type FilterableSelectPropTypes = {
    selectedValue: string;
    setSelectedValue: Dispatch<SetStateAction<string>>;
    optionsList: FilterableSelectOptionType[];
} & ComponentProps<'input'>;

// eslint-disable-next-line react/display-name
const FilterableSelect = forwardRef(
    (
        { selectedValue, setSelectedValue, optionsList, ...props }: FilterableSelectPropTypes,
        ref: React.ForwardedRef<HTMLInputElement>,
    ) => {
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

        return (
            <div ref={containerRef} className={styles.selectContainer}>
                <input
                    ref={ref}
                    type="text"
                    {...props}
                    onChange={(event) => {
                        setFilterText(event.target.value);
                    }}
                />
                {isOpen && (
                    <div ref={popOverMenuRef} className={styles.options}>
                        {optionsList.filter(filter).map((option) => (
                            <div
                                key={option.value}
                                className={`${styles.option} ${selectedValue === option.value ? styles.selected : ''}`}
                                onClick={() => {
                                    setSelectedValue(option.value);
                                    setFilterText('');
                                    setIsOpen(false);
                                }}
                            >
                                {/* <div
                                className={styles.iconContainer}
                                style={{ backgroundColor: option.iconBackgroundColor }}
                            >
                                {option.icon}
                            </div> */}
                                {option.optionName}
                            </div>
                        ))}
                        <div className={styles.option} onClick={() => setSelectedValue('')}>
                            <div className={styles.clearLabel}>{getContent('CLEAR_SELECTION')}</div>
                        </div>
                    </div>
                )}
            </div>
        );
    },
);

export default FilterableSelect;

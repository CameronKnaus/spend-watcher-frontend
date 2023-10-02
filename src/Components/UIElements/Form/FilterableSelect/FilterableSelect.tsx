import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import styles from './FilterableSelect.module.css';
import useContent from 'CustomHooks/useContent';
import { Color } from 'Types/StyleTypes';
import { IconComponentType } from 'Types/QoLTypes';

// When tracking this field, the containing parent component should manage the state for value

type FilterableSelectOption = {
    value: string | number; // The value that will be passed to on change.  This is not seen by the user
    icon: IconComponentType;// The icon to be used next to the option
    iconBackgroundColor: Color;
    optionName: string; // The text shown to the user for the given option
}

type FilterableSelectPropTypes = {
    id?: string,
    textInputStyles: string,
    value: string | number,
    setValue: Dispatch<SetStateAction<string | number>>,
    optionsList: Array<FilterableSelectOption>,
    nothingSelectedText: string,
}

export default function FilterableSelect({ id = 'filterable-select-input', textInputStyles, value, setValue, optionsList, nothingSelectedText }: FilterableSelectPropTypes) {
    const [open, setOpen] = useState(false);
    const [filterText, setFilterText] = useState('');
    const ref = useRef<HTMLInputElement | null>(null);
    const getContent = useContent('GENERAL');


    useEffect(() => {
        document.addEventListener('click', toggleOpen);

        return () => document.removeEventListener('click', toggleOpen);
    }, []);

    function toggleOpen(event: MouseEvent) {
        setOpen(event && event.target === ref.current);
    }

    function filter(options: Array<FilterableSelectOption>) {
        const target = filterText.toLowerCase();

        return options.filter((option: FilterableSelectOption) => {
            const optionName = option.optionName.toLowerCase();
            return optionName.indexOf(target) > -1;
        });
    }

    function currentSelectedValue() {
        // If the text input is still in focus only show filter text
        if(document.activeElement === ref.current) {
            return filterText;
        }

        if(value) {
            return optionsList.find(option => option.value === value)?.optionName || getContent('EMPTY');
        }

        // Default to 'Other'
        return nothingSelectedText;
    }

    return (
        <div className={styles.dropdown}>
            <div className={styles.textInput}>
                <input ref={ref}
                       id={id}
                       className={`${textInputStyles} ${value ? '' : styles.nothingSelected}`}
                       maxLength={20}
                       value={currentSelectedValue()}
                       autoComplete='off'
                       onChange={(event) => {
                                setFilterText(event.target.value);
                                setValue(optionsList[0].value);
                           }}
                       onClick={() => setOpen(prev => !prev)}
                />
            </div>
            <div className={`${styles.arrow} ${open ? styles.open : ''}`} />
            {
                open && (
                    <div className={`${styles.options} low-shadow`}>
                        {
                            filter(optionsList).map(option => (
                                <div key={option.value}
                                     className={`${styles.option} ${value === option.value ? styles.selected : ''}`}
                                     onClick={() => {
                                        setValue(option.value);
                                         setFilterText('');
                                         setOpen(false);
                                     }}
                                >
                                    <div className={styles.iconContainer} style={{ backgroundColor: option.iconBackgroundColor }}>
                                        {option.icon}
                                    </div>
                                    {option.optionName}
                                </div>
                            ))
                        }
                        <div className={styles.option} onClick={() => setValue('')}>
                            <div className={styles.clearLabel}>
                                {getContent('CLEAR_SELECTION')}
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
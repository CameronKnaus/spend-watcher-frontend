import React from 'react';
import styles from './FilterableSelect.module.css';
import useContent from 'CustomHooks/useContent';

// When tracking this field, the containing parent component should have a state like const [value, setValue] = React.useState();
// Then you can pass the setValue to the setValue prop and value to the value prop to ensure the parent component remains up to date
// optionsList should contain an array of objects of type
/*
{
    value: The value that will be passed to on change.  This is not seen by the user
    icon: The icon to be used next to the option
    iconBackgroundColor: string for the icon background color
    optionName: The text shown to the user for the given option
}
*/
export default function FilterableSelect({ id = 'filterable-select-input', textInputStyles, value, setValue, optionsList, nothingSelectedText }) {
    const [open, setOpen] = React.useState(false);
    const [filterText, setFilterText] = React.useState('');
    const ref = React.useRef(null);
    const getContent = useContent('GENERAL');


    React.useEffect(() => {
        document.addEventListener('click', toggleOpen);

        return () => document.removeEventListener('click', toggleOpen);
    }, []);

    function toggleOpen(event) {
        setOpen(event && event.target === ref.current);
    }

    function filter(options) {
        const target = filterText.toLowerCase();

        return options.filter(option => {
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
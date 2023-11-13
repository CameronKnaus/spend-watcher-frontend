import styles from './CategoryInput.module.css';
import CategoryIcon from 'Components/UIElements/VisualOnlyElements/CategoryIcon/CategoryIcon';
import useContent from 'CustomHooks/useContent';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { AccountCategoryType, SpendingCategoryType } from 'Constants/categories';
import clsx from 'clsx';

// TODO: Refactor all of this code.  To aid with converting to typescript I split one component into two with a lot of copy-paste
type AccountCategoryInputPropTypes = {
    id?: string,
    textInputStyles: string,
    value: AccountCategoryType,
    onChange: Dispatch<SetStateAction<AccountCategoryType>>,
}

// This is a controlled-only component.  State must be managed by the parent
export function AccountCategoryInput({ id = 'category-input', textInputStyles, value, onChange }: AccountCategoryInputPropTypes) {
    const [open, setOpen] = useState(false);
    const [filterText, setFilterText] = useState('');
    const ref = useRef(null);
    const getContent = useContent('GENERAL');
    const getCategoryContent = useContent('ACCOUNT_CATEGORIES');


    useEffect(() => {
        document.addEventListener('click', toggleOpen);

        return () => document.removeEventListener('click', toggleOpen);
    }, []);

    function toggleOpen(event: MouseEvent) {
        setOpen(event && event.target === ref.current);
    }

    function filter(categories: Array<AccountCategoryType>) {
        const target = filterText.toLowerCase();

        return categories.filter(category => {
            const categoryName = getCategoryContent(category).toLowerCase();
            return categoryName.indexOf(target) > -1;
        });
    }

    function currentSelectedValue() {
        // If the text input is still in focus only show filter text
        if(document.activeElement === ref.current) {
            return filterText;
        }

        if(value) {
            return value;
        }

        return getContent('EMPTY');
    }

    return (
        <div className={styles.dropdown}>
            <div>
                <div className={styles.textInput}>
                    <input ref={ref}
                           id={id}
                           className={textInputStyles}
                           maxLength={20}
                           value={currentSelectedValue()}
                           autoComplete='off'
                           onChange={(event) => {
                                setFilterText(event.target.value);
                                onChange(AccountCategoryType.CHECKING);
                           }}
                           onClick={() => setOpen(prev => !prev)}
                    />
                </div>
                <div className={`${styles.arrow} ${open ? styles.open : ''}`} />
            </div>
            {
                open && (
                    <div className={`${styles.options} low-shadow`}>
                        {
                            // @ts-ignore
                            filter(Object.keys(AccountCategoryType)).map(category => (
                                <div key={category}
                                     className={`${styles.option} ${value === category ? styles.selected : ''}`}
                                     onClick={() => {
                                         onChange(category);
                                         setFilterText('');
                                         setOpen(false);
                                     }}
                                >
                                    <CategoryIcon categoryCode={category}
                                                  containerSize='2rem'
                                                  iconSize='1.2rem'
                                    />
                                    {getCategoryContent(category)}
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
}


type SpendingCategoryInputPropTypes = {
    id?: string,
    defaultNoSelectionToOther?: boolean,
    textInputStyles: string,
    value: SpendingCategoryType | '',
    onChange: Dispatch<SetStateAction<SpendingCategoryType | ''>>,
}

// This is a controlled-only component.  State must be managed by the parent
export function SpendingCategoryInputs({ id = 'category-input', defaultNoSelectionToOther = false, textInputStyles, value, onChange }: SpendingCategoryInputPropTypes) {
    const [open, setOpen] = useState(false);
    const [filterText, setFilterText] = useState('');
    const ref = useRef(null);
    const getContent = useContent('GENERAL');
    const getCategoryContent = useContent('SPENDING_CATEGORIES');


    useEffect(() => {
        document.addEventListener('click', toggleOpen);

        return () => document.removeEventListener('click', toggleOpen);
    }, []);

    function toggleOpen(event: MouseEvent) {
        setOpen(event && event.target === ref.current);
    }

    function filter(categories: Array<SpendingCategoryType>) {
        const target = filterText.toLowerCase();

        return categories.filter(category => {
            const categoryName = getCategoryContent(category).toLowerCase();
            return categoryName.indexOf(target) > -1;
        });
    }

    function currentSelectedValue() {
        // If the text input is still in focus only show filter text
        if(document.activeElement === ref.current) {
            return filterText;
        }

        if(value) {
            return getCategoryContent(value);
        }

        return defaultNoSelectionToOther ? getCategoryContent(SpendingCategoryType.OTHER) : getContent('EMPTY');
    }

    return (
        <div className={styles.dropdown}>
            <div>
                <div className={styles.textInput}>
                    <input ref={ref}
                           id={id}
                           className={clsx([
                                textInputStyles,
                                { [styles.otherText]: document.activeElement !== ref.current && defaultNoSelectionToOther && value === 'OTHER' }
                           ])}
                           maxLength={20}
                           value={currentSelectedValue()}
                           autoComplete='off'
                           onChange={(event) => {
                                setFilterText(event.target.value);
                                onChange(defaultNoSelectionToOther ? SpendingCategoryType.OTHER : '');
                           }}
                           onClick={() => setOpen(prev => !prev)}
                    />
                </div>
                <div className={`${styles.arrow} ${open ? styles.open : ''}`} />
            </div>
            {
                open && (
                    <div className={`${styles.options} low-shadow`}>
                        {
                            // @ts-ignore TODO: Revisit Typescript
                            filter(Object.keys(SpendingCategoryType)).map(category => (
                                <div key={category}
                                     className={`${styles.option} ${value === category ? styles.selected : ''}`}
                                     onClick={() => {
                                         onChange(category);
                                         setFilterText('');
                                         setOpen(false);
                                     }}
                                >
                                    <CategoryIcon categoryCode={category}
                                                  containerSize='2rem'
                                                  iconSize='1.2rem'
                                    />
                                    {getCategoryContent(category)}
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
}
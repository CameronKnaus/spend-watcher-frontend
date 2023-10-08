import styles from './CategoryInput.module.css';
import { ProductCategoryType, useCategoryList } from 'CustomHooks/useCategoryList';
import CategoryIcon from 'Components/UIElements/VisualOnlyElements/CategoryIcon/CategoryIcon';
import useContent from 'CustomHooks/useContent';
import { ManagedTransactionType } from 'Types/TransactionTypes';
import { ManagedAccountType } from 'Types/AccountTypes';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

type CategoryInputPropTypes<T extends ManagedTransactionType | ManagedAccountType> = {
    id?: string,
    textInputStyles: string,
    value: T,
    onChange: Dispatch<SetStateAction<T>>,
    categoryType: ProductCategoryType
}

// This is a controlled-only component.  State must be managed by the parent
export default function CategoryInputs<T extends ManagedTransactionType | ManagedAccountType>({ id = 'category-input', textInputStyles, value, onChange, categoryType }: CategoryInputPropTypes<T>) {
    // TODO: Clean this up so that CategoryInput only tracks category code i.e. 'MATERIAL_ITEMS' / gets category code only from useCategoryList
    const categoryList = useCategoryList<T>(categoryType);
    const [open, setOpen] = useState(false);
    const [filterText, setFilterText] = useState('');
    const ref = useRef(null);
    const getContent = useContent('GENERAL');


    useEffect(() => {
        document.addEventListener('click', toggleOpen);

        return () => document.removeEventListener('click', toggleOpen);
    }, []);

    function toggleOpen(event: MouseEvent) {
        setOpen(event && event.target === ref.current);
    }

    function filter(categories: Array<ManagedTransactionType | ManagedAccountType>) {
        const target = filterText.toLowerCase();

        return categories.filter(category => {
            const categoryName = category.name.toLowerCase();
            return categoryName.indexOf(target) > -1;
        });
    }

    function currentSelectedValue() {
        // If the text input is still in focus only show filter text
        if(document.activeElement === ref.current) {
            return filterText;
        }

        if(value) {
            return value.name || getContent('EMPTY');
        }

        // Default to 'Other'
        return categoryList[0]?.name || getContent('EMPTY');
    }

    return (
        <div className={styles.dropdown}>
            <div>
                <div className={styles.textInput}>
                    <input ref={ref}
                           id={id}
                           className={`${textInputStyles} ${value && value.code === 'OTHER' ? styles.otherText : ''}`}
                           maxLength={20}
                           value={currentSelectedValue()}
                           autoComplete='off'
                           onChange={(event) => {
                                setFilterText(event.target.value);
                                onChange(categoryList[0]);
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
                            filter(categoryList).map(category => (
                                <div key={category.code}
                                     className={`${styles.option} ${value === category ? styles.selected : ''}`}
                                     onClick={() => {
                                         onChange(category as T);
                                         setFilterText('');
                                         setOpen(false);
                                     }}
                                >
                                    <CategoryIcon categoryCode={category.code}
                                                  containerSize='2rem'
                                                  iconSize='1.2rem'
                                    />
                                    {category.name}
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
}
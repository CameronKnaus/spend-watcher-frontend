import styles from './CategoryInput.module.css';
import { ProductCategoryType, useCategoryList } from 'CustomHooks/useCategoryList';
import CategoryIcon from 'Components/UIElements/VisualOnlyElements/CategoryIcon/CategoryIcon';
import useContent from 'CustomHooks/useContent';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { AnyCategoryCode } from 'Constants/categories';

type categoryContentType = 'ACCOUNT_CATEGORIES' | 'SPENDING_CATEGORIES'; // TODO: Clean this up even further

type CategoryInputPropTypes<T extends AnyCategoryCode> = {
    id?: string,
    textInputStyles: string,
    value: T,
    onChange: Dispatch<SetStateAction<T>>,
    categoryType: ProductCategoryType,
    categoryContentType: categoryContentType
}

// This is a controlled-only component.  State must be managed by the parent
export default function CategoryInputs<T extends AnyCategoryCode>({ id = 'category-input', textInputStyles, value, onChange, categoryType, categoryContentType }: CategoryInputPropTypes<T>) {
    const categoryList = useCategoryList<T>(categoryType);
    const [open, setOpen] = useState(false);
    const [filterText, setFilterText] = useState('');
    const ref = useRef(null);
    const getContent = useContent('GENERAL');
    const getCategoryContent = useContent(categoryContentType);


    useEffect(() => {
        document.addEventListener('click', toggleOpen);

        return () => document.removeEventListener('click', toggleOpen);
    }, []);

    function toggleOpen(event: MouseEvent) {
        setOpen(event && event.target === ref.current);
    }

    function filter(categories: Array<T>) {
        const target = filterText.toLowerCase();

        return categories.filter(category => {
            // @ts-ignore // TODO: Correct this
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
            return value || getContent('EMPTY');
        }

        // Default to 'Other' TODO: Revisit typescript conversion
        // @ts-ignore
        return getCategoryContent(categoryList[0]) || getContent('EMPTY');
    }

    return (
        <div className={styles.dropdown}>
            <div>
                <div className={styles.textInput}>
                    <input ref={ref}
                           id={id}
                           className={`${textInputStyles} ${value && value === 'OTHER' ? styles.otherText : ''}`}
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
                            // @ts-ignore TODO: Revisit Typescript
                            filter(categoryList).map(category => (
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
                                    {/* @ts-ignore TODO: Revisit typescript conversion */}
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
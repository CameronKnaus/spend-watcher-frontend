import React from 'react';
import styles from '../../Styles/Components/FormElements/CategoryInput.module.css';
import { useCategoryList } from '../../CustomHooks/useCategoryList';
import CategoryIcon from '../UIElements/CategoryIcon';

// When tracking this field, the containing parent component should have a state like const [value, setValue] = React.useState();
// Then you can pass the setValue to the onChange prop and value to the value prop to ensure the parent component remains up to date
export default function CategoryInput({ id = 'category-input', textInputStyles, value, onChange }) {
    const categoryList = useCategoryList();
    const [open, setOpen] = React.useState(false);
    const [filterText, setFilterText] = React.useState('');
    const ref = React.useRef(null);


    React.useEffect(() => {
        document.addEventListener('click', toggleOpen);

        return () => document.removeEventListener('click', toggleOpen);
    }, []);

    function toggleOpen(event) {
        setOpen(event && event.target === ref.current);
    }

    function filter(categories) {
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
            return value.name;
        }

        // Default to 'Other'
        return categoryList[0]?.name || '';
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
                                         onChange(category);
                                         setFilterText('');
                                         setOpen(false);
                                     }}
                                >
                                    <CategoryIcon categoryCode={category.code}
                                                  containerSize='2rem'
                                                  iconSize='1.2rem'
                                    />
                                    <div className={styles.optionLabel}>
                                        {category.name}
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
}
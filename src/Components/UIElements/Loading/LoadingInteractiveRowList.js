import InteractiveDataRow from 'Components/UIElements/InteractiveDataRow';

export default function LoadingInteractiveRowList({ id, rowCount, rowSpacing }) {
    return new Array(rowCount).fill('').map((_, index) => (
        <div key={`${id}-${index}`} // eslint-disable-line react/no-array-index-key
             style={{ paddingBottom: rowSpacing }}
        >
            <InteractiveDataRow isLoading />
        </div>
    )
    );
}
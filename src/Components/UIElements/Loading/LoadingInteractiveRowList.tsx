import InteractiveDataRow from 'Components/UIElements/DataVisualization/InteractiveDataRow/InteractiveDataRow';
import { SizeValue } from 'Types/StyleTypes';

type LoadingInteractiveRowListPropTypes = {
    id: string,
    rowCount: number,
    rowSpacing: SizeValue
}
export default function LoadingInteractiveRowList({ id, rowCount, rowSpacing }: LoadingInteractiveRowListPropTypes) {
    return new Array(rowCount).fill('').map((_, index) => (
        <div key={`${id}-${index}`} // eslint-disable-line react/no-array-index-key
             style={{ paddingBottom: rowSpacing }}
        >
            <InteractiveDataRow isLoading />
        </div>
    )
    );
}
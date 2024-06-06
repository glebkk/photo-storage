export type GroupingType = 'year' | 'month' | 'day';

interface GroupingSelectorProps {
    groupingType: GroupingType;
    onGroupingTypeChange: (type: GroupingType) => void;
}

export const GroupingSelector: React.FC<GroupingSelectorProps> = ({ groupingType, onGroupingTypeChange }) => {
    return (
        <div>
            <button
                onClick={() => onGroupingTypeChange('year')}
                className={groupingType === 'year' ? '' : 'bg-transparent'}
            >
                Годы
            </button>
            <button
                onClick={() => onGroupingTypeChange('month')}
                className={groupingType === 'month' ? '' : 'bg-transparent'}
            >
                Месяцы
            </button>
            <button
                onClick={() => onGroupingTypeChange('day')}
                className={groupingType === 'day' ? '' : 'bg-transparent'}
            >
                Дни
            </button>
        </div>
    );
};
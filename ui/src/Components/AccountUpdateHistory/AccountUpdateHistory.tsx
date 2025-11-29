import BottomSheet from 'Components/BottomSheet/BottomSheet';
import CustomButton from 'Components/CustomButton/CustomButton';
import { format, parse } from 'date-fns';
import useAccountHistory from 'Hooks/useAccountHistory/useAccountHistory';
import useContent from 'Hooks/useContent';
import { monthYearDbDateFormat } from 'Types/dateTypes';
import type { MonthYearDbDate } from 'Types/dateTypes';
import type { Account } from 'Types/Services/accounts.model';
import AddAccountUpdateRow from './AddAccountUpdateRow/AddAccountUpdateRow';
import EditAccountUpdateRow from './EditAccountUpdateRow/EditAccountUpdateRow';

const formatDate = (date: string) => format(parse(date, monthYearDbDateFormat, new Date()), 'MMMM yyyy');

interface AccountUpdateHistoryPropTypes {
    accountId: Account['id'];
    onBack: () => void;
}

export default function AccountUpdateHistory({ accountId, onBack }: AccountUpdateHistoryPropTypes) {
    const getContent = useContent('accounts');
    const { data: accountHistory, isLoading } = useAccountHistory(accountId);

    if (isLoading || !accountHistory) {
        // TODO:
        return <h2>Loading...</h2>;
    }

    const { updateHistory } = accountHistory;
    const oldestAccountUpdateDate =
        updateHistory[updateHistory.length - 1]?.date ?? format(new Date(), monthYearDbDateFormat);
    // Starting with the current date, iterate backwards until we reach the oldest account update date
    const currentDate = new Date();
    const applicableMonths: MonthYearDbDate[] = [];
    let lastUpdateDateReached = false;
    while (!lastUpdateDateReached) {
        const formattedCurrentDate = format(currentDate, monthYearDbDateFormat);
        applicableMonths.push(formattedCurrentDate);

        if (formattedCurrentDate === oldestAccountUpdateDate) {
            lastUpdateDateReached = true;
        }

        // Update current date to the previous month for next iteration
        currentDate.setMonth(currentDate.getMonth() - 1);
    }

    return (
        <>
            {applicableMonths.map((date) => {
                const accountUpdate = updateHistory.find((update) => update.date === date);
                const formattedDate = formatDate(date);

                if (accountUpdate) {
                    // Month already has update logged
                    return (
                        <EditAccountUpdateRow
                            key={formattedDate}
                            accountId={accountId}
                            updateId={accountUpdate.updateId}
                            dateLabel={formattedDate}
                            currentAmount={accountUpdate.amount}
                        />
                    );
                }

                // Month does not have an update logged
                return <AddAccountUpdateRow key={formattedDate} accountId={accountId} date={date} />;
            })}
            {/* Add button for the month prior to the oldest month logged */}
            <AddAccountUpdateRow
                key={currentDate.toISOString()}
                accountId={accountId}
                date={format(currentDate, 'yyyy-MM')}
            />
            <BottomSheet>
                <CustomButton variant="secondary" onClick={onBack} layout="full-width">
                    {getContent('backButton')}
                </CustomButton>
            </BottomSheet>
        </>
    );
}

import { MoneyAccount } from 'Types/AccountTypes';

interface RawMoneyAccountData {
    totalEquity: number,
    accountsList: Array<MoneyAccount>
}

// Currently not formatting data but can be changed in the future
export default function spendingTransform({ data }: { data: RawMoneyAccountData }): RawMoneyAccountData {
    return data;
}
import { render, screen } from '@testing-library/react';
import Currency from './Currency';

describe('Currency Component', () => {
    describe('when isGainLoss prop is true', () => {
        it('should render positives with gain color', () => {
            render(<Currency value={1234.56} isGainLoss={true} />);
            const currencyNode = screen.getByText('+$1,234.56');
            expect(currencyNode).toHaveStyle({ color: 'var(--token-color-semantic-gain)' });
        });

        it('should render negatives with loss color', () => {
            render(<Currency value={-1234.56} isGainLoss={true} />);
            const currencyNode = screen.getByText('-$1,234.56');
            expect(currencyNode).toHaveStyle({ color: 'var(--token-color-semantic-loss)' });
        });

        it('should render zero with standard color', () => {
            render(<Currency value={0} isGainLoss={true} />);
            const currencyNode = screen.getByText('$0.00');
            expect(currencyNode).toHaveStyle({ color: 'var(--token-color-text-standard)' });
        });
    });

    it('should render with a positive value in black', () => {
        render(<Currency value={1234.56} />);
        const currencyNode = screen.getByText('$1,234.56');
        expect(currencyNode).toHaveStyle({ color: 'var(--token-color-text-standard)' });
    });

    it('should render with a negative value in black', () => {
        render(<Currency value={-1234.56} />);
        const currencyNode = screen.getByText('-$1,234.56');
        expect(currencyNode).toHaveStyle({ color: 'var(--token-color-text-standard)' });
    });

    it('should render with zero value', () => {
        render(<Currency value={0} />);
        const currencyNode = screen.getByText('$0.00');
        expect(currencyNode).toHaveStyle({ color: 'var(--token-color-text-standard)' });
    });

    it('should render with value undefined and default value provided', () => {
        render(<Currency defaultValue="N/A" />);
        const currencyNode = screen.getByText('N/A');
        expect(currencyNode).toBeInTheDocument();
        expect(currencyNode).toHaveStyle({ color: 'var(--token-color-text-standard)' });
    });
});

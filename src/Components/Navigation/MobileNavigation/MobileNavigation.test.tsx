import { render, screen } from '@testing-library/react';
import { PAGE_ROUTES } from 'Components/PageRoutes/PageRoutes';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import MobileNavigation from './MobileNavigation';

// Mock useLocation from react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn(),
}));

describe('MobileNavigation', () => {
    const mockedUseLocation = useLocation as jest.Mock;

    beforeEach(() => {
        mockedUseLocation.mockReturnValue({ pathname: '/' });
    });

    test('renders all navigation items', () => {
        render(
            <Router>
                <MobileNavigation />
            </Router>,
        );

        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Transactions')).toBeInTheDocument();
        expect(screen.getByText('Trends')).toBeInTheDocument();
        expect(screen.getByText('Recurring')).toBeInTheDocument();
        expect(screen.getByText('Trips')).toBeInTheDocument();
    });

    test('applies active styles to the current route', () => {
        mockedUseLocation.mockReturnValue({ pathname: PAGE_ROUTES.dashboard });

        render(
            <Router>
                <MobileNavigation />
            </Router>,
        );

        const dashboardIcon = screen.getByTestId('Dashboard-icon');
        expect(dashboardIcon).toHaveStyle({
            color: 'var(--token-color-background-primary)',
        });

        const iconSelection = screen.getByTestId('Dashboard-icon-selection');
        expect(iconSelection).toHaveStyle({
            width: '100%',
            height: '100%',
        });
    });

    test('applies inactive styles to non-current routes', () => {
        mockedUseLocation.mockReturnValue({ pathname: PAGE_ROUTES.transactions });

        render(
            <Router>
                <MobileNavigation />
            </Router>,
        );

        const dashboardIcon = screen.getByTestId('Dashboard-icon');
        expect(dashboardIcon).toHaveStyle({
            color: 'var(--token-navigation-color)',
        });
    });
});

import { render, screen } from '@testing-library/react-native';
import Header from '../Header';

describe('<Header />', () => {
    it('renders correctly', () => {
        render(<Header />);
        const headerComponent = screen.getByTestId("header")
        expect(headerComponent).toBeVisible();
        expect(screen.toJSON()).toMatchSnapshot();
    });

    it('renders correctly with icons', () => {
        render(<Header />);
        const icons = [
            screen.getByTestId('icon-account'),
            screen.getByTestId('icon-diamond-stone'),
            screen.getByTestId('icon-menu')
        ];
        icons.forEach(icon => expect(icon).toBeTruthy());
        expect(screen.toJSON()).toMatchSnapshot();
    });
});

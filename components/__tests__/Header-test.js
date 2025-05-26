import { render, screen } from '@testing-library/react-native';
import Header from '../Header';
import { SafeAreaProvider } from "react-native-safe-area-context";

const mockUseColorScheme = jest.fn(() => 'light');
const mockUseWindowDimensions = jest.fn(() => ({
    width: 320,
    height: 640,
    scale: 1,
    fontScale: 1
}));

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
    default: mockUseColorScheme
}));

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
    default: mockUseWindowDimensions
}));

jest.mock('react-native-safe-area-context', () => {
    const actual = jest.requireActual('react-native-safe-area-context');
    return {
        ...actual,
        useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
        SafeAreaProvider: (props) => props.children,
    };
});

beforeEach(() => {
    mockUseColorScheme.mockReturnValue('light');
    mockUseWindowDimensions.mockReturnValue({
        width: 320,
        height: 640,
        scale: 1,
        fontScale: 1
    });
});

describe('<Header />', () => {
    it('renders correctly', () => {
        render(<Header />);
        const headerComponent = screen.getByTestId("header")
        expect(headerComponent).toBeTruthy();
        expect(screen.toJSON()).toMatchSnapshot();
    });

    it('renders corretamente os botões principais', () => {
        render(<Header />);
        const headerComponent = screen.getByTestId("header");
        expect(headerComponent).toBeTruthy();
        expect(screen.getByTestId('account-button')).toBeTruthy();
        expect(screen.getByTestId('menu-button')).toBeTruthy();
        expect(screen.getByTestId('header')).toBeTruthy();
        expect(screen.toJSON()).toMatchSnapshot();
    });
});

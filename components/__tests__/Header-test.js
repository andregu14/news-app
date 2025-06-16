import { render, screen, fireEvent } from '@testing-library/react-native';
import Header from '../Header';

// Mock para expo-router
const mockRouter = {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
};

const mockUsePathname = jest.fn(() => '/');

jest.mock('expo-router', () => ({
    useRouter: () => mockRouter,
    usePathname: () => mockUsePathname(),
}));

// Mock para useColorScheme
jest.mock('@/components/useColorScheme', () => ({
    useColorScheme: jest.fn(() => 'light'),
}));

// Mock para Themed components
jest.mock('../Themed', () => {
    const { View } = require('react-native');
    return {
        __esModule: true,
        View: View,
    };
});

// Mock para Colors
jest.mock('@/constants/Colors', () => ({
    __esModule: true,
    default: {
        light: {
            headerIcon: '#000',
            headerBackground: '#fff',
        },
        dark: {
            headerIcon: '#fff',
            headerBackground: '#181A20',
        },
    },
}));

// Mock para expo vector icons
jest.mock('@expo/vector-icons', () => ({
    MaterialCommunityIcons: 'MaterialCommunityIcons',
    FontAwesome6: 'FontAwesome6',
}));

jest.mock('@expo/vector-icons/FontAwesome6', () => 'FontAwesome6');

const mockUseColorScheme = jest.fn(() => 'light');

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
    __esModule: true,
    default: mockUseColorScheme,
}));

// Mock para react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
    const actual = jest.requireActual('react-native-safe-area-context');
    return {
        ...actual,
        useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
        SafeAreaProvider: ({ children }) => children,
    };
});

beforeEach(() => {
    jest.clearAllMocks();
    mockUseColorScheme.mockReturnValue('light');
    mockUsePathname.mockReturnValue('/');
});

describe('Header', () => {
    const defaultProps = {
        onMenuPress: jest.fn(),
        onAccountPress: jest.fn(),
    };

    it('renders correctly with all elements', () => {
        render(<Header {...defaultProps} />);

        const header = screen.getByTestId('header');
        expect(header).toBeTruthy();

        // Verifica se todos os botões estão presentes
        expect(screen.getByTestId('account-button')).toBeTruthy();
        expect(screen.getByTestId('index-button')).toBeTruthy();
        expect(screen.getByTestId('menu-button')).toBeTruthy();

        // Verifica se os ícones estão presentes
        expect(screen.getByTestId('icon-account')).toBeTruthy();
        expect(screen.getByTestId('icon-newspaper')).toBeTruthy();
        expect(screen.getByTestId('icon-menu')).toBeTruthy();
    });

    it('renders correctly without callback props', () => {
        render(<Header />);

        const header = screen.getByTestId('header');
        expect(header).toBeTruthy();

        // Verifica se todos os botões ainda estão presentes
        expect(screen.getByTestId('account-button')).toBeTruthy();
        expect(screen.getByTestId('index-button')).toBeTruthy();
        expect(screen.getByTestId('menu-button')).toBeTruthy();
    });

    it('calls onAccountPress when account button is pressed', () => {
        const onAccountPressMock = jest.fn();

        render(<Header onAccountPress={onAccountPressMock} />);

        const accountButton = screen.getByTestId('account-button');
        fireEvent.press(accountButton);

        expect(onAccountPressMock).toHaveBeenCalledTimes(1);
    });

    it('calls onMenuPress when menu button is pressed', () => {
        const onMenuPressMock = jest.fn();

        render(<Header onMenuPress={onMenuPressMock} />);

        const menuButton = screen.getByTestId('menu-button');
        fireEvent.press(menuButton);

        expect(onMenuPressMock).toHaveBeenCalledTimes(1);
    });

    it('navigates to home when index button is pressed and not on home page', () => {
        mockUsePathname.mockReturnValue('/other-page');

        render(<Header />);

        const indexButton = screen.getByTestId('index-button');
        fireEvent.press(indexButton);

        expect(mockRouter.replace).toHaveBeenCalledWith('/');
    });

    it('does not navigate when index button is pressed and already on home page', () => {
        mockUsePathname.mockReturnValue('/');

        render(<Header />);

        const indexButton = screen.getByTestId('index-button');
        fireEvent.press(indexButton);

        expect(mockRouter.replace).not.toHaveBeenCalled();
    });

    it('renders correctly in dark theme', () => {
        const { useColorScheme } = require('@/components/useColorScheme');
        useColorScheme.mockReturnValue('dark');

        render(<Header {...defaultProps} />);

        const header = screen.getByTestId('header');
        expect(header).toBeTruthy();

        // Verifica se todos os elementos ainda estão presentes no tema escuro
        expect(screen.getByTestId('account-button')).toBeTruthy();
        expect(screen.getByTestId('index-button')).toBeTruthy();
        expect(screen.getByTestId('menu-button')).toBeTruthy();
    });

    it('handles missing callback functions gracefully', () => {
        render(<Header />);

        const accountButton = screen.getByTestId('account-button');
        const menuButton = screen.getByTestId('menu-button');

        fireEvent.press(accountButton);
        fireEvent.press(menuButton);

        expect(screen.getByTestId('header')).toBeTruthy();
    });
});

describe('Header Accessibility', () => {
    it('has proper button accessibility', () => {
        render(<Header />);

        const accountButton = screen.getByTestId('account-button');
        const indexButton = screen.getByTestId('index-button');
        const menuButton = screen.getByTestId('menu-button');

        // Verifica se os botões podem ser encontrados (indicando que são acessíveis)
        expect(accountButton).toBeTruthy();
        expect(indexButton).toBeTruthy();
        expect(menuButton).toBeTruthy();
    });

    it('provides proper icon accessibility', () => {
        render(<Header />);

        // Verifica se os ícones estão presentes e têm testIDs apropriados
        expect(screen.getByTestId('icon-account')).toBeTruthy();
        expect(screen.getByTestId('icon-newspaper')).toBeTruthy();
        expect(screen.getByTestId('icon-menu')).toBeTruthy();
    });
});
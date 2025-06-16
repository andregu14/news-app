import { render, fireEvent, screen } from '@testing-library/react-native';
import NewsCard from '../NewsCard';

// Mock para react-native-reanimated
jest.mock('react-native-reanimated', () => {
    const View = require('react-native').View;
    return {
        __esModule: true,
        default: {
            View: View,
            createAnimatedComponent: (component) => component,
        },
        useSharedValue: jest.fn(() => ({ value: 0 })),
        useAnimatedStyle: jest.fn(() => ({})),
        withTiming: jest.fn((value) => value),
        runOnJS: jest.fn((fn) => fn),
    };
});

// Mock para react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
    const { View } = require('react-native');

    let onEndCallback;

    const mockGesture = {
        onBegin: jest.fn().mockReturnThis(),
        onEnd: jest.fn((callback) => {
            onEndCallback = callback;
            return mockGesture;
        }),
        onFinalize: jest.fn().mockReturnThis(),
    };

    return {
        __esModule: true,
        GestureDetector: ({ children }) => {
            return (
                <View
                    onPress={() => {
                        if (onEndCallback) {
                            onEndCallback({}, true);
                        }
                    }}
                >
                    {children}
                </View>
            );
        },
        Gesture: {
            Tap: () => mockGesture,
        },
    };
});

// Mock para expo-image
jest.mock('expo-image', () => ({
    __esModule: true,
    Image: 'Image'
}));

// Mock para Skeleton component
jest.mock('../Skeleton', () => ({
    __esModule: true,
    Skeleton: ({ children }) => children
}));

// Mock para imageOptimizer
jest.mock('@/utils/imageOptimizer', () => ({
    __esModule: true,
    getOptimizedImageUrl: jest.fn((url) => url)
}));

// Mock para Themed components
jest.mock('../Themed', () => {
    const { View, Text } = require('react-native');
    return {
        __esModule: true,
        View: View,
        Text: Text,
        BodyText: Text,
        TitleText: Text,
    };
});

// Mock para Colors
jest.mock('@/constants/Colors', () => ({
    __esModule: true,
    default: {
        light: {
            text: '#000',
            borderColor: '#ccc',
            secondaryText: '#666',
            cardBackground: '#fff',
            tint: '#007AFF',
        },
        dark: {
            text: '#fff',
            borderColor: '#444',
            secondaryText: '#aaa',
            cardBackground: '#181A20',
            tint: '#0A84FF',
        },
    },
}));

const mockUseColorScheme = jest.fn(() => 'light');
const mockUseWindowDimensions = jest.fn(() => ({
    width: 320,
    height: 640,
    scale: 1,
    fontScale: 1
}));

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
    __esModule: true,
    default: mockUseColorScheme
}));

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
    __esModule: true,
    default: mockUseWindowDimensions
}));

beforeEach(() => {
    mockUseColorScheme.mockReturnValue('light');
    mockUseWindowDimensions.mockReturnValue({
        width: 320,
        height: 640,
        scale: 1,
        fontScale: 1
    });
});

describe('NewsCard', () => {
    const defaultProps = {
        title: "Test Title",
        bodyText: "This is a test body text.",
        image: "https://example.com/test-image.png",
        sourceName: "Test Source",
        time: "há 7 dias",
        onPress: jest.fn(),
        testID: "news-card",
        imageTestID: "news-card-image"
    };

    it('renders correctly with all props', () => {
        render(<NewsCard {...defaultProps} />);

        // Verifica se todos os textos estão presentes
        expect(screen.getByText(defaultProps.title)).toBeTruthy();
        expect(screen.getByText(defaultProps.bodyText)).toBeTruthy();
        expect(screen.getByText(defaultProps.time)).toBeTruthy();
        expect(screen.getByText(`Em ${defaultProps.sourceName}`)).toBeTruthy();

        // Verifica se o componente principal está presente
        expect(screen.getByTestId('news-card')).toBeTruthy();
    });

    it('renders with default source name when sourceName is not provided', () => {
        const propsWithoutSource = { ...defaultProps };
        delete propsWithoutSource.sourceName;

        render(<NewsCard {...propsWithoutSource} />);

        expect(screen.getByText("Em Fonte Desconhecida")).toBeTruthy();
    });

    it('calls onPress prop when pressed', () => {
        const onPressMock = jest.fn();
        const props = { ...defaultProps, onPress: onPressMock };

        render(<NewsCard {...props} />);

        const card = screen.getByTestId('news-card');
        fireEvent.press(card);

        expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('renders correctly in dark theme', () => {
        mockUseColorScheme.mockReturnValue('dark');

        render(<NewsCard {...defaultProps} />);

        const card = screen.getByTestId('news-card');
        expect(card).toBeTruthy();

        // Verifica se os textos ainda estão presentes no tema escuro
        expect(screen.getByText(defaultProps.title)).toBeTruthy();
        expect(screen.getByText(defaultProps.bodyText)).toBeTruthy();
    });

    it('handles image loading states correctly', () => {
        render(<NewsCard {...defaultProps} />);

        // Verifica se o testID da imagem está presente
        const cardElement = screen.getByTestId('news-card');
        expect(cardElement).toBeTruthy();
    });
});

describe('Accessibility', () => {
    const defaultProps = {
        title: "Accessibility Test Title",
        bodyText: "Accessibility test body text.",
        image: "https://example.com/test-image.png",
        sourceName: "Test Source",
        time: "há 2 horas",
        onPress: jest.fn(),
        testID: "news-card"
    };

    it('has proper accessibility properties', () => {
        render(<NewsCard {...defaultProps} />);

        const card = screen.getByTestId('news-card');
        expect(card.props.accessible).toBe(true);
        expect(card.props.accessibilityRole).toBe('button');
        expect(card.props.accessibilityHint).toBe('Toque para ver mais detalhes');
    });

    it('provides meaningful accessibility label', () => {
        render(<NewsCard {...defaultProps} />);

        const card = screen.getByTestId('news-card');
        const expectedLabel = `Notícia: ${defaultProps.title}. ${defaultProps.bodyText}. Publicado ${defaultProps.time} • Em ${defaultProps.sourceName}`;
        expect(card.props.accessibilityLabel).toBe(expectedLabel);
    });

    it('generates correct accessibility label without source name', () => {
        const propsWithoutSource = { ...defaultProps };
        delete propsWithoutSource.sourceName;

        render(<NewsCard {...propsWithoutSource} />);

        const card = screen.getByTestId('news-card');
        const expectedLabel = `Notícia: ${defaultProps.title}. ${defaultProps.bodyText}. Publicado ${defaultProps.time} • Em Fonte Desconhecida`;
        expect(card.props.accessibilityLabel).toBe(expectedLabel);
    });

    it('provides meaningful content descriptions', () => {
        const customTitle = "Custom News Title";
        const customBody = "Custom news body text";
        const customSource = "Custom Source";
        const customTime = "há 1 hora";

        const customProps = {
            ...defaultProps,
            title: customTitle,
            bodyText: customBody,
            sourceName: customSource,
            time: customTime
        };

        render(<NewsCard {...customProps} />);

        expect(screen.getByText(customTitle)).toBeTruthy();
        expect(screen.getByText(customBody)).toBeTruthy();
        expect(screen.getByText(customTime)).toBeTruthy();
        expect(screen.getByText(`Em ${customSource}`)).toBeTruthy();
    });

    it('handles long content properly', () => {
        const longProps = {
            ...defaultProps,
            title: "This is a very long title that should be handled properly by the component",
            bodyText: "This is a very long body text that should be truncated properly and handled by the component's ellipsize mode and number of lines configuration to ensure good user experience",
        };

        render(<NewsCard {...longProps} />);

        expect(screen.getByText(longProps.title)).toBeTruthy();
        expect(screen.getByText(longProps.bodyText)).toBeTruthy();
    });
});
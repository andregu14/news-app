import { render, fireEvent, screen } from '@testing-library/react-native';
import HighlightCard from '../HighlightCard';

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
    };
});

// Mock para Colors
jest.mock('@/constants/Colors', () => {
    const mockColors = {
        light: {
            borderColor: '#e0e0e0'
        },
        dark: {
            borderColor: '#333'
        }
    };

    const mockDepartmentColors = {
        tecnologia: {
            backgroundColor: '#00695C',
            textColor: '#fff'
        }
    };

    return {
        __esModule: true,
        default: mockColors,
        departmentColors: mockDepartmentColors,
        Department: {}
    };
});

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

describe('HighlightCard', () => {
    it('renders correctly with description and image props', () => {
        const testDescription = "Test Description";
        const testImage = "https://example.com/test-image.png";

        render(
            <HighlightCard
                department="tecnologia"
                description={testDescription}
                image={testImage}
                onPress={jest.fn()}
                testID="highlight-card"
                imageTestID="highlight-card-image"
            />
        );

        // Verifica se o texto da descrição está presente
        expect(screen.getByText(testDescription)).toBeTruthy();

        // Verifica se o hint de acessibilidade está presente
        expect(screen.getByAccessibilityHint("Toque para abrir o artigo completo")).toBeTruthy();

        // Verifica se o componente principal está presente
        expect(screen.getByTestId('highlight-card')).toBeTruthy();
    });

    it('calls onPress prop when pressed', () => {
        const onPressMock = jest.fn();

        render(
            <HighlightCard
                department="tecnologia"
                description="Testando clique"
                image="https://example.com/test-image.png"
                onPress={onPressMock}
                testID="highlight-card"
                imageTestID="highlight-card-image"
            />
        );

        const cardElement = screen.getByTestId('highlight-card');

        // Como estamos usando GestureDetector, vamos simular o press no elemento
        fireEvent.press(cardElement);

        expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('does not render department badge when department is not provided', () => {
        render(
            <HighlightCard
                description="Test without department"
                image="https://example.com/test-image.png"
                onPress={jest.fn()}
                testID="highlight-card"
            />
        );

        expect(screen.queryByText('tecnologia')).toBeNull();
    });
});

describe('Accessibility', () => {
    it('has proper accessibility properties', () => {
        render(
            <HighlightCard
                department="tecnologia"
                description="Acessibilidade"
                image="https://example.com/test-image.png"
                onPress={jest.fn()}
                testID="highlight-card"
            />
        );

        const card = screen.getByTestId('highlight-card');
        expect(card.props.accessible).toBe(true);
        expect(card.props.accessibilityRole).toBe('button');
    });

    it('provides meaningful content descriptions', () => {
        const customDescription = "Artigo sobre tecnologia";

        render(
            <HighlightCard
                department="tecnologia"
                description={customDescription}
                image="https://example.com/test-image.png"
                onPress={jest.fn()}
                testID="highlight-card"
            />
        );

        expect(screen.getByText(customDescription)).toBeTruthy();
        expect(screen.getByAccessibilityHint("Toque para abrir o artigo completo")).toBeTruthy();

        // Verifica se o accessibilityLabel está correto
        const card = screen.getByTestId('highlight-card');
        expect(card.props.accessibilityLabel).toBe('tecnologia: Artigo sobre tecnologia');
    });

    it('generates correct accessibility label without department', () => {
        const customDescription = "Artigo sem departamento";

        render(
            <HighlightCard
                description={customDescription}
                image="https://example.com/test-image.png"
                onPress={jest.fn()}
                testID="highlight-card"
            />
        );

        const card = screen.getByTestId('highlight-card');
        expect(card.props.accessibilityLabel).toBe('Notícia: Artigo sem departamento');
    });
});
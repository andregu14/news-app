import { render, fireEvent, screen } from '@testing-library/react-native';
import NewsCard from '../NewsCard';

// Mock do useColorScheme para controlar tema
const mockUseColorScheme = jest.fn(() => 'light');

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
    default: mockUseColorScheme,
}));

// Mock do Colors e departmentColors, se necessário
jest.mock('@/constants/Colors', () => ({
    __esModule: true,
    default: {
        light: {
            text: '#000',
            borderColor: '#ccc',
            subText: '#666',
            cardBackground: '#fff',
            tint: '#007AFF',
        },
        dark: {
            text: '#fff',
            borderColor: '#444',
            subText: '#aaa',
            cardBackground: '#181A20',
            tint: '#0A84FF',
        },
    },
    departmentColors: {}, // Se usar badges, defina aqui
}));

describe('NewsCard', () => {
    beforeEach(() => {
        mockUseColorScheme.mockReturnValue('light');
    });

    it('renders correctly with all props and matches snapshot', () => {
        const testTitle = "Test Title";
        const testBodyText = "This is a test body text.";
        const testDepartment = "Sports";
        const testTime = "há 7 dias";
        const testImage = "https://example.com/test-image.png";

        const component = render(
            <NewsCard
                title={testTitle}
                bodyText={testBodyText}
                department={testDepartment}
                time={testTime}
                image={testImage}
                onPress={() => { }}
                testID="news-card"
                imageTestID="news-card-image"
            />
        );

        // Verifica textos renderizados
        expect(screen.getByText(testTitle)).toBeTruthy();
        expect(screen.getByText(testBodyText)).toBeTruthy();
        expect(
            screen.getByText("Há 7 dias")
        ).toBeTruthy();

        const snapshot = component.toJSON();
        expect(snapshot).toMatchSnapshot();

        const snapshotString = JSON.stringify(snapshot);
        expect(snapshotString).toContain('news-card-image');
        expect(snapshotString).toContain(testImage);
    });

    it('calls onPress prop when pressed', () => {
        const onPressMock = jest.fn();

        render(
            <NewsCard
                title="Title"
                bodyText="Body"
                department="Sports"
                time="há 7 dias"
                image="https://example.com/image.png"
                onPress={onPressMock}
                testID="news-card"
            />
        );

        const card = screen.getByTestId('news-card');
        fireEvent.press(card);

        expect(onPressMock).toHaveBeenCalledTimes(1);
    });
});

describe('Accessibility', () => {
    it('has correct accessibility properties', () => {
        render(
            <NewsCard
                title="Title"
                bodyText="Body"
                department="Sports"
                time="há 7 dias"
                image="https://example.com/image.png"
                onPress={() => { }}
                testID="news-card"
            />
        );

        const card = screen.getByTestId('news-card');
        expect(card.props.accessible).toBe(true);
        expect(card.props.accessibilityRole).toBe('button');
        expect(card.props.accessibilityLabel).toContain('Notícia');
        expect(card.props.accessibilityHint).toBe('Toque para ver mais detalhes');
    });

    it('provides meaningful content descriptions', () => {
        const customTitle = "Custom Title";
        const customBody = "Custom body text";

        render(
            <NewsCard
                title={customTitle}
                bodyText={customBody}
                department="Sports"
                time="há 7 dias"
                image="https://example.com/image.png"
                onPress={() => { }}
            />
        );

        expect(screen.getByText(customTitle)).toBeTruthy();
        expect(screen.getByText(customBody)).toBeTruthy();
        expect(screen.getByText(/há 7 dias/i)).toBeTruthy();
        expect(screen.getByText(/sports/i)).toBeTruthy();
    });
});

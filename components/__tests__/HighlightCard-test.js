import { render, fireEvent, screen, configure } from '@testing-library/react-native';
import HighlightCard from '../HighlightCard';

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
    it('renders correctly with description and image props and matches snapshot', () => {
        const testDescription = "Test Description";
        const testImage = "https://example.com/test-image.png";

        const component = render(
            <HighlightCard
                department="tecnologia"
                description={testDescription}
                image={testImage}
                testID="highlight-card"
                imageTestID="highlight-card-image"
            />
        );

        expect(screen.getByText(testDescription)).toBeTruthy();
        expect(screen.getByAccessibilityHint("Toque para abrir o artigo completo")).toBeTruthy();

        const snapshot = component.toJSON();
        expect(snapshot).toMatchSnapshot();

        const snapshotString = JSON.stringify(snapshot);
        expect(snapshotString).toContain('highlight-card-image');
        expect(snapshotString).toContain(testImage);
    });

    it('calls onPress prop when pressed', () => {
        const onPressMock = jest.fn();

        render(
            <HighlightCard
                department="tecnologia"
                onPress={onPressMock}
                testID="highlight-card"
            />
        );

        const cardElement = screen.getByTestId('highlight-card');
        fireEvent.press(cardElement);

        expect(onPressMock).toHaveBeenCalledTimes(1);
    });
});

describe('Accessibility', () => {
    it('has proper accessibility properties', () => {
        render(
            <HighlightCard
                department="tecnologia"
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
                onPress={jest.fn()}
            />
        );

        expect(screen.getByText(customDescription)).toBeTruthy();
        expect(screen.getByAccessibilityHint("Toque para abrir o artigo completo")).toBeTruthy();
    });
});

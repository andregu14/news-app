import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import HighlightCard from '../HighlightCard';

jest.mock("react-native/Libraries/Utilities/useColorScheme", () => {
    return {
        default: jest.fn(() => "light")
    }
})

jest.mock("react-native/Libraries/Utilities/useWindowDimensions", () => ({
    default: () => ({
        width: 320,
        height: 640,
        scale: 1,
        fontScale: 1
    })
}))

describe('<HighlightCard />', () => {
    it('renders correctly with default props and matches snapshot', () => {
        render(<HighlightCard />);
        expect(screen.toJSON()).toMatchSnapshot();
    });

    it('renders correctly with description and image props and matches snapshot', () => {
        const testDescription = "Test Description";
        const testImage = "https://example.com/test-image.png";
        render(
            <HighlightCard
                description={testDescription}
                image={testImage}
                imageTestID="highlight-card-image"
            />
        );

        expect(screen.getByText(testDescription)).toBeVisible();

        const imageComponent = screen.getByTestId('highlight-card-image');
        expect(imageComponent).toBeVisible();
        expect(imageComponent.props.source[0].uri).toEqual(testImage);

        expect(screen.toJSON()).toMatchSnapshot();
    });

    it('calls onPress prop when pressed', () => {
        const onPressMock = jest.fn();
        render(<HighlightCard onPress={onPressMock} testID="highlight-card" />);

        const cardElement = screen.getByTestId('highlight-card');
        fireEvent.press(cardElement);

        expect(onPressMock).toHaveBeenCalledTimes(1);
    });
});

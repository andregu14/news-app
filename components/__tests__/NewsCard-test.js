import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import NewsCard from '../NewsCard';

jest.mock("react-native/Libraries/Utilities/useColorScheme", () => {
    return {
        default: jest.fn(() => "light")
    }
})

describe("<NewsCard />", () => {
    it("calls onPress prop when pressed", () => {
        const onPressMock = jest.fn();
        render(<NewsCard onPress={onPressMock} testID="news-card"  time="test"/>);

        const cardElement = screen.getByTestId('news-card');
        fireEvent.press(cardElement);

        expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it("renders title, bodyText, department and time correctly", () => {
        const testTitle = "Test Title";
        const testBodyText = "This is a test body text.";
        const testDepartment = "Sports";
        const testTime = "há 7 dias";
        render(
            <NewsCard
                title={testTitle}
                bodyText={testBodyText}
                department={testDepartment}
                time={testTime}
            />
        );

        expect(screen.getByText(testTitle)).toBeVisible();
        expect(screen.getByText(testBodyText)).toBeVisible();
        expect(screen.getByText(`${testTime[0].toUpperCase() + testTime.slice(1)} • Em ${testDepartment}`)).toBeVisible();
        expect(screen.toJSON()).toMatchSnapshot();
    });

    it("renders image correctly", () => {
        const testImage = "https://example.com/test-image.png";
        render(
            <NewsCard
                image={testImage}
                imageTestID="news-card-image"
                time="há 7 dias"
            />
        );

        const imageComponent = screen.getByTestId('news-card-image');
        expect(imageComponent).toBeVisible();
        expect(imageComponent.props.source[0].uri).toEqual(testImage);
        expect(screen.toJSON()).toMatchSnapshot();
    });
})
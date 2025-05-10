import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import AuthorDetails from '../AuthorDetails';

jest.mock("react-native/Libraries/Utilities/useColorScheme", () => {
    return {
        default: jest.fn(() => "light")
    }
})

describe('<AuthorDetails />', () => {
    it('renders correctly with name, date, department props and matches snapshot', () => {
        const testName = "Test Name"
        const testDate = "há 7 dias"
        const testDepartment = "Test Department"
        render(<AuthorDetails name={testName} date={testDate} department={testDepartment} />);
        expect(screen.getByText(testName)).toBeVisible();
        expect(screen.getByText(`${testDate[0].toUpperCase() + testDate.slice(1)} • Em ${testDepartment}`)).toBeVisible();
        expect(screen.toJSON()).toMatchSnapshot();
    });

    it('renders correctly with photo prop and matches snapshot', () => {
        const testImage = "https://example.com/test-image.png"
        render(<AuthorDetails photo={testImage} imageTestId='author-image' name='test' date='test' department='test' />)
        const imageComponent = screen.getByTestId('author-image');
        expect(imageComponent).toBeVisible();
        expect(imageComponent.props.source[0].uri).toEqual(testImage);
        expect(screen.toJSON()).toMatchSnapshot();
    })

    it('renders correctly with placeholder photo and matches snapshot', () => {
        render(<AuthorDetails name='name' date='test' department='test' imageTestId='default-author-image' />)
        const imageComponent = screen.getByTestId('default-author-image')
        expect(imageComponent).toBeVisible();
        expect(imageComponent.props.placeholder[0].testUri).toEqual("../../../assets/images/photo-placeholder.png");
        expect(screen.toJSON()).toMatchSnapshot();
    })

})
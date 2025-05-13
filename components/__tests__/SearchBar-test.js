import { render, screen, fireEvent } from '@testing-library/react-native';
import SearchBar from '../SearchBar';

describe('<SearchBar />', () => {
    it('renders correctly and handles input', () => {
        const onSubmitEditing = jest.fn();
        render(<SearchBar placeholder="Search..." onSubmitEditing={onSubmitEditing} />);
        const input = screen.getByPlaceholderText('Search...');
        expect(input).toBeVisible();
        fireEvent.changeText(input, 'Test Input');
        fireEvent(input, 'submitEditing');
        expect(onSubmitEditing).toHaveBeenCalledWith('Test Input');
        expect(screen.toJSON()).toMatchSnapshot();
    });

    it('handles text submission correctly', () => {
        const onSubmitEditing = jest.fn();
        render(<SearchBar placeholder="Search..." onSubmitEditing={onSubmitEditing} />);
        const input = screen.getByPlaceholderText('Search...');
        fireEvent.changeText(input, 'Test Query');
        fireEvent(input, 'submitEditing');
        expect(onSubmitEditing).toHaveBeenCalledWith('Test Query');
    });

    it('clears input when clear button is pressed', () => {
        render(<SearchBar placeholder="Search..." />);
        const input = screen.getByPlaceholderText('Search...');
        fireEvent.changeText(input, 'Test Query');
        const clearButton = screen.getByLabelText('Limpar pesquisa');
        fireEvent.press(clearButton);
        expect(input.props.value).toBe('');
    });
});

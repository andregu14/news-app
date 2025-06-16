import { render, screen, fireEvent } from '@testing-library/react-native';

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

import searchReducer from '../../store/searchSlice';

import SearchBar from '../SearchBar';

// Mock para expo vector icons
jest.mock('@expo/vector-icons', () => ({
    MaterialCommunityIcons: 'MaterialCommunityIcons',
    FontAwesome: 'FontAwesome',
}));

jest.mock('@expo/vector-icons/FontAwesome', () => 'FontAwesome');

describe('<SearchBar />', () => {

    it('renders correctly and reflects the initial state of Redux', () => {
        // Define um estado inicial específico para este teste
        const preloadedState = {
            search: {
                query: 'Text from Store'
            }
        };

        // Cria um store REAL para este teste usando seu reducer e o estado inicial
        const store = configureStore({
            reducer: {
                search: searchReducer
            },
            preloadedState
        });

        render(
            <SearchBar loading={false} />,
            {
                wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
            }
        );

        const input = screen.getByDisplayValue('Text from Store');
        expect(input).toBeVisible();
    });

    it('handles typing and calls the onSubmitEditing function', () => {
        const onSubmitEditing = jest.fn();

        // Cria um store limpo para este teste
        const store = configureStore({
            reducer: {
                search: searchReducer
            }
        });

        render(
            <SearchBar onSubmitEditing={onSubmitEditing} loading={false} />,
            {
                wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
            }
        );

        const input = screen.getByLabelText('Campo de pesquisa');
        fireEvent.changeText(input, 'new search');
        fireEvent(input, 'submitEditing');

        expect(onSubmitEditing).toHaveBeenCalledWith('new search');

        // Valida que o componente limpou o input após o submit
        expect(input.props.value).toBe('');
    });

    it('clears input when clear button is pressed', () => {
        // Cria um store limpo para o teste
        const store = configureStore({
            reducer: {
                search: searchReducer
            }
        });

        render(
            <SearchBar loading={false} />,
            {
                wrapper: ({ children }) => <Provider store={store}>{children}</Provider>
            }
        );

        const input = screen.getByLabelText('Campo de pesquisa');
        fireEvent.changeText(input, 'text to clear');
        expect(input.props.value).toBe('text to clear'); // Confirma que o texto está lá

        const clearButton = screen.getByLabelText('Limpar pesquisa');
        fireEvent.press(clearButton);

        expect(input.props.value).toBe(''); // Confirma que foi limpo
    });
});
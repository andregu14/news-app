import { render, screen } from '@testing-library/react-native';
import { Text, View } from '../Themed';

describe('<Themed />', () => {
    it('renders ThemedText correctly', () => {
        render(<Text>Test Text</Text>);
        expect(screen.getByText('Test Text')).toBeVisible();
        expect(screen.toJSON()).toMatchSnapshot();
    });

    it('renders ThemedView correctly', () => {
        render(<View><Text>Child Text</Text></View>);
        expect(screen.getByText('Child Text')).toBeVisible();
        expect(screen.toJSON()).toMatchSnapshot();
    });
});

import { render, screen } from '@testing-library/react-native';
import NewsCardSkeleton from '../NewsCardSkeleton';

describe('<NewsCardSkeleton />', () => {
    it('renders correctly', () => {
        render(<NewsCardSkeleton />);
        expect(screen.toJSON()).toMatchSnapshot();
    });
});

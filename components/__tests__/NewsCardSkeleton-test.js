import { render, screen } from '@testing-library/react-native';
import NewsCardSkeleton from '../NewsCardSkeleton';

// Mock para Skeleton component
jest.mock('../Skeleton', () => ({
    __esModule: true,
    Skeleton: ({ children }) => children
}));

describe('<NewsCardSkeleton />', () => {
    it('renders correctly', () => {
        render(<NewsCardSkeleton />);
        expect(screen.toJSON()).toMatchSnapshot();
    });
});

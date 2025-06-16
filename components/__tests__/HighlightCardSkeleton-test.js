import { render, screen } from '@testing-library/react-native';
import HighlightCardSkeleton from '../HighlightCardSkeleton';

// Mock para Skeleton component
jest.mock('../Skeleton', () => ({
    __esModule: true,
    Skeleton: ({ children }) => children
}));

describe('<HighlightCardSkeleton />', () => {
    it('renders correctly', () => {
        render(<HighlightCardSkeleton />);
        expect(screen.toJSON()).toMatchSnapshot();
    });
});

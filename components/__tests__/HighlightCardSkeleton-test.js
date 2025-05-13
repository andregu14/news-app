import { render, screen } from '@testing-library/react-native';
import HighlightCardSkeleton from '../HighlightCardSkeleton';

describe('<HighlightCardSkeleton />', () => {
    it('renders correctly', () => {
        render(<HighlightCardSkeleton />);
        expect(screen.toJSON()).toMatchSnapshot();
    });
});

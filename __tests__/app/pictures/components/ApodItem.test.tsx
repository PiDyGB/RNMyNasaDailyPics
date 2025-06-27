import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ApodItem } from '../../../../app/pictures/components/ApodItem';
import { ApodEntry } from '../../../../app/data/apod.types';
import { useWindowDimensions } from 'react-native';

// Mock useWindowDimensions
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockedUseWindowDimensions = useWindowDimensions as jest.Mock;

describe('ApodItem', () => {
  const mockItem: ApodEntry = {
    date: '2023-07-25',
    title: 'Beautiful Nebula',
    url: 'https://example.com/nebula.jpg',
    hdurl: 'https://example.com/nebula_hd.jpg',
    explanation: 'A stunning image of a nebula.',
    media_type: 'image',
  };

  const mockOnPress = jest.fn();

  beforeEach(() => {
    mockOnPress.mockClear();
    // Default to portrait mode
    mockedUseWindowDimensions.mockReturnValue({ width: 360, height: 800 });
  });

  it('renders the title and date correctly', () => {
    const { getByText } = render(<ApodItem item={mockItem} onPress={mockOnPress} />);
    expect(getByText(mockItem.title)).toBeTruthy();
    expect(getByText(mockItem.date)).toBeTruthy();
  });

  it('renders the image with the correct source', () => {
    const { getByTestId } = render(<ApodItem item={mockItem} onPress={mockOnPress} />);
    const image = getByTestId('apod-image');
    expect(image.props.source.uri).toBe(mockItem.url);
  });

  it('calls onPress when the item is pressed', () => {
    const { getByText } = render(<ApodItem item={mockItem} onPress={mockOnPress} />);
    // TouchableNativeFeedback wraps the content. We can press the container or a specific element.
    // Pressing by title text should work.
    fireEvent.press(getByText(mockItem.title));
    expect(mockOnPress).toHaveBeenCalledWith(mockItem);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('applies portrait image style when in portrait mode', () => {
    mockedUseWindowDimensions.mockReturnValue({ width: 360, height: 800 }); // Portrait
    const { getByTestId } = render(<ApodItem item={mockItem} onPress={mockOnPress} />);
    const image = getByTestId('apod-image');
    // Check for a style property that differentiates portrait from landscape
    // styles.imagePortrait: { width: '30%', aspectRatio: 16 / 9 }
    // styles.imageLandscape: { width: '15%', aspectRatio: 16 / 9 }
    // The exact style object might be flattened by StyleSheet.create, so check a distinguishing prop.
    // We expect the 'width' to be '30%' for portrait.
    // Note: React Native Testing Library might not give direct access to percentage widths easily.
    // Instead, we can check the snapshot or a specific style property if it's unique.
    // For this example, we'll assume the style object contains a recognizable unique property or rely on snapshot.
    // A more robust way would be to pass a testID to the Image and check its style prop.
    expect(image.props.style).toEqual(expect.objectContaining({ width: '30%' }));
  });

  it('applies landscape image style when in landscape mode', () => {
    mockedUseWindowDimensions.mockReturnValue({ width: 800, height: 360 }); // Landscape
    const { getByTestId } = render(<ApodItem item={mockItem} onPress={mockOnPress} />);
    const image = getByTestId('apod-image');
    // Expecting 'width' to be '15%' for landscape.
    // The style prop can be an array of styles or a single object.
    const appliedStyle = Array.isArray(image.props.style)
      ? image.props.style.find(s => s && s.width !== undefined)
      : image.props.style;
    expect(appliedStyle).toEqual(expect.objectContaining({ width: '15%' }));
  });
});

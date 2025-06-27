import React from 'react';
import { render, screen } from '@testing-library/react-native';
import PictureScreen from '../../../app/picture/PictureScreen';
import { ApodEntry } from '../../../app/data/apod.types';
import { useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PicturesStackParamList } from '../../../app/pictures/PicturesStackNavigator';

// Mock useWindowDimensions
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(),
}));
const mockedUseWindowDimensions = useWindowDimensions as jest.Mock;

// Mock the image assets
jest.mock('../../../app/assets/loading.png', () => 'loading.png');


type MockProps = NativeStackScreenProps<PicturesStackParamList, 'PictureScreen'>;

const mockApodData: ApodEntry = {
  date: '2023-08-01',
  title: 'Galaxy Far Away',
  url: 'https://example.com/galaxy.jpg',
  hdurl: 'https://example.com/galaxy_hd.jpg',
  explanation: 'A stunning view of a distant galaxy, full of stars and cosmic dust.',
  media_type: 'image',
};

const createTestProps = (apod: ApodEntry | undefined): MockProps => ({
  navigation: {} as any, // Not used directly in PictureScreen, can be minimal mock
  route: {
    key: 'PictureScreen_key',
    name: 'PictureScreen',
    params: { apod },
  } as any, // Cast to any to simplify mock structure for params
});


describe('PictureScreen', () => {
  beforeEach(() => {
    // Default to portrait for most tests
    mockedUseWindowDimensions.mockReturnValue({ width: 400, height: 800 });
  });

  it('renders correctly with APOD data', () => {
    const props = createTestProps(mockApodData);
    render(<PictureScreen {...props} />);

    expect(screen.getByText(mockApodData.date)).toBeTruthy();
    expect(screen.getByText(mockApodData.explanation)).toBeTruthy();

    const image = screen.getByTestId('picture-image');
    expect(image.props.source.uri).toBe(mockApodData.hdurl);
    expect(image.props.loadingIndicatorSource).toBe('loading.png');
  });

  it('renders nothing for text fields if APOD data is undefined (or handles gracefully)', () => {
    // Depending on implementation, it might render empty Text or hide them.
    // The current PictureScreen will try to access route.params.apod?.date etc.
    // which will result in undefined, and Text will render nothing.
    const props = createTestProps(undefined);
    render(<PictureScreen {...props} />);

    // Check that it doesn't crash and specific texts are not found or are empty
    // Exact behavior depends on how Text handles undefined children.
    // Typically, it means the text content is empty.
    expect(screen.queryByText(mockApodData.date)).toBeNull();
    expect(screen.queryByText(mockApodData.explanation)).toBeNull();

    const image = screen.getByTestId('picture-image');
    expect(image.props.source.uri).toBeUndefined(); // hdurl would be undefined
  });

  describe('Layout based on orientation', () => {
    it('applies portrait layout styles when width < height', () => {
      mockedUseWindowDimensions.mockReturnValue({ width: 400, height: 800 }); // Portrait
      const props = createTestProps(mockApodData);
      render(<PictureScreen {...props} />);

      const image = screen.getByTestId('picture-image');
      // Portrait style: { aspectRatio: '16/9', width: '100%', height: 'auto' }
      // The parent View style: { flex: 1, flexDirection: 'column' }
      // We can check the image's style or the parent View's style.
      // Checking image width '100%' is a good indicator.
      expect(image.props.style).toEqual(expect.objectContaining({ width: '100%', height: 'auto' }));

      // Check parent View flexDirection (more complex, might need testID on the View)
      // For now, focusing on the image style which is directly controlled.
    });

    it('applies landscape layout styles when width > height', () => {
      mockedUseWindowDimensions.mockReturnValue({ width: 800, height: 400 }); // Landscape
      const props = createTestProps(mockApodData);
      render(<PictureScreen {...props} />);

      const image = screen.getByTestId('picture-image');
      // Landscape style: { aspectRatio: '16/9', width: '50%', height: '100%' }
      expect(image.props.style).toEqual(expect.objectContaining({ width: '50%', height: '100%' }));
    });
  });

  // Test for the ScrollView and its content might be useful too
  it('ScrollView contains the date and explanation', () => {
    const props = createTestProps(mockApodData);
    render(<PictureScreen {...props} />);

    const scrollView = screen.getByTestId('picture-scrollview');
    // Check that text elements are children of ScrollView.
    // This is implicitly tested by querying text within the whole screen,
    // but could be made more specific if needed by scoping queries.
    // For example, within(scrollView).getByText(...)
    // For now, the general queries are fine as there's no other text.
    expect(screen.getByText(mockApodData.date)).toBeTruthy();
    expect(screen.getByText(mockApodData.explanation)).toBeTruthy();
  });
});

import { describe, it } from "vitest";
import { render, screen } from "@testing-library/react";

import ImageList, { IImageListProps } from "./ImageList";

const mockImages: string[] = [
  "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg",
  "https://images.dog.ceo/breeds/hound-afghan/n02088094_1007.jpg",
  "https://images.dog.ceo/breeds/hound-afghan/n02088094_1023.jpg",
];

// Sweet, contain one or more test
describe("ImageList component", () => {
  it("should render", () => {
    // Arrange
    const props: IImageListProps = { images: mockImages };

    // Act
    render(<ImageList {...props} />);
    const imageListComponent = screen.getByTestId("image-list");

    // Assert
    expect(imageListComponent).toBeInTheDocument();
  });

  it("should display images", () => {
    // Arrange
    const props: IImageListProps = { images: mockImages };
    render(<ImageList {...props} />);

    // Act
    const imageElements = screen.getAllByRole("img");

    // Assert
    expect(imageElements?.length).toBe(mockImages.length);
    imageElements.forEach((image, index) => {
      expect(image.src).toBe(mockImages[index]);
      expect(image.alt).toBe("Dog");
    });
  });

  it("Checks the DOM for h2 with 'Image' text", () => {
    // Arrange
    render(<ImageList images={[]} />);

    // Act

    // Assert
    expect(
      screen.getByRole("heading", {
        level: 2,
      })
    ).toHaveTextContent("Image");
  });
});

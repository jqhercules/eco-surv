import { FC, Fragment } from "react";

import styles from "./ImageList.module.scss";

export interface IImageListProps {
  images: string[];
}

const ImageList: FC<IImageListProps> = ({ images }) => {
  return (
    <div className={styles["image-list"]} data-testid="image-list">
      {images.length > 0 &&
        images.map((image, index) => (
          <figure key={index} className={styles["image-item"]}>
            <img src={image} alt="Dog" className={styles.image} />
          </figure>
        ))}
    </div>
  );
};

export default ImageList;

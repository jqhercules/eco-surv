import { useState, useEffect, MouseEvent, FormEvent } from "react";
import ImageList from "./components/ImageList/ImageList";
import DropDown from "./components/Dropdown/Dropdown";
import styles from "./App.module.scss";

export interface IData {
  breeds: string[];
  subBreeds: string[];
  selectedBreed: string;
  selectedSubBreed: string;
  selectedCount: number | string;
  images: string[];
  warningMessage: string;
  hasError?: boolean;
}

const App = () => {
  const [data, setData] = useState<IData>({
    breeds: [],
    subBreeds: [],
    selectedBreed: "",
    selectedSubBreed: "",
    selectedCount: "",
    images: [],
    warningMessage: "",
    hasError: false,
  });

  useEffect(() => {
    fetch("https://dog.ceo/api/breeds/list/all")
      .then((response) => response.json())
      .then((data) => {
        const breeds: string[] = [];
        for (const breed in data.message) {
          breeds.push(breed);
        }

        setData((prevState) => ({
          ...prevState,
          breeds,
        }));
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (data.selectedBreed) {
      fetch(`https://dog.ceo/api/breed/${data.selectedBreed}/list`)
        .then((response) => response.json())
        .then((data) =>
          setData((prevState) => ({ ...prevState, subBreeds: data.message }))
        )
        .catch((error) => console.log(error));
    }
  }, [data.selectedBreed]);

  const handleBreedChange = (event: MouseEvent<HTMLLIElement>) => {
    if ((event.target as HTMLLIElement).innerText) {
      setData((prevState) => ({
        ...prevState,
        selectedBreed: (
          event.target as HTMLLIElement
        ).innerText.toLocaleLowerCase(),
        selectedSubBreed: "",
        warningMessage: "",
        hasError: false,
      }));
      return;
    }
  };

  const handleSubBreedChange = (event: MouseEvent<HTMLLIElement>) => {
    if ((event.target as HTMLLIElement).innerText) {
      setData((prevState) => ({
        ...prevState,
        selectedSubBreed: (
          event.target as HTMLLIElement
        ).innerText.toLocaleLowerCase(),
        warningMessage: "",
        hasError: false,
      }));
      return;
    }
  };

  const handleCountChange = (event: MouseEvent<HTMLLIElement>) => {
    setData((prevState) => ({
      ...prevState,
      selectedCount: parseInt((event.target as HTMLLIElement).innerText),
    }));
  };

  const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const { selectedBreed, selectedSubBreed, selectedCount, subBreeds } = data;

    // breed
    if (!selectedBreed && selectedCount) {
      setData((prevState) => ({
        ...prevState,
        warningMessage: "Please select a breed!",
        hasError: true,
        images: [],
      }));

      return;
    }

    // breed and count
    if (!selectedBreed && !selectedCount && subBreeds.length === 0) {
      setData((prevState) => ({
        ...prevState,
        warningMessage: "Please select a breed and image count!",
        hasError: true,
        images: [],
      }));

      return;
    }

    // sub breed and count
    if (
      selectedBreed &&
      subBreeds.length > 0 &&
      !selectedSubBreed &&
      !selectedCount
    ) {
      setData((prevState) => ({
        ...prevState,
        warningMessage: "Please select a sub-breed and image count!",
        hasError: true,
        images: [],
      }));

      return;
    }

    // sub breed
    if (selectedBreed && subBreeds.length > 0 && selectedCount) {
      setData((prevState) => ({
        ...prevState,
        warningMessage: "Please select a sub-breed!",
        hasError: true,
        images: [],
      }));

      return;
    }

    // count
    if (
      (selectedBreed && !selectedCount) ||
      (selectedBreed && selectedSubBreed && !selectedCount)
    ) {
      setData((prevState) => ({
        ...prevState,
        warningMessage: "Please select a image count",
        hasError: true,
        images: [],
      }));

      return;
    }

    let url = `https://dog.ceo/api/breed/${data.selectedBreed}`;

    if (data.selectedSubBreed) {
      url += `/${data.selectedSubBreed}`;
    }

    url += `/images/random/${data.selectedCount}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) =>
        setData((prevState) => ({
          ...prevState,
          images: data.message,
          warningMessage: "",
          hasError: false,
        }))
      )
      .catch((error) => console.log(error));
  };

  return (
    <div data-testid="app" className={styles.container}>
      <div className={styles.heading}>
        <h1>Dog CEO</h1>
      </div>
      <div className={styles["list-wrapper"]}>
        <DropDown
          initialOption="Choose a breed"
          value={data.selectedBreed}
          options={data.breeds}
          onClick={handleBreedChange}
          testId="breed"
          hasError={data.hasError && !data.selectedBreed}
        />
        {data.subBreeds.length > 0 && (
          <DropDown
            initialOption="Choose a sub-breed"
            value={data.selectedSubBreed}
            options={data.subBreeds}
            onClick={handleSubBreedChange}
            testId="sub-breed"
            hasError={data.hasError && !data.selectedSubBreed}
          />
        )}
        <DropDown
          initialOption="Number of images"
          value={data.selectedCount}
          options={Array.from({ length: 20 }, (_, i) => i + 1)}
          onClick={handleCountChange}
          testId="count"
          hasError={data.hasError && !data.selectedCount}
        />
        <button type="submit" onClick={handleSubmit} className={styles.btn}>
          View images
        </button>
      </div>
      {data.warningMessage && data.hasError && (
        <div className={styles.warning}>
          <p>{data.warningMessage}</p>
        </div>
      )}
      <ImageList images={data.images} />
    </div>
  );
};

export default App;

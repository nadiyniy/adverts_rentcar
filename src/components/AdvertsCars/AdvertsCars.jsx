import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectAdvertsCars,
  selectError,
  selectIsLoading,
} from '../../redux/cars/selectros';
import { fetchCarsThunk } from '../../redux/cars/operations';
import CardList from '../CardList/CardList';
import { AdvertsCarsStyled } from './AdvertsCars.styled';
import AdvertsForm from '../AdvertsForm/AdvertsForm';
import LoaderSpinner from 'components/LoaderSpinner/LoaderSpinner';

const makes = [
  'Buick',
  'Volvo',
  'HUMMER',
  'Subaru',
  'Mitsubishi',
  'Nissan',
  'Lincoln',
  'GMC',
  'Hyundai',
  'MINI',
  'Bentley',
  'Mercedes-Benz',
  'Aston Martin',
  'Pontiac',
  'Lamborghini',
  'Audi',
  'BMW',
  'Chevrolet',
  'Chrysler',
  'Kia',
  'Land',
];
const priceOptions = [
  { label: 'Any Price', value: '' },
  { label: '$0 - $10', value: '0-10' },
  { label: '$10 - $20', value: '10-20' },
  { label: '$20 - $30', value: '20-30' },
  { label: '$30 - $40', value: '30-40' },
  { label: '$40 - $50', value: '40-50' },
  { label: '$50 - $60', value: '50-60' },
  { label: '$60 - $70', value: '60-70' },
  { label: '$70 - $80', value: '70-80' },
];

const AdvertsCars = () => {
  const allCars = useSelector(selectAdvertsCars);
  const dispatch = useDispatch();
  const [displayedCars, setDisplayedCars] = useState(1);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [minMileage, setMinMileage] = useState('');
  const [maxMileage, setMaxMileage] = useState('');
  const [searchedCars, setSearchedCars] = useState([]);
  const [searching, setSearching] = useState(false);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const [data, setData] = useState([]);

  useEffect(() => {
    const payload = {
      page: displayedCars,
      limit: 12,
    };
    dispatch(fetchCarsThunk(payload)).then(response => {
      setData([...data, ...response.payload]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedCars]);

  const loadMore = () => {
    setDisplayedCars(prevDisplayedCars => prevDisplayedCars + 1);
  };
  const handleMakeChange = event => {
    setSelectedMake(event.target.value);
  };
  const handlePriceRangeChange = event => {
    const selectedValue = event.target.value;
    setSelectedPriceRange(selectedValue);
  };

  const filterCars = car => {
    const numericValue = parseFloat(car.rentalPrice.replace(/[^\d.]/g, ''));

    if (!selectedPriceRange) {
      return true;
    }

    const [min, max] = selectedPriceRange.split('-');
    return numericValue >= Number(min) && numericValue <= Number(max);
  };
  const filterByMileage = car => {
    const mileage = car.mileage;

    if (minMileage && !/^\d+$/.test(minMileage)) {
      return false;
    }

    if (maxMileage && !/^\d+$/.test(maxMileage)) {
      return false;
    }

    if (minMileage && mileage < Number(minMileage)) {
      return false;
    }

    if (maxMileage && mileage > Number(maxMileage)) {
      return false;
    }

    return true;
  };

  const handleMinMileageChange = event => {
    setMinMileage(event.target.value);
  };

  const handleMaxMileageChange = event => {
    setMaxMileage(event.target.value);
  };

  const handleSearch = () => {
    const filtered = allCars
      .filter(car => !selectedMake || car.make === selectedMake)
      .filter(filterCars)
      .filter(filterByMileage);

    setSearchedCars(filtered);
    setSearching(true);
  };

  const handleSubmit = e => {
    e.preventDefault();
    handleSearch();
  };
  return (
    <AdvertsCarsStyled>
      <AdvertsForm
        selectedMake={selectedMake}
        selectedPriceRange={selectedPriceRange}
        minMileage={minMileage}
        maxMileage={maxMileage}
        makes={makes}
        priceOptions={priceOptions}
        onMakeChange={handleMakeChange}
        onPriceRangeChange={handlePriceRangeChange}
        onMinMileageChange={handleMinMileageChange}
        onMaxMileageChange={handleMaxMileageChange}
        onSubmit={handleSubmit}
      />

      {searching && !searchedCars.length ? (
        <p>No matching cars found</p>
      ) : (
        <CardList items={searchedCars.length ? searchedCars : data} />
      )}

      {isLoading ? (
        <button className="load-more-btn" disabled>
          <LoaderSpinner />
        </button>
      ) : error ? (
        <p className="load-more-error">Sorry problem with server: {error}</p>
      ) : (
        displayedCars < 3 && (
          <button className="load-more-btn" onClick={loadMore}>
            load more
          </button>
        )
      )}
    </AdvertsCarsStyled>
  );
};

export default AdvertsCars;

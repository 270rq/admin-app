import React, { useState, useEffect } from 'react';
import { YMaps, Map, ZoomControl, SearchControl, Placemark } from '@pbe/react-yandex-maps';
import FormDisabledDemo from './form';
import axios from 'axios';

const DemoAreaMap = () => {
  const [placemarks, setPlacemarks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestBody = {
          "day": "2024-03-13T09:27:00.487Z",
          "flowerId": 1,
          "x": 55.751574,
          "y": 37.573856,
          "lvl": 0
        };

        const response = await axios.post("http://localhost:3000/api/map/getAll", requestBody);
        сonsole.log(response.data);
        setPlacemarks(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const mapState = {
    center: [55.751574, 37.573856], // Центр Москвы
    zoom: 10, // Уровень масштабирования
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <FormDisabledDemo />
      </div>
      <div style={{ flex: 1, paddingLeft: '20px', position: "relative" }}>
        <YMaps query={{ apikey: "ed158a2d-97a9-49a1-8011-28555c611f7a" }}>
          <Map state={mapState} width="100%" height="500px" options={{ suppressMapOpenBlock: true }}>
            <ZoomControl options={{ float: 'right' }} />
            <SearchControl options={{ float: 'left' }} />
            {placemarks.map((placemark, index) => (
              <Placemark key={index} geometry={{ coordinates: [placemark.x, placemark.y] }} />
            ))}
          </Map>
        </YMaps>
      </div>
    </div>
  );
};

export default DemoAreaMap;

import React, { useState, useEffect } from 'react';
import { YMaps, Map, ZoomControl, SearchControl, Placemark } from '@pbe/react-yandex-maps';
import FormDisabledDemo from './form';

const DemoAreaMap = () => {
  const [placemarks, setPlacemarks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/map/getAll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  "day": "2024-03-09T19:54:51.214Z",
                  "flowerId": 1,
                  "x": 10,
                  "y": 10,
                  "lvl": 0
                })
            });
            const data = await response.json();
            console.log(data)
            setPlacemarks(data);
        } catch (error) {
            console.error(error);
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

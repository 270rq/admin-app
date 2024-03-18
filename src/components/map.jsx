import React, { useState, useEffect } from 'react';
import {message } from 'antd';
import { YMaps, Map, ZoomControl, SearchControl, Placemark, TypeSelector } from '@pbe/react-yandex-maps';
import FormDisabledDemo from './form';
import axios from 'axios';

const DemoAreaMap = () => {
  const [placemarks, setPlacemarks] = useState([]);
  const [newPlacemarksCoordinates, setNewPlacemarksCoordinates] = useState([]);
  const [formFilled, setFormFilled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post("http://localhost:3000/api/map/getAll");
        console.log(response.data);
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

  const [hoveredMarker, setHoveredMarker] = useState(null);

  const handleMarkerMouseEnter = (index) => {
    setHoveredMarker(index);
  };

  const handleMapContextMenu = (e) => {
      const coords = e.get('coords');
      setNewPlacemarksCoordinates([...newPlacemarksCoordinates, coords]);
  };

  const handleFormSubmit = (isFilled) => {
    console.log(isFilled);
    setFormFilled(isFilled);
  };

const setDeleteMarkerIndex=  (index)=>{
  console.log(index);
}
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
      <FormDisabledDemo onFormSubmit={handleFormSubmit} />
      </div>
      <div style={{ flex: 1, paddingLeft: '20px', position: "relative" }}>
        <YMaps query={{ apikey: "ed158a2d-97a9-49a1-8011-28555c611f7a" }}>
          <Map state={mapState} width="100%" height="500px" options={{ suppressMapOpenBlock: true }} onContextMenu={handleMapContextMenu}>
            <ZoomControl options={{ float: 'right' }} />
            <SearchControl options={{ float: 'left' }} />
            {placemarks.map((placemark, index) => (
              <Placemark
  key={index}
  geometry={[placemark.x, placemark.y]}
  properties={{
    iconCaption: `${placemark.flower.name}\nЧисло частиц: ${placemark.lvl}`,
    balloonContent: hoveredMarker === index ? <button onClick={() => setDeleteMarkerIndex(index)}>Удалить</button> : ''
  }}
  onClick={() => handleMarkerMouseEnter(index)}
/>
            ))}
            {newPlacemarksCoordinates.map((coords, index) => (
              <Placemark key={index} geometry={coords} />
            ))}
            <TypeSelector options={{ float: "right" }} />
          </Map>
        </YMaps>
      </div>
    </div>
  );
};

export default DemoAreaMap;
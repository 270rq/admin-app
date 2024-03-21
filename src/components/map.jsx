import React, { useState, useEffect } from 'react';
import {message } from 'antd';
import { YMaps, Map, ZoomControl, SearchControl, Placemark, TypeSelector } from '@pbe/react-yandex-maps';
import FormDisabledDemo from './form';
import axios from 'axios';

const DemoAreaMap = () => {
  const [placemarks, setPlacemarks] = useState([]);
  const [newPlacemarksCoordinates, setNewPlacemarksCoordinates] = useState([]);

 

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
      console.log(newPlacemarksCoordinates);
      console.log([...newPlacemarksCoordinates, coords]);

      setNewPlacemarksCoordinates([...newPlacemarksCoordinates, coords]);
  };

  const handleFormSubmit = (data) => {
    console.log(data);
    if( newPlacemarksCoordinates.length <= 0 ){
      console.log("Лох выбери где")
    }
    else {
      axios
        .post('http://localhost:3000/api/placemark', {
          ...data,
          markers: newPlacemarksCoordinates
        })
        .then((response) => {
          console.log(response.data);
          setPlacemarks([...placemarks, response.data]);
    });
  }}
  const changeMarker = (marksData) => {
    setPlacemarks(marksData);
  }
const setDeleteMarkerIndex=  (placemarkIndex)=>{
  setNewPlacemarksCoordinates(newPlacemarksCoordinates.filter((_, index) => index !== placemarkIndex));
}
const deleteMarkerBD = ()=>{
  // сюда надо предупреждение и удаление бд
}
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
      <FormDisabledDemo onFormSubmit={handleFormSubmit} onFlowerChange={changeMarker} />
      </div>
      <div style={{ flex: 1, paddingLeft: '20px', position: "relative" }}>
        <YMaps query={{ apikey: "ed158a2d-97a9-49a1-8011-28555c611f7a" }}>
          <Map state={mapState} width="100%" height="500px" options={{ suppressMapOpenBlock: true }} onClick={handleMapContextMenu}>
            <ZoomControl options={{ float: 'right' }} />
            <SearchControl options={{ float: 'left' }} />
            {placemarks.map((placemark, index) => (
              <Placemark
  key={index}
  geometry={[placemark.x, placemark.y]}
  onContextMenu={()=>deleteMarkerBD(index)}
/>
            ))}
            {newPlacemarksCoordinates.map((coords, index) => (
              <Placemark id={index} key={index} geometry={coords}  onContextMenu={()=>setDeleteMarkerIndex(index)}/>
            ))}

            <TypeSelector options={{ float: "right" }} />
          </Map>
        </YMaps>
      </div>
    </div>
  );
};

export default DemoAreaMap;

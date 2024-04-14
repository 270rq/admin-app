import React, { useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import { YMaps, Map, ZoomControl, SearchControl, Placemark, TypeSelector } from '@pbe/react-yandex-maps';
import FormDisabledDemo from './form';
import axios from 'axios';

const DemoAreaMap = () => {
  const [placemarks, setPlacemarks] = useState([]);
  const [newPlacemarksCoordinates, setNewPlacemarksCoordinates] = useState([]);
  const [markerToDelete, setMarkerToDelete] = useState(null);
  const [flower,setFlower]= useState(0);
  const [date,setDate]= useState(0);
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  
  const handleOk = () => {
    axios
      .delete(`http://localhost:3000/api/placemark/${markerToDelete.id}`)
      .then(() => {
        setPlacemarks(placemarks.filter((placemark) => placemark.id !== markerToDelete.id));
        message.success('Метка успешно удалена');
        setMarkerToDelete(null);
      })
      .catch((error) => {
        message.error('Произошла ошибка при удалении метки');
      });
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

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
  useEffect(()=>{
    let dateStr = ""
    if (date !==0){
      dateStr = `?date=${date}`
    }
    console.log(flower);
    axios
    .get(`http://localhost:3000/api/map/flower/${flower}${dateStr}`)
    .then((response) => {
      console.log(response.data);
      setPlacemarks(response.data);
});
  },[date,flower])
  const handleFormSubmit = (data) => {
    console.log(data);
    if( newPlacemarksCoordinates.length <= 0 ){
      message.warning('Выберите месторасположение аллергена!')
    }
    else {
      console.log(data);
      axios
  .post('http://localhost:3000/api/map', {
    createdAt: new Date(),
    date: data.RangePicker,
    flowerId: data.TreeSelect[1],
    cord: placemarks.map(marker => ({ x: marker.getPosition().lat(), y: marker.getPosition().lng() })),
    lvl: data.particles,
  })
  .then((response) => {
    console.log(response.data);
    setPlacemarks([...placemarks, response.data]);
    message.success('ок');
  });
  }}
  const changeMarker = (flowerData) => {
    if(flowerData.length > 1)
    {
      setFlower(flowerData[1]);
    }
  }
  const changeDate = (date) => {
    setDate(date)
  }
const startDeleteMarker =  (placemarkIndex)=>{
  setNewPlacemarksCoordinates(newPlacemarksCoordinates.filter((_, index) => index !== placemarkIndex));
}
const deleteMarkerBD = (placemark)=>{
  setMarkerToDelete(placemark);
  showModal();
}
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
      <FormDisabledDemo onFormSubmit={handleFormSubmit} onFlowerChange={changeMarker} onDateChange={changeDate} />
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
  onContextMenu={()=>deleteMarkerBD(placemark)}
/>
            ))}
            {newPlacemarksCoordinates.map((coords, index) => (
              <Placemark id={index} key={index} geometry={coords}  onContextMenu={()=>startDeleteMarker (index)}/>
            ))}


<TypeSelector options={{ float: "right" }} />
          </Map>
        </YMaps>
      </div>
      <Modal
        open={open}
        title="Удаление маркера"
        onOk={handleOk}
        okText= 'Удалить'
        cancelText= 'Отмена'
        okType= 'danger'
        onCancel={handleCancel}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <p>Вы уверены в своем выборе?</p>
      </Modal>
    </div>
  );
};

export default DemoAreaMap;

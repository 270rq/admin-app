import React, { useState, useEffect } from 'react';
import { message, Modal } from 'antd';
import { YMaps, Map, ZoomControl, SearchControl, Placemark, TypeSelector } from '@pbe/react-yandex-maps';
import FormDisabledDemo from './form';
import axios from 'axios';

const DemoAreaMap = () => {
  const [placemarks, setPlacemarks] = useState([]);
  const [newPlacemarksCoordinates, setNewPlacemarksCoordinates] = useState([]);
  const [markerToDelete, setMarkerToDelete] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');

  const handleMapContextMenu = (e) => {
    const coords = e.get('coords');
    setNewPlacemarksCoordinates([...newPlacemarksCoordinates, coords]);
  };

  const handleFormSubmit = (formData) => {
    setSelectedRegion(formData.region);
    setSelectedPeriod(formData.period);
    setSelectedLevel(formData.level);
  };

  const filterPlacemarks = placemarks.filter((placemark) => {
    return (
      (!selectedRegion || placemark.region === selectedRegion) &&
      (!selectedPeriod || placemark.period === selectedPeriod) &&
      (!selectedLevel || placemark.level === selectedLevel)
    );
  });

  const changeMarker = (marksData) => {
    setPlacemarks(marksData);
  };

  const startDeleteMarker = (placemarkIndex) => {
    setNewPlacemarksCoordinates(newPlacemarksCoordinates.filter((_, index) => index !== placemarkIndex));
  };

  const deleteMarkerBD = (placemark) => {
    if (placemark) {
      setMarkerToDelete(placemark);
      showModal();
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    if (markerToDelete) {
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
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const mapState = {
    center: [55.751574, 37.573856], // Центр Москвы
    zoom: 10, // Уровень масштабирования
  };

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
            {filterPlacemarks.map((placemark, index) => (
              <Placemark
                key={index}
                geometry={[placemark.x, placemark.y]}
                onContextMenu={() => deleteMarkerBD(placemark)}
              />
            ))}
            {newPlacemarksCoordinates.map((coords, index) => (
              <Placemark id={index} key={index} geometry={coords} onContextMenu={() => startDeleteMarker(index)} />
            ))}
            <TypeSelector options={{ float: "right" }} />
          </Map>
        </YMaps>
      </div>
      <Modal
        visible={open}
        title="Удаление маркера"
        onOk={handleOk}
        okText='Удалить'
        cancelText='Отмена'
        okType='danger'
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
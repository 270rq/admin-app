import React, { useState, useEffect } from 'react';
import { message, Modal, Tooltip } from 'antd';
import { YMaps, Map, ZoomControl, SearchControl, Placemark, TypeSelector } from '@pbe/react-yandex-maps';
import FormDisabledDemo from './form';
import axios from 'axios';

const DemoAreaMap = () => {
  const [placemarks, setPlacemarks] = useState([]);
  const [newPlacemarksCoordinates, setNewPlacemarksCoordinates] = useState([]);
  const [markerToDelete, setMarkerToDelete] = useState(null);
  const [flower, setFlower] = useState(0);
  const [date, setDate] = useState(0);
  const [open, setOpen] = useState(false);
  const [hoveredMarkerInfo, setHoveredMarkerInfo] = useState(null);
  const [hoveredMarkerCoords, setHoveredMarkerCoords] = useState(null);

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
  
  const handleMarkerMouseEnter = (e, placemark) => {
    setHoveredMarkerInfo(placemark);
    setHoveredMarkerCoords(e.get('coords'));
  };

  const handleMarkerMouseLeave = () => {
    setHoveredMarkerInfo(null);
    setHoveredMarkerCoords(null);
  };

  const getColorForLevel = (lvl) => {
    let color = "#bcbcbc";
  
    if (lvl >= 1 && lvl <= 10) {
      color = "#00ff00"; // Зеленый цвет для уровня 1-10
    } else if (lvl >= 11 && lvl <= 100) {
      color = "#ffff00"; // Желтый цвет для уровня 11-100
    } else if (lvl >= 101 && lvl <= 1000) {
      color = "#ffa500"; // Оранжевый цвет для уровня 101-1000
    } else if (lvl >= 1001) {
      color = "#ff0000"; // Красный цвет для уровня 1001 и выше
    }
  
    return color;
  };

  const mapState = {
    center: [55.751574, 37.573856], // Центр Москвы
    zoom: 10,
  };

  const handleMapContextMenu = (e) => {
      const coords = e.get('coords');
      setNewPlacemarksCoordinates([...newPlacemarksCoordinates, coords]);
  };

  useEffect(() => {
    let dateStr = date !== 0 ? `?date=${date}` : "";
    axios
      .get(`http://localhost:3000/api/map/flower/${flower}${dateStr}`)
      .then((response) => {
        setPlacemarks(response.data);
      })
      .catch((error) => {
        message.error('Ошибка при загрузке данных с сервера');
      });
  }, [date, flower]);

  const handleFormSubmit = (data) => {
    if (newPlacemarksCoordinates.length <= 0) {
      message.warning('Выберите местоположение аллергена!');
    } else {
      axios
        .post('http://localhost:3000/api/map', {
          date: data.RangePicker,
          flowerId: data.TreeSelect[1],
          cord: newPlacemarksCoordinates.map(marker => ({ x: marker[0], y: marker[1] })),
          lvl: data.particles,
        })
        .then((response) => {
          setPlacemarks([...placemarks, response.data]);
          message.success('Аллергены сохранены!');
        })
        .catch((error) => {
          message.error('Ошибка при сохранении данных');
        });
    }
  };

  const startDeleteMarker = (placemarkIndex) => {
    setNewPlacemarksCoordinates(newPlacemarksCoordinates.filter((_, index) => index !== placemarkIndex));
  };

  const deleteMarkerBD = (placemark) => {
    setMarkerToDelete(placemark);
    showModal();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ flex: 1, width: '500px', maxWidth: '700px', margin: '0 auto' }}>
        <FormDisabledDemo onFormSubmit={handleFormSubmit} onFlowerChange={setFlower} onDateChange={setDate} />
      </div>
      <div style={{ flex: 1, maxWidth: '800px', paddingLeft: '20px', position: "relative" }}>
        <YMaps query={{ apikey: "ed158a2d-97a9-49a1-8011-28555c611f7a" }}>
          <Map state={mapState} width="700px" height="500px" options={{ suppressMapOpenBlock: true }} onClick={handleMapContextMenu}>
            <ZoomControl options={{ float: 'right' }} />
            <SearchControl options={{ float: 'left' }} />
            {placemarks.map((placemark, index) => (
              <Placemark
                key={index}
                geometry={[placemark.x, placemark.y]}
                options={{
                  iconColor: getColorForLevel(placemark.lvl), // Динамический цвет пина в зависимости от уровня аллергена
                }}
                onMouseEnter={(e) => handleMarkerMouseEnter(e, placemark)}
                onMouseLeave={handleMarkerMouseLeave}
                onContextMenu={() => deleteMarkerBD(placemark)}
              />
            ))}
            {newPlacemarksCoordinates.map((coords, index) => (
              <Placemark
                id={index}
                key={index}
                geometry={coords}
                onContextMenu={() => startDeleteMarker(index)}
              />
            ))}
            {hoveredMarkerCoords && hoveredMarkerInfo && (
              <Tooltip
                title={`Аллерген: ${hoveredMarkerInfo.flower.name}, ${new Date(hoveredMarkerInfo.date).toLocaleString('ru-RU')}, Уровень цветения: ${hoveredMarkerInfo.lvl}`}
                placement="top"
                open={true}
                getPopupContainer={() => document.getElementById('map-container')}
              >
                <div style={{ position: 'absolute', top: hoveredMarkerCoords[1], left: hoveredMarkerCoords[0], backgroundColor: 'white', padding: '5px', borderRadius: '5px', boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.5)' }}>
                  {hoveredMarkerInfo.name}
                </div>
              </Tooltip>
            )}
            <TypeSelector options={{ float: "right" }} />
          </Map>
        </YMaps>
      </div>
      <Modal
        open={open}
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
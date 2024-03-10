export const WIND_DIRECTIONS = [
  { id: 1, name: "N" }, // North (Север)
  { id: 2, name: "NE" }, // Northeast (Северо-восток)
  { id: 3, name: "E" }, // East (Восток)
  { id: 4, name: "SE" }, // Southeast (Юго-восток)
  { id: 5, name: "S" }, // South (Юг)
  { id: 6, name: "SW" }, // Southwest (Юго-запад)
  { id: 7, name: "W" }, // West (Запад)
  { id: 8, name: "NW" } // Northwest (Северо-запад)
];

const DATA = [
  {
    date: new Date("2024/01/28"),
    city: "New York",
    temperature: 32, // Temperature in Fahrenheit
  },
  {
    date: new Date("2024/01/28"),
    city: "Los Angeles",
    temperature: 68,
  },
  {
    date: new Date("2024/01/28"),
    city: "London",
    temperature: 45,
  },
  // Add more entries as needed
];

export default DATA;

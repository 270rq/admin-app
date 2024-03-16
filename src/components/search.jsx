export const searchCity = (value, objectRegion, region, setter) => {
    setter(objectRegion[region].filter((cityObject) => {
        return cityObject.includes(value);
    }));
};
export const searchRegion = (region, array, setter) => {
    setter(array.filter((cityObject) => {
        return cityObject.region.toLowerCase() === region.toLowerCase();
    }));
};
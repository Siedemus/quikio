import roomBgColors from "../resources/roomBgColors";

const getBgColorIdBased = (id: number) => {
  return roomBgColors[id % roomBgColors.length];
};
export default getBgColorIdBased;

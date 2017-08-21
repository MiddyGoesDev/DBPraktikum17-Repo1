export const DIRECTION_NORTH = Object.freeze({ x: 0, y: -1, name: 'North' });
export const DIRECTION_NORTHEAST = Object.freeze({ x: 1, y: -1, name: 'NorthEast' });
export const DIRECTION_EAST = Object.freeze({ x: 1, y: 0, name: 'East' });
export const DIRECTION_SOUTHEAST = Object.freeze({ x: 1, y: 1, name: 'SouthEast' });
export const DIRECTION_SOUTH = Object.freeze({ x: 0, y: 1, name: 'South' });
export const DIRECTION_SOUTHWEST = Object.freeze({ x: -1, y: 1, name: 'SouthWest' });
export const DIRECTION_WEST = Object.freeze({ x: -1, y: 0, name: 'West' });
export const DIRECTION_NORTHWEST = Object.freeze({ x: -1, y: -1, name: 'NorthWest' });
export function directionName(x, y) {
    return (y < 0 ? 'North' : y > 0 ? 'South' : '') + (x < 0 ? 'West' : x > 0 ? 'East' : '');
}
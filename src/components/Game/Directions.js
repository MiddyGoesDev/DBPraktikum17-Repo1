export const DIRECTION_NORTH = { x: 0, y: -1, name: 'North' };
export const DIRECTION_NORTHEAST = { x: 1, y: -1, name: 'NorthEast' };
export const DIRECTION_EAST = { x: 1, y: 0, name: 'East' };
export const DIRECTION_SOUTHEAST = { x: 1, y: 1, name: 'SouthEast' };
export const DIRECTION_SOUTH = { x: 0, y: 1, name: 'South' };
export const DIRECTION_SOUTHWEST = { x: -1, y: 1, name: 'SouthWest' };
export const DIRECTION_WEST = { x: -1, y: 0, name: 'West' };
export const DIRECTION_NORTHWEST = { x: -1, y: -1, name: 'NorthWest' };
export function directionName(x, y) {
    return (y < 0 ? 'North' : y > 0 ? 'South' : '') + (x < 0 ? 'West' : x > 0 ? 'East' : '');
}
import {OptionParameters} from './map/options'
import * as pkg from '../package.json'
import Map from './map/map'

/**
 * The version of the library
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const version = (<any>pkg).version

/**
 * Return a mmp object with all mmp functions.
 * @param {string} id
 * @param {OptionParameters} options
 * @returns {Map}
 */
export function create(id: string, options?: OptionParameters): Map {
    return new Map(id, options)
}


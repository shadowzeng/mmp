import {dispatch} from 'd3'
import {Dispatch} from 'd3-dispatch'
import Utils from '../../utils/utils'
import Log from '../../utils/log'

/**
 * Manage the events of the map.
 */
export default class Events {

    private dispatcher: Dispatch<any>

    /**
     * Initialize the events.
     */
    constructor() {
        const events = Utils.fromObjectToArray(Event)

        this.dispatcher = dispatch(...events)
    }

    /**
     * Call all registered callbacks for specified map event.
     * @param {Event} event
     * @param parameters
     */
    public call(event: Event, ...parameters): void {
        return this.dispatcher.call(event, ...parameters)
    }

    /**
     * Add a callback for specific map event.
     * @param {string} event
     * @param {Function} callback
     */
    public on(event: string, callback: Function): void {
        if (typeof event !== 'string') {
            Log.error('The event must be a string', 'type')
        }

        if (!Event[event]) {
            Log.error('The event does not exist')
        }

        this.dispatcher.on(Event[event], <any>callback)
    }

}

export enum Event {
    create = 'mindap-create',
    center = 'mindap-center',
    undo = 'mindap-undo',
    redo = 'mindap-redo',
    exportJSON = 'mindap-export-json',
    exportImage = 'mindap-export-image',
    zoomIn = 'mindap-zoom-in',
    zoomOut = 'mindap-zoom-out',
    nodeSelect = 'mindap-node-select',
    nodeDeselect = 'mindap-node-deselect',
    nodeUpdate = 'mindap-node-update',
    nodeCreate = 'mindap-node-create',
    nodeRemove = 'mindap-node-remove',
    nodePayloadSelect = 'mindap-node-payload-select',
}

import {Colors, Font, Image} from './models/node'
import Utils from '../utils/utils'
import Map from './map'
import * as d3 from 'd3'
import Log from '../utils/log'

/**
 * Manage default map options.
 */
export default class Options implements OptionParameters {

    private _map: Map
    private _readonly = true

    public fontFamily: string
    public centerOnResize: boolean
    public drag = true
    public zoom = true
    public set readonly(r: boolean) {
        this._readonly = r
        if (this._readonly)
            this.drag = false
    }
    public get readonly(): boolean {
        return this._readonly
    }

    public defaultNode: DefaultNodeProperties
    public rootNode: DefaultNodeProperties

    /**
     * Initialize all options.
     * @param {OptionParameters} parameters
     * @param {Map} map
     */
    constructor(parameters: OptionParameters = {}, map: Map) {
        this._map = map

        this.fontFamily = parameters.fontFamily || 'Arial, Helvetica, sans-serif'
        this.centerOnResize = parameters.centerOnResize !== undefined ? parameters.centerOnResize : true
        this.drag = parameters.drag ?? true
        this.zoom = parameters.zoom ?? true
        this.readonly = parameters.readonly ?? true

        // Default node properties
        this.defaultNode = Utils.mergeObjects({
            name: 'Node',
            image: {
                src: '',
                size: 60
            },
            colors: {
                name: '#787878',
                background: '#f9f9f9',
                branch: '#577a96'
            },
            font: {
                size: 16,
                style: 'normal',
                weight: 'normal'
            },
            locked: true
        }, parameters.defaultNode, true) as DefaultNodeProperties

        // Default root node properties
        this.rootNode = Utils.mergeObjects({
            name: 'Root node',
            image: {
                src: '',
                size: 70
            },
            colors: {
                name: '#787878',
                background: 'aliceblue',
                branch: ''
            },
            font: {
                size: 20,
                style: 'normal',
                weight: 'normal'
            }
        }, parameters.rootNode, true) as DefaultNodeProperties
    }

    public update(property: string, value: any): void {
        if (typeof property !== 'string') {
            Log.error('The property must be a string', 'type')
        }

        switch (property) {
            case 'fontFamily':
                this.updateFontFamily(value)
                break
            case 'centerOnResize':
                this.updateCenterOnResize(value)
                break
            case 'drag':
                this.updateDrag(value)
                break
            case 'zoom':
                this.updateZoom(value)
                break
            case 'defaultNode':
                this.updateDefaultNode(value)
                break
            case 'rootNode':
                this.updateDefaultRootNode(value)
                break
            default:
                Log.error('The property does not exist')
        }
    }

    /**
     * Update the font family of all nodes.
     * @param {string} font
     */
    private updateFontFamily(font: string) {
        if (typeof font !== 'string') {
            Log.error('The font must be a string', 'type')
        }

        this.fontFamily = font

        this._map.draw.update()
    }

    /**
     * Update centerOnResize behavior.
     * @param {boolean} flag
     */
    private updateCenterOnResize(flag: boolean) {
        if (typeof flag !== 'boolean') {
            Log.error('The value must be a boolean', 'type')
        }

        this.centerOnResize = flag

        if (this.centerOnResize === true) {
            d3.select(window).on('resize.' + this._map.id, () => {
                this._map.zoom.center()
            })
        } else {
            d3.select(window).on('resize.' + this._map.id, null)
        }
    }

    /**
     * Update drag behavior.
     * @param {boolean} flag
     */
    private updateDrag(flag: boolean) {
        if (typeof flag !== 'boolean') {
            Log.error('The value must be a boolean', 'type')
        }

        this.drag = flag

        this._map.draw.clear()
        this._map.draw.update()
    }

    /**
     * Update zoom behavior.
     * @param {boolean} flag
     */
    private updateZoom(flag: boolean) {
        if (typeof flag !== 'boolean') {
            Log.error('The value must be a boolean', 'type')
        }

        this.zoom = flag

        if (this.zoom === true) {
            this._map.dom.svg.call(this._map.zoom.getZoomBehavior())
        } else {
            this._map.dom.svg.on('.zoom', null)
        }
    }

    /**
     * Update default node properties.
     * @param {DefaultNodeProperties} properties
     */
    private updateDefaultNode(properties: DefaultNodeProperties) {
        this.defaultNode = Utils.mergeObjects(this.defaultNode, properties, true) as DefaultNodeProperties
    }

    /**
     * Update default root node properties.
     * @param {DefaultNodeProperties} properties
     */
    private updateDefaultRootNode(properties: DefaultNodeProperties) {
        this.rootNode = Utils.mergeObjects(this.rootNode, properties, true) as DefaultNodeProperties
    }

}

export interface DefaultNodeProperties {
    name: string
    image: Image
    colors: Colors
    font: Font
    locked: boolean
}

export interface OptionParameters {
    fontFamily?: string
    centerOnResize?: boolean
    drag?: boolean
    zoom?: boolean
    readonly?: boolean
    defaultNode?: DefaultNodeProperties
    rootNode?: DefaultNodeProperties
}

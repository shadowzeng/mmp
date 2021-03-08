import * as d3 from 'd3'
import Events from './handlers/events'
import Zoom from './handlers/zoom'
import Draw from './handlers/draw'
import Options, {OptionParameters} from './options'
import History from './handlers/history'
import Drag from './handlers/drag'
import Nodes from './handlers/nodes'
import Export from './handlers/export'
import CopyPaste from './handlers/copy-paste'

/**
 * Initialize all handlers and return a mmp object.
 */
export default class Map {

    public id: string
    public dom: DomElements

    public options: Options
    public history: History
    public events: Events
    public zoom: Zoom
    public draw: Draw
    public drag: Drag
    public nodes: Nodes
    public export: Export
    public copyPaste: CopyPaste

    private instance: MindapInstance

    /**
     * Create all handler instances, set some map behaviors and return a mmp instance.
     * @param {string} id
     * @param {OptionParameters} options
     * @returns {MindapInstance} mmpInstance
     */
    constructor(id: string, options?: OptionParameters) {
        this.id = id

        this.dom = {}
        this.events = new Events()
        this.options = new Options(options, this)
        this.zoom = new Zoom(this)
        this.history = new History(this)
        this.drag = new Drag(this)
        this.draw = new Draw(this)
        this.nodes = new Nodes(this)
        this.export = new Export(this)
        this.copyPaste = new CopyPaste(this)

        this.draw.create()

        if (this.options.centerOnResize === true) {
            d3.select(window).on('resize.' + this.id, () => {
                this.zoom.center()
            })
        }

        if (this.options.zoom === true) {
            this.dom.svg.call(this.zoom.getZoomBehavior()).on('dblclick.zoom', null)
        }

        this.nodes.addRootNode()

        this.history.save()

        return <any>this.createMindapInstance()
    }

    private remove = () => {
        this.dom.svg.remove()

        const props = Object.keys(this.instance)
        for (let i = 0; i < props.length; i++) {
            delete this.instance[props[i]]
        }
    }

    private createMindapInstance(): MindapInstance {
        return this.instance = {
            on: this.events.on,
            remove: this.remove,
            new: this.history.new,
            updateOptions: this.options.update.bind(this.options),
            exportAsJSON: this.export.asJSON,
            exportAsImage: this.export.asImage,
            history: this.history.getHistory,
            undo: this.history.undo,
            redo: this.history.redo,
            zoomIn: this.zoom.zoomIn,
            zoomOut: this.zoom.zoomOut,
            center: this.zoom.center,
            addNode: this.nodes.addNode.bind(this.nodes),
            selectNode: this.nodes.selectNode.bind(this.nodes),
            editNode: this.nodes.editNode.bind(this.nodes),
            deselectNode: this.nodes.deselectNode.bind(this.nodes),
            nodeChildren: this.nodes.nodeChildren.bind(this.nodes),
            updateNode: this.nodes.updateNode.bind(this.nodes),
            removeNode: this.nodes.removeNode.bind(this.nodes),
            copyNode: this.copyPaste.copy,
            cutNode: this.copyPaste.cut,
            pasteNode: this.copyPaste.paste
        }
    }

}

export interface MindapInstance {
    on: Function;
    remove: Function;
    new: Function;
    updateOptions: Function,
    exportAsJSON: Function;
    exportAsImage: Function;
    history: Function;
    undo: Function;
    redo: Function;
    zoomIn: Function;
    zoomOut: Function;
    center: Function;
    addNode: Function;
    selectNode: Function;
    editNode: Function;
    deselectNode: Function;
    nodeChildren: Function;
    updateNode: Function;
    removeNode: Function;
    copyNode: Function;
    cutNode: Function;
    pasteNode: Function;
}

export interface DomElements {
    container?: any;
    svg?: any;
    g?: any;
}

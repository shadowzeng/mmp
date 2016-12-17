    /****** Public functions ******/

    const events = d3.dispatch(
        'mmcreate', 'mmcenter', 'nodedblclick',
        'nodeselect', 'nodeupdate',
        'nodecreate', 'noderemove'
    );

    function addNode( prop ) {
        if( global.selected ) {
            const sel = global.nodes.get( global.selected );
            const root = global.nodes.get('node0');
            const key = 'node' + ( ++global.counter );
            const value = {
                name : prop && prop.name || 'Node',
                'background-color' : prop && prop['background-color'] || '#f9f9f9',
                'text-color' : prop && prop['text-color'] || '#808080',
                'branch-color' : prop && prop['branch-color'] || sel['branch-color'] || '#9fad9c',
                'font-size' : prop && prop['font-size'] || 16,
                'font-style' : prop && prop['font-style'] || 'normal',
                'font-weight' : prop && prop['font-weight'] || 'normal',
                fixed : prop && prop.fixed || true,
                x : prop && prop.x || findXPosition( sel, root ),
                y : prop && prop.y || sel.y - d3.randomUniform( 60, 100 )(),
                parent : global.selected
            };
            global.nodes.set( key, value );
            update();
            events.call('nodecreate');
            saveSnapshot();
        }
    }

    function removeNode() {
        if( global.selected !== 'node0' ) {
            global.nodes.remove( global.selected );

            const clean = function( key ) {
                global.nodes.each( function( n, k ) {
                    if ( n.key !== 'node0' && n.parent === key ) {
                        global.nodes.remove( k );
                        clean( k );
                        return;
                    }
                });
            };
            clean( global.selected );

            selectNode('node0');
            redraw();
            events.call('noderemove');
            saveSnapshot();
        } else {
            console.warn('The root node can not be deleted');
        }
    }

    function center() {
        const root = global.nodes.get('node0');
        const center = {
            x : parseInt( global.container.style('width') )/2,
            y : parseInt( global.container.style('height') )/2
        }
        const zoomId = d3.zoomIdentity.translate( center.x - root.x, center.y - root.y );
        global.svg.main.transition().duration(500).call( zoom.transform, zoomId );
        events.call('mmcenter');
    }

    function updateNode( k, v ) {
        const sel = global.nodes.get( global.selected ),
        dom = document.getElementById( global.selected ),
        prop = {
            'name' : updateName,
            'fixed' : updateFixStatus,
            'background-color' : updateBackgroundColor,
            'branch-color' : updateBranchColor,
            'text-color' : updateTextColor,
            'font-size' : updateFontSize,
            'font-style' : updateFontStyle,
            'font-weight' : updateFontWeight
        },
        upd = prop[k];
        if ( upd !== undefined ) {
            if ( upd.call( dom, sel, v ) !== false )
                events.call('nodeupdate', dom, global.selected, sel, k );
        }
        else return error('"'+ k +'" is not a valid node property');
    }

    function png( name, background ) {
        const image = new Image();
        image.src = getDataURI();
        image.onload = function() {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const a = document.createElement('a');

            canvas.width = image.width;
            canvas.height = image.height;
            context.drawImage( image, 0, 0 );

            context.globalCompositeOperation = 'destination-over';
            context.fillStyle = background || '#ffffff';
            context.fillRect(0, 0, canvas.width, canvas.height);

            a.download = name;
            a.href = canvas.toDataURL('image/png');
            a.click();
        }
    }

    function newMap() {
        global.counter = 0;
        global.nodes.clear();
        createRootNode();
        redraw();
        saveSnapshot();
        deselectNode();
        center();
    }

    function undo() {
        const h = global.history;
        if( h.index > 0 ) {
            h.index--;
            loadSnapshot( h.snapshots[h.index] );
        }
    }

    function repeat() {
        const h = global.history;
        if( h.index < h.snapshots.length - 1 ) {
            h.index++;
            loadSnapshot( h.snapshots[h.index] );
        }
    }

    function data() {
        return global.history.snapshots[ global.history.index ];
    }

    function load( data ) {
        loadSnapshot( data );
        saveSnapshot();
    }

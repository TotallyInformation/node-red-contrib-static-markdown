    /* eslint-env browser */
    /* global $,RED */
    // @ts-nocheck
    'use strict'

    /** Node name must match this nodes html file @constant {string} nodeName */
    var nodeName  = 'staticMarkdown'
    var nodeLabel = 'Static Markdown'

    /** Register the node type, defaults and set up the edit fns */
    RED.nodes.registerType(nodeName, {
        category: 'UI Builder',
        color: '#E6E0F8',
        defaults: {
            name: { value: '' },
            topic: { value: '' },
            url: { value: '', required: true },
            source: { value: '', required: true },
        },
        inputs: 0,
        outputs: 0,
        icon: 'ui_template.png',
        paletteLabel: nodeLabel,
        label: function () { return this.url || this.name || nodeLabel },

    })

/**
 * Copyright (c) 2019 Julian Knight (Totally Information)
 * https://it.knightnet.org.uk
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
'use strict'

const main = {
    moduleName: 'TEMPLATE',
    userDir: '',
    httpNodeRoot: '',
}

/** Export the function that defines the node 
 * @param {import("node-red").Red} RED Node-RED global
 */
module.exports = function(RED) {

    /** Folder containing settings.js, installed nodes, etc. @constant {string} userDir */
    main.userDir = RED.settings.userDir
    /** Root URL path for http-in/out and uibuilder nodes @constant {string} httpNodeRoot */
    main.httpNodeRoot = RED.settings.httpNodeRoot
    /** We need an http server to serve the page and vendor packages. */
    const app = RED.httpNode // || RED.httpAdmin

    /** Run the node instance - called from registerType()
     * @param {Object} config The configuration object passed from the Admin interface (see the matching HTML file)
     */
    function nodeGo(config) {
        // Create the node
        RED.nodes.createNode(this, config)

        /** A copy of 'this' object in case we need it in context of callbacks of other functions. @constant {Object} node */
        const node = this

        //#region ----- Create local copies of the node configuration (as defined in the .html file) ----- //
        // NB: node.id and node.type are also available
        node.name     = config.name   || ''
        node.topic    = config.topic  || ''
        //#endregion ----- Local node config copy ----- //

        //#region Node Master processing - anything needing to be done once, outside a node instance //
        //require('./lib/serveMarkdown')(RED)
        //#endregion ---- Node Master processing ---- //

        /** Handler function for node input events (when a node instance receives a msg)
         * @param {Object} msg The msg object received.
         **/
        function nodeInputHandler(msg) {

            // If msg is null, nothing will be sent
            if ( msg !== null ) {
                // if msg isn't null and isn't an object
                // NOTE: This is paranoid and shouldn't be possible!
                if ( typeof msg !== 'object' ) {
                    // Force msg to be an object with payload of original msg
                    msg = { 'payload': msg }
                }
                // Add topic from node config if present and not present in msg
                if ( !(msg.hasOwnProperty('topic')) || msg.topic === '' ) {
                    if ( node.topic !== '' ) msg.topic = node.topic
                    else msg.topic = main.moduleName
                }
            }
            
        } // -- end of msg received processing -- //

        // Process inbound messages
        node.on('input', nodeInputHandler)

        // Do something when Node-RED is closing down which includes when this node instance is redeployed
        node.on('close', function( 
                            /** @type {boolean} true if node removed, false if (re)deployed */ removed,
                            /** @type {function} */ done
                ) {

            done()
        }) // --- End of node close --- //

    } // ---- End of nodeGo (initialised node instance) ---- //

    /** Register the node by name. This must be called before overriding any of the Node functions. */
    RED.nodes.registerType(main.moduleName, nodeGo, {})

} // ==== End of module.exports ==== //

// EOF
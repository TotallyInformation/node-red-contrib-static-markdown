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

const fs = require('fs-extra')
const path = require('path')
const express = require('express')
const tilib = require('./tilib.js')
const handlebars = require('handlebars')
const YAML = require('yaml')
const yaml = require('js-yaml')

module.exports = function serveMarkdown(RED, node){
    /** Folder containing settings.js, installed nodes, etc. 
     * @type {string} userDir */
    const userDir = RED.settings.userDir
    /** Root URL path for http-in/out and uibuilder nodes 
     * @type {string} */
    const httpNodeRoot = RED.settings.httpNodeRoot || ''
    /** Server folder containing html to serve 
     * @type {string} */
    const httpStatic = RED.settings.httpStatic || ''

    /** We need an http server to serve the page and vendor packages. 
     * @type {Express.Application} */
    const app = RED.httpNode // || RED.httpAdmin

    /** The URL path to use, must start & end with / - no need to add httpStatic, done by Node-RED
     * @type {string} */
    const url = tilib.urlJoin( node.url ) + '/'

    /** The source folder to use 
     * @type {string} */
    var source = node.source || httpStatic

    /** If source doesn't start with /, assume it is sub-folder of userDir */
    if ( ! path.isAbsolute(source) ) {
        source = path.resolve(userDir, source)
    }

    /** If source doesn't exist, log warning and exit */
    if ( ! fs.pathExistsSync(source) ) {
        node.warn(`[static-markdown] Source folder does not exist: ${source}`)
        return
    }

    /** Does the custom template folder exist? 
     * @type {string|boolean} */
    var templateFolder = path.join(source, '.templates')
    if ( ! fs.pathExistsSync(templateFolder) ) templateFolder = false

    console.log({userDir,httpNodeRoot,url,source})
    
    var frontMatter = {}

    /** Include and configure markdown library */
    const md = require('markdown-it')({
        html:true, 
        linkify:true,
    })
    .use(require('markdown-it-front-matter'), function(fm) {
        frontMatter = yaml.load(fm)
    })

    /** Default HMTL template to use */
    // TODO Move to pre-compiled file and require instead of compile.
    var template = '<body style="font-family:helvetica neue,arial,helvetica,sans-serif; margin:12px">{{{content}}}</body>'

    var originalurl

    /** If request isn't for .md file, check for index.md */
    app.use(url, function(req, res, next) {
        originalurl = req.url

        // Get last element of url path
        var last = req.url.split('/').pop()

        // If last element has no dot ...
        if ( last.indexOf('.') === -1 ) {
            // append index.md as a default file.
            req.url += '/index.md'
        }

        // If last element name starts with . (not allowed) ...
        if ( last.indexOf('.') === 0 ) {
            res.status(404).send('<h1>Sorry. File not found.</h1>')
        }

        next()
    })

    /** Serve up markdown files that are in the source folder */
    app.get( url + '(*.md)?', function(req, res, next) {
        // NB: req.url does NOT include httpNodeRoot
 
        /** Work out the full path of the file that matches the url */
        var fileName = path.join(source,req.url.replace(node.url, ''))

        /** @type {null|string|string[]} */
        var templateFilename = null

        /** Is there a custom template to use? */
        if ( templateFolder !== false) {
            var foundTemplate = false
            
            // @ts-ignore
            templateFilename = path.join(templateFolder,req.url.replace(node.url, '').replace('.md', '.hbs'))

            /** Check for specific template file `fldr/filename.hbs` */
            try {
                // @ts-ignore
                template = fs.readFileSync(templateFilename, {encoding:'utf8'})
                foundTemplate = true
            } catch(e) { /*console.error(e)*/ }

            /** Otherwise walk back up folders to .templates root until we find a folder template (`index.hbs`) */
            let gotToRoot = false, loopCount = 0
            templateFilename = templateFilename.split(path.sep)
            while ( foundTemplate === false && gotToRoot === false && templateFilename.length > 2) {
                loopCount++

                // Drop the file name or sub-folder
                let lastSub = templateFilename.pop()
                // but put it back if it is the root .templates folder + stop the loop
                if ( lastSub === '.templates' ) {
                    gotToRoot = true
                    templateFilename.push(lastSub)
                }
                
                console.log({
                    'Count': loopCount, 'gotToRoot': gotToRoot, 'foundTemplate': foundTemplate,
                    'templateFilename': templateFilename,
                    'path': tilib.pathJoin(templateFilename,'index.hbs'),
                })

                try {
                    template = fs.readFileSync(tilib.pathJoin(templateFilename,'index.hbs'), {encoding:'utf8'})
                    foundTemplate = true
                } catch(e) { /*console.error(e)*/ }
                
            } // -- end of while -- //

            /** Finally check for a generic `.template.hbs` file in the source folder */
            if ( foundTemplate === false ) {
                try {
                    template = fs.readFileSync(path.join(source,'.template.hbs'), {encoding:'utf8'})
                    foundTemplate = true
                } catch(e) { /* console.error(e) */ }
            }

            /** Otherwise use the built-in generic template */
        } // -- end of templateFolder <> false -- //

        /** Compile template */
        // TODO pre-compile default template
        var hbTemplate = handlebars.compile(template)

        //console.log({'req.url': req.url, 'fileName': fileName, 'template': template})

        fs.readFile(fileName, 'utf8', function(err, data) {    
            // any error just delegate
            if (err) {
                req.url = originalurl
                if ( err.code === 'ENOENT' ) {
                    res.status(404).send('<h1>Sorry, file not found.</h1>')
                } else {
                    next(err)
                }
            } else {
                var stats = fs.statSync(fileName)
                try {
                    res.send(hbTemplate({
                        'content': md.render( data.toString() ),
                        'template': templateFilename.join(path.sep),
                        'mtime': stats.mtime,
                        'frontMatter': frontMatter,
                        'fmPre': JSON.stringify(frontMatter, undefined, 4),
                    }))
                } catch(e) {
                    req.url = originalurl
                    next(e)
                }
            }
        })

    })
    
    /** And serve anything else that is valid */
    // TODO need to make sure static doesn't display . files/folders
    app.use(url, express.static(source))

} // --- End of module.exports ---- //

// EOF
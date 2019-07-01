# node-red-contrib-staticMarkdown
Serve up a folder of static markdown files from Node-RED

In the admin panel for the node instance, provide a url path and a source folder.

The source folder can contain sub-folders. Files with an extension of `.md` will be served as web pages.

Each folder may contain a file named `index.md` and if so, this will be used as the default page for that folder.

## Markup

The source files can contain any valid CommonMark markup and may also contain metadata in a YAML header. e.g.

```
---
title: This is the title for my markdown file
---
# My markdown file

This file will be served as HTML with the help of Node-RED.
```

## Templates

The source files folder may contain a sub-folder named `.templates`. If it does, it should contain a Handlebars template called `default.hba`.

If the `.templates` folder does not exist, a default template will be used.

## Dependencies

* [Glob](https://www.npmjs.com/package/glob) - Recursively read a directory, returning an array with all files that match an specified pattern.
* [marked](https://www.npmjs.com/package/marked) - Compile Markdown to HTML.
* [front-matter](https://www.npmjs.com/package/front-matter) - Extract meta data (front matter) from documents.
* [fs-extra](https://www.npmjs.com/package/fs-extra) - Adds new functions to Node’s native file-system module (fs) and add promise support for the existing ones.

## Inspiration

* https://www.webdevdrops.com/build-static-site-generator-nodejs-8969ebe34b22/
* https://github.com/jaredhanson/marked-engine

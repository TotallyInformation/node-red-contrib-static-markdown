# node-red-contrib-staticMarkdown
Serve up a folder of static markdown files from Node-RED.

In the admin panel for the node instance, provide a url path and a source folder.

The source folder can contain sub-folders. Files with an extension of `.md` will be served as web pages.

Each folder may contain a file named `index.md` and if so, this will be used as the default page for that folder.

## Markup

The source files can contain any valid [CommonMark](https://commonmark.org/) markup (provided by the [markdown-it](https://github.com/markdown-it/markdown-it)) and may also contain metadata in a [YAML header](https://yaml.org/spec/1.2/spec.html#Preview). e.g.

```
---
title: This is the title for my markdown file
---
# My markdown file

This file will be served as HTML with the help of Node-RED.
```

The parsed YAML data is passed through to the Handlebars template engine and so is available in custom templates.

Note that `markdown-it` is the library used already by Node-RED to handle markdown processing.

## Auto-index files

Similarly to Node-RED's built-in static file serving, if a folder name is given in the URL instead of a filename, `/index.md` will be automatically appended.

## Static HTML, etc.

The root source folder is mounted using ExpressJS `static-server` in the same way as Node-RED's `httpStatic` setting. This means that files ending in `.html`, `.js`, `.css`, etc. will all be served as normal. You can use this not only to display html content but also to load CSS styling and JavaScript via custom templates.

## Templates

Each markdown file is wrapped in a template that is provided by [Handlebars](https://github.com/wycats/handlebars.js).

The source files folder may contain a sub-folder named `.templates`. If it does, it should contain a one or more Handlebars template files.

If the `.templates` folder does not exist, a file in the source folder called `.template.hbs` will be looked for. If that also doesn't exist, an internal default template will be used.

Template files will be searched for in the following order:

- `.templates` & Folder & filename (ending in `.hbs` instead of `.md`) matching the requested markdown filename
- `.templates` & Folder & `index.hbs`
- `.templates` & Parent folder & `index.hbs` - right back up the parents tree to ...
- `.templates` & root source folder & `index.hbs`
- Root source folder & `.template.hbs`
- Internal default template string

## Template metadata

In addition to the translated markdown, the following metadata is provided to the Handlebars templating engine so that it can be used in custom templates:

- **`template`**: Template filename used to render the file
- **`mtime`**: The date/time the file was last changed
- **`frontMatter`**: An object containing properties from the YAML frontmatter
- **`fmPre`**: A JSON.stringify'd version of the frontmatter suitable for debugging & understanding what frontmatter is available

## Example template

The following is an example template showing content and metadata:

```
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>{{frontMatter.title}}</title>
        <style>
            body {
                font-family:helvetica neue,arial,helvetica,sans-serif; 
                margin:12px;
            }
        </style>
    </head><body>
        {{{content}}}
        <hr>
        <h2>Meta Data</h2>
        <dl>
            <dt>Template</dt> <dd>{{template}}</dd>
            <dt>Date/Time Modified</dt> <dd>{{mtime}}</dd>
        </dl>

        <h2>Front Matter</h2>
        <dl>
            <dt>Title</dt> <dd>{{frontMatter.title}}</dd>
        </dl>
        <pre>{{fmPre}}</pre>
    </body>
</html>
```

Note the triple braces around the content variable. That tells Handlebars to treat the content as pre-rendered HTML.

## Inspiration

* https://www.webdevdrops.com/build-static-site-generator-nodejs-8969ebe34b22/
* https://github.com/jaredhanson/marked-engine

# node-red-contrib-staticMarkdown

Serve up a folder of static markdown files from Node-RED.

In the admin panel for the node instance, provide a url path and a source folder.

The source folder can contain sub-folders. Files with an extension of `.md` will be served as web pages.

Each folder may contain a file named `index.md` and if so, this will be used as the default page for that folder.

A `.templates` folder can contain Handlebars templates used to render the content. There is a default template if you don't want to bother.

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

A number of markup extensions have been installed, see [docs/details.md](./docs/details.md) for details.

Notes

- The `markdown-it` is the library used already by Node-RED to handle markdown processing.
- The package folder contains `docs/test-md-library`. You can use the contents to test this node, copy to your selected source folder. In addition, the folder contains a file `test.md` which demonstrates the majority of the markdown and extensions available to you.

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

Note that Node-RED must be restarted if new templates are added. Redeploying the flows using the editor menu is not sufficient.

## Template metadata

In addition to the translated markdown, the following metadata is provided to the Handlebars templating engine so that it can be used in custom templates:

- **`template`**: Template filename used to render the file. You may overwrite this by including an entry of the same name in your frontMatter.
- **`stylesheet`**: The URL for the default stylesheet made available automatically. You may overwrite this by including an entry of the same name in your frontMatter.
- **`prismstyles`**: Stylesheet URL for Prism syntax highlighting. You may overwrite this by including an entry of the same name in your frontMatter.
- **`mtime`**: The date/time the file was last changed
- **`frontMatter`**: An object containing properties from the YAML frontmatter. The `title` variable is included in the default template.
- **`fmPre`**: A JSON.stringify'd version of the frontmatter suitable for debugging & understanding what frontmatter is available

## Example template

The following is an example template showing content and metadata:

```
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <title>{{frontMatter.title}}</title>
        <link rel="stylesheet" href="{{stylesheet}}">
        <link rel="stylesheet" href="{{prismstyles}}">
    </head><body>
        {{{content}}}
        <hr>
        <h2>Meta Data</h2>
        <dl>
            <dt>Stylesheet</dt> <dd>{{stylesheet}}</dd>
            <dt>Prism Styles (Syntax Highlighting)</dt> <dd>{{prismstyles}}</dd>
            <dt>Template</dt> <dd>{{template}}</dd>
            <dt>Date/Time Modified</dt> <dd>{{mtime}}</dd>
        </dl>

        <h2>Front Matter</h2>
        <pre>{{fmPre}}</pre>
    </body>
</html>
```

Notes:
- The triple braces around the content variable. That tells Handlebars to treat the content as pre-rendered HTML.
- The linked stylesheet is pointing to the default sheet

## What is missing at the moment?

As this is an early release, there are still a few rough edges and some enhancements that I want to add.

- The selected source folder is not created for you. You have to do that yourself.
- Missing some markdown enhancements. See [docs/details.md](docs/details.md) for details.
- The admin panel could do with some error checking and notifications.
- The admin help panel is very basic at present.
- Not yet tidying up ExpressJS middleware/routes when redeploying node instances.
- Default CSS is a little rough, based on a 3rd-party GitHub Markdown CSS.
- Would be nice to make the markdown-it extensions optional so that the whole thing uses less memory if you don't need them.
- A Markdown editor.

## Inspiration

* https://www.webdevdrops.com/build-static-site-generator-nodejs-8969ebe34b22/
* https://github.com/jaredhanson/marked-engine

# Detailed description of the processing in static-markdown

## Dependencies

- **[markdown-it]()** - Parse a markdown file and translate to HTML
  
  The following markdown-it extensions are installed:

  - **[markdown-it-anchor](https://www.npmjs.com/package/markdown-it-anchor)** - Add anchor's to all headings.
  - **[markdown-it-attrs](https://www.npmjs.com/package/markdown-it-attrs)** - Allow custom attributes
  - **[markdown-it-checkbox](https://www.npmjs.com/package/markdown-it-checkbox)** - Lists with checkboxes
  - **[markdown-it-emoji](https://www.npmjs.com/package/@gerhobbelt/markdown-it-emoji)** - Emoji's
  - **[markdown-it-include](https://www.npmjs.com/package/@gerhobbelt/markdown-it-include)** - include markdown files
  - **[markdown-it-footnote](https://www.npmjs.com/package/@gerhobbelt/markdown-it-footnote)** - Supports footnote links
  - **[markdown-it-front-matter](https://www.npmjs.com/package/markdown-it-front-matter)** - Allows parsing of YAML based front-matter
  - **[markdown-it-imsize](https://www.npmjs.com/package/markdown-it-imsize)** - add wxh size to be added to images
  - **[markdown-it-kbd](https://www.npmjs.com/package/markdown-it-kbd)** - <kbd> tag using `[[]]`
  - **[markdown-it-mark](https://www.npmjs.com/package/markdown-it-mark)** - Highlight text with `==text==`
  - **[markdown-it-playground](https://www.npmjs.com/package/markdown-it-playground)** - Allows embedding of jsFiddle and CodePen playground examples
  - **[markdown-it-prism](https://www.npmjs.com/package/markdown-it-prism)** - Syntax highlighting block. Dark theme CSS included.
  - **[markdown-it-sub](https://www.npmjs.com/package/markdown-it-sub)** - Subscript tag
  - **[markdown-it-sup](https://www.npmjs.com/package/markdown-it-sup)** - Superscript tag
  - **[markdown-it-table-of-contents](https://www.npmjs.com/package/markdown-it-table-of-contents)** - Use `[[toc]]` to generate a table of contents.
  - **NOT CURRENTLY WORKING** None of the mermaid extensions appear to work ~~**[markdown-it-mermaid]()** - Diagrams~~


- **[js-yaml]()** - Parse YAML front-matter
- **[handlebars]()** - Provides custom templating to wrap around parsed markdown
- **[fs-extra]()** - Improved filing system handling
- **[express]()** - HTTP/HTML server

## Markdown extensions to be considered

- Maths
- Diagrams (Mermaid)
- TeX

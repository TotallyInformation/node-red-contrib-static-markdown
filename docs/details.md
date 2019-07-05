# Detailed description of the processing in static-markdown

## Dependencies

- **[markdown-it]()** - Parse a markdown file and translate to HTML
  - **[markdown-it-front-matter]()** - Allows parsing of YAML based front-matter
- **[js-yaml]()** - Parse YAML front-matter
- **[handlebars]()** - Provides custom templating to wrap around parsed markdown
- **[fs-extra]()** - Improved filing system handling
- **[express]()** - HTTP/HTML server

## Markdown extensions to be considered

- Table of Contents
- Checkboxes
- Kbd markup
- Maths
- Diagrams (Mermaid)
- Inline Styles
- Footnotes
- Sub/Superscript
- TeX
- Header anchors
- Abbreviations
- Includes
- Enhanced tables (embedded block syntax)
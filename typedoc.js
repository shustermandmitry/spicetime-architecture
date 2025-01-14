module.exports = {

    entryPoints: ["src/index.ts"],
    out: "docs/.generated/api",
    plugin: [
        "typedoc-plugin-markdown",
        "typedoc-plugin-mermaid"
    ],
    theme: "markdown",
    excludePrivate: true,
    excludeProtected: true,
    excludeExternals: true,
    mergeModulesMergeMode: "module",
    validation: {
        notExported: true,
        invalidLink: true,
        notDocumented: true
    }
};
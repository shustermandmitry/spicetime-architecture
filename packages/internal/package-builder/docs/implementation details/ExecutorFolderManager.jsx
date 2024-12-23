    <Executor>
      <FolderManager spec={initialSpec} />
    </Executor>

    <Folder name="src" spec="Root folder for all source code">
        <Folder name="components" spec="Stores React components" />
        <Folder name="bootstrap" spec="Kernel meta settings for recursive bootstrapping" />
    </Folder>

    <File name="App.jsx" spec="Defines the root application UI using React." />

    <Executor>
        <FolderManager spec="Creates the structure for a React application">
            <Folder name="src" spec="Source code directory">
                <Folder name="components" spec="Holds reusable React components">
                    <File name="App.jsx" spec="Defines the main app interface." />
                </Folder>
                <Folder name="hooks" spec="Custom React hooks are placed here." />
            </Folder>
            <Folder name="bootstrap" spec="Metadata and config files for bootstrapping" />
        </FolderManager>
    </Executor>

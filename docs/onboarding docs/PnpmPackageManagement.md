# Package Management: Using pnpm

We use **pnpm** instead of npm or yarn for its speed and disk efficiency. Below are some common commands:

- Install dependencies:  
  ```bash
  pnpm install
  ```

- Add a package:  
  ```bash
  pnpm add <package-name>
  ```

- Run scripts defined in `package.json`:  
  ```bash
  pnpm run <script-name>
  ```

For example:
- To run the development server: `pnpm run dev`.
- To build the app for production: `pnpm run build`.
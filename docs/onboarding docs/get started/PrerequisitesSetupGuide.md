# Prerequisites

Before you start, ensure you have the following installed and properly configured on your machine:

---

## 1. **Node.js** (v18 or Later, LTS Version)

We recommend using **NVM** (Node Version Manager) to easily install and manage Node.js versions on your machine.

### **Install NVM**:
1. Open your terminal and run the following command to download the NVM installation script:
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
   ```

2. Restart your terminal or run the following command to load NVM:
   ```bash
   source ~/.nvm/nvm.sh
   ```

3. Verify that NVM is installed using:
   ```bash
   nvm --version
   ```

### **Install Node.js with NVM**:
1. Install Node.js (v18 LTS) using:
   ```bash
   nvm install 18
   ```

2. Use Node.js v18 as the default version:
   ```bash
   nvm alias default 18
   nvm use 18
   ```

3. Verify the Node.js and npm versions:
   ```bash
   node -v
   npm -v
   ```

---

## 2. **pnpm** (Package Manager)

Install `pnpm` globally via the command line:
```bash
npm install -g pnpm@latest
```

Verify the installation by checking the version:
```bash
pnpm -v
```

---

## 3. **Git**

Ensure `git` is installed and configured with your GitHub credentials:
1. Install Git using a package manager (if not already installed):
   - **macOS**:
     ```bash
     brew install git
     ```
   - **Ubuntu/Linux**:
     ```bash
     sudo apt install git
     ```
   - **Windows**: Download from [Git for Windows](https://git-scm.com/).

2. Configure your Git **username** and **email**:
   ```bash
   git config --global user.name "YourName"
   git config --global user.email "youremail@example.com"
   ```

3. Verify the configuration:
   ```bash
   git config --list
   ```

---

## 4. **Text Editor/IDE**

We strongly recommend using **WebStorm 2024.2.1** for development as it provides advanced features for React, TypeScript, and testing workflows.

- Download and install WebStorm from the official JetBrains website:  
  [WebStorm Download](https://www.jetbrains.com/webstorm/download/)

Other IDEs like **Visual Studio Code** are supported but may require additional setup for linting, debugging, and TypeScript support.

---

Now that you’ve prepared your environment, you're ready to proceed with setting up the project!
# Create TypeScript CLI App

Create TypeScript CLI App is a simple and efficient tool to set up a Node.js TypeScript project with minimal hassle. It comes pre-configured with essential tools and libraries, allowing you to focus on writing your code rather than setting up your environment.

## Features

- **Single File Output**: Webpack bundles your project into a single JavaScript file with a shebang (`#!/usr/bin/env node`). This allows for easy integration and sharing without needing to install npm packages.
- **TypeScript**: Ensures type safety and improves code quality.
- **ESLint**: Maintains code quality by identifying and fixing problems in your JavaScript code.
- **Prettier**: Ensures consistent code formatting.
- **Unit Testing**: Set up with Vitest to ensure your code is tested and reliable.
- **CLI Tools**: Includes popular npm packages for creating CLI apps:
  - [Chalk](https://www.npmjs.com/package/chalk): For styling command-line output.
  - [Commander](https://www.npmjs.com/package/commander): For parsing command-line arguments.
  - [Inquirer](https://www.npmjs.com/package/inquirer): For creating interactive command-line prompts.

## Prerequisites

- **Node.js**: Version 20 or higher.

## Getting Started

To create a new project, run the following command:

```sh
npx @canseyran/create-ts-cli-app <project-directory>
```

Replace `<project-directory>` with your desired project folder name.

### Example

```sh
npx @canseyran/create-ts-cli-app random-trivia-app
cd random-trivia-app
npm start
```

## Available Commands

Once your project is set up, you can use the following npm scripts:

- **Start**: Run the main TypeScript file.
  ```sh
  npm start
  ```

- **Build**: Bundle your project into a single javascript file using Webpack.
  ```sh
  npm run build
  ```

- **Development Mode**: Watch for changes and recompile automatically.
  ```sh
  npm run dev
  ```
  Equivalent to:
  ```sh
  tsx watch ./src/main.ts
  ```

- **Run Tests**: Execute your unit tests with Vitest.
  ```sh
  npm test
  ```

- **Watch Tests**: Run your tests in watch mode.
  ```sh
  npm run test:watch
  ```

- **Format Code**: Format your code with Prettier.
  ```sh
  npm run format
  ```

## Project Structure

After setup, your project structure will look like this:

```
<project-directory>
├── README.md
├── eslint.config.mjs
├── package.json
├── src
│   ├── main.test.ts
│   └── main.ts
├── tsconfig.json
├── vitest.config.ts
└── webpack.config.js
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes or improvements.

## License

This project is licensed under the MIT License.

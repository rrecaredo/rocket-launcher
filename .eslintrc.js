module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    },
    tsconfigRootDir: "./"
  },
  settings: {
    react: {
      version: "detect"
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    },
    "import/resolver": {
      node: {
        paths: ["src"],
        extensions: [".ts", ".tsx"]
      },
      typescript: {
        project: ["tsconfig.json"]
      }
    }
  },
  extends: ["plugin:react/recommended", "plugin:prettier/recommended", "plugin:react-hooks/recommended", "plugin:import/recommended", "plugin:jsx-a11y/recommended", "plugin:@typescript-eslint/recommended", "plugin:import/typescript", "plugin:storybook/recommended", "plugin:storybook/recommended", "plugin:storybook/recommended"],
  plugins: ["@typescript-eslint", "import", "react", "jsx-a11y", "prettier"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off"
  }
};
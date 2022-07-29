import "@testing-library/jest-dom";

const REACT_18_ERROR = (
    "ReactDOM.render is no longer supported in React 18."
);
const originalError = console.error.bind(console.error);
console.error = (...args) => !args.toString().includes(REACT_18_ERROR)
    && originalError(...args);

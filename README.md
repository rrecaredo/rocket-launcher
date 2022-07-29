![example workflow](https://github.com/rrecaredo/rocket-launcher/actions/workflows/main.yml/badge.svg)

# Space rocket launcher 🚀

You have been tasked with building a re-usable button for a mission control dashboard.

The button needs to make a GET request to a mission control server to ignite the rocket fuel and launch the rocket ship. However, if the rocket fuel takes too long to ignite then something is not right and the request should be abandoned. Also, launching rockets is scary, if the user gets cold feet they need to be able to abort a launch request before it completes.

## Instructions

Install package dependencies

```
yarn install
```

Start the application

```
yarn start
```

Run the battery of unit tests

```
yarn test
```

Build and open storybook

```
yarn build-storybook
yarn storybook
```

## Test the Components

![2022-07-28 10 35 20](https://user-images.githubusercontent.com/196860/181460784-491bf908-fd58-45c1-bcab-07f16588039e.gif)

![2022-07-28 10 34 58](https://user-images.githubusercontent.com/196860/181460904-70995f4c-65e2-4ede-83eb-3e2a675e409b.gif)

- [Demo application](https://rocket-launcher.vercel.app/)
- [StoryBook](https://62e243f653f954ed0d3d0cf9-bkfvfcgapn.chromatic.com/)

## Design

### Structure decomposition

```
rocket-launcher/
└── src/
    ├── lib/
    │   ├── hooks/
    │   │   └── useCancellableFetch.ts
    │   └── components/
    │       ├── primitives/
    │       │   ├── Button.ts
    │       │   ├── Tooltip.ts
    │       │   └── Spinner.ts
    │       ├── SmartButton.ts
    │       └── CancellableRequestButton.ts
    └── components/
        └── RocketLauncher.ts
```

Modules _(components, hooks)_ living inside `/lib` are shareable and intended to exist within the scope of a UI library.

### **High level architecture**

<img width="1076" alt="image" src="https://user-images.githubusercontent.com/196860/181433500-b9262285-16c7-4ce4-ae65-f9c352b36f26.png">

### Primitives

Primitives are basic building blocks that can be used to compose more complex components. `<Button>`, `<Tooltip>` and `<Spinner>` can be combined in different ways to fulfill other use cases.

### SmartButton

Encapsulates the presentation logic for state transitions. It represents the glue between a normal Button, a Tooltip and their relation. It can be used for use cases where the main operation is not necessarily a Fetch request.

### CancellableRequestButton

It is an abstraction on top of `<SmartButton>` that incorporates HTTP fetching management. It is designed to be used in scenarios similar to Rocket
Launching, where we want the user to be able to initiate a request to an HTTP endpoint and apply
the same set of transition rules.

### **State transitions**

<img width="572" alt="image" src="https://user-images.githubusercontent.com/63280641/181743461-b5780c22-5141-49f9-a188-1917032468a1.png">

- By default, the button loads in Ready state.
- From Ready, the launch button can transition to Working when the user press the button, starting the ignition process.
- If the launch button is again pressed while its working, it will transition to Errored (canceling the ongoing request inmediately)
- If the request takes too long to complete, the button will transition to Errored.
- If there is an error with the fetch operation, the button will transition to Errored.
- It will be possible to transition from Errored back to Working only if the user has manually aborted the request before so they can retry again.

## Stack

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Styled Components](https://styled-components.com/)
- [Floating-UI](https://floating-ui.com/)
- [React Query](https://tanstack.com/query/v4/?from=reactQueryV3&original=https://react-query-v3.tanstack.com/)
- [Storybook](https://storybook.js.org/)
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## Possible improvements

- Add unit tests to all components
- Improve the design system and create a design language using tokens.
- Enhance useCancellabeFetch. HTTP Service could be defined in a global scope and injected into the hook (either via ContextProvider or some form of Service Locator pattern). This way we would have more granular control over HTTP headers, authentication, params/body validation, logging, etc.
- Add Integration tests for components ([Cypress component tests](https://docs.cypress.io/guides/component-testing/testing-react))
- Add Visual regression tests
- Fix issues with Tooltip Top placement and potentially remove dependency with Floating-UI. Write custom logic with `getBoundingClientRect()`.
- Move Common elements to a separate UI library or make the system a monorepo.

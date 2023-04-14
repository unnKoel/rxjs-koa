# Steamable-express

## Q&A

- what does the typeconfig option "lib" do?

  [What does the tsconfig option "lib" do?](https://stackoverflow.com/questions/39303385/what-does-the-tsconfig-option-lib-do)

- why we need to use typescript and babel both together

  [Why would I use TypeScript and Babel together?](https://stackoverflow.com/questions/44020689/why-would-i-use-typescript-and-babel-together)

  [Is babel still relevant for Typescript project?](https://dev.to/mbeaudru/is-babel-still-relevant-for-typescript-projects-36a7)

  key takeways as follows:

  - One important aspect of babel-preset-env I think you missed: Browser Polyfills. TypeScript can transpile syntax down for older browsers, but it won't add runtime code to support something like String.prototype.replaceAll() in IE11

  - keep tree-shaking feature working to avoid it mssing.

## Reference

[How to use ESLint with TypeScript](https://khalilstemmler.com/blogs/typescript/eslint-for-typescript/)

[How to Setup a TypeScript + Node.js Project](https://khalilstemmler.com/blogs/typescript/node-starter-project/)

[Offical KOA](https://koajs.com/)

[How Koa middleware works](https://itnext.io/how-koa-middleware-works-f4386b5573c)

[Install MongoDB Community Edition on macOS](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-os-x/#install-mongodb-community-edition)

[mongosh](https://www.mongodb.com/docs/mongodb-shell/reference/editor-mode/)

[what is MVC](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)

[How To Safely Store A Password](https://codahale.com/how-to-safely-store-a-password/)

[URL encode and decode](https://www.cnblogs.com/liuhongfeng/p/5006341.html)

[Uniform Resource Identifier (URI): Generic Syntax](https://www.rfc-editor.org/rfc/rfc3986)

[Plus sign in query string](https://stackoverflow.com/questions/6855624/plus-sign-in-query-string)

## further

- encryption

## issue

- lint-staged ignores tsconfig.json when it called through husky hooks

  https://github.com/okonet/lint-staged/issues/825

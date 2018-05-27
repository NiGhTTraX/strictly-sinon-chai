[![Build Status](https://travis-ci.com/NiGhTTraX/strictly-sinon-chai.svg?branch=master)](https://travis-ci.com/NiGhTTraX/strictly-sinon-chai)
[![codecov](https://codecov.io/gh/NiGhTTraX/strictly-sinon-chai/branch/master/graph/badge.svg)](https://codecov.io/gh/NiGhTTraX/strictly-sinon-chai)

> A statically typed subset of [sinon-chai](https://github.com/domenic/sinon-chai)
assertions written in TypeScript to be used with
[strictly-chai](https://github.com/NiGhTTraX/strictly-chai).


## Usage

```ts
import { extend } from 'strictly-chai/dist/src/extend';
import sinonChai form 'strictly-sinon-chai';
import { spy } from 'sinon';

const expect = extend(sinonChai);

expect(spy()).to.have.been.called();

// TS2339: Property 'have' does not exist on type
// '{ equal: (expected: () => void) => void; not: {... 
expect(() => {}).to.have.been.called();
```

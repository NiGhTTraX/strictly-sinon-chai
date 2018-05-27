import { SinonSpy } from 'sinon';
import { Plugin } from 'strictly-chai/dist/src/extend';

// This has no default export.
const sinonChai = require('sinon-chai');

export interface SinonExpect {
  to: {
    not: {
      have: {
        been: {
          called: () => void;
          calledWith: (...args: any[]) => void;
        }
      }
    }
    have: {
      been: {
        called: () => void;
        calledWith: (firstArg: any, ...args: any[]) => void;
      }
    }
  }
}

const isSpy = (actual: SinonSpy | any): actual is SinonSpy =>
  (actual as SinonSpy).called !== undefined;

const plugin: Plugin<SinonSpy, SinonExpect> = chai => {
  chai.use(sinonChai);
  const { expect } = chai;

  function sinonExpect(actual: SinonSpy): SinonExpect {
    return {
      to: {
        not: {
          have: {
            been: {
              called: () => {
                // eslint-disable-next-line no-unused-expressions
                expect(actual).to.not.have.been.called;
              },
              calledWith: (...args: any[]) => {
                expect(actual).to.not.have.been.calledWith(...args);
              }
            }
          }
        },
        have: {
          been: {
            called: () => {
              // eslint-disable-next-line no-unused-expressions
              expect(actual).to.have.been.called;
            },
            calledWith: (...args: any[]) => {
              expect(actual).to.have.been.calledWith(...args);
            }
          }
        }
      }
    };
  }

  return { expect: sinonExpect, isType: isSpy };
};

export default plugin;

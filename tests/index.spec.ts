import * as chai from 'chai';
import { spy } from 'sinon';
import sinonPlugin from '../src';
import expectTypeErrors from './type-safety';

const { expect } = chai;

describe('Sinon expect', function () {
  const plugin = sinonPlugin(chai);
  const { expect: sinonExpect, isType: isSpy } = plugin;

  it('isSpy', function () {
    expect(isSpy({})).to.be.false;
    expect(isSpy(spy())).to.be.true;
    const calledSpy = spy();
    calledSpy();
    expect(isSpy(calledSpy)).to.be.true;
  });

  it('called', function () {
    const appleSpie = spy();

    sinonExpect(appleSpie).to.not.have.been.called();
    expect(() => sinonExpect(appleSpie).to.have.been.called()).to.throw();

    appleSpie();

    sinonExpect(appleSpie).to.have.been.called();
    expect(() => sinonExpect(appleSpie).to.not.have.been.called()).to.throw();
  });

  it('calledWith', function () {
    const appleSpie = spy();
    appleSpie(1, 2, 3);
    sinonExpect(appleSpie).to.have.been.calledWith(1, 2, 3);
    sinonExpect(appleSpie).to.not.have.been.calledWith(4);
    expect(() => sinonExpect(appleSpie).to.have.been.calledWith(4)).to.throw();
    expect(() => sinonExpect(appleSpie).to.not.have.been.calledWith(1, 2, 3)).to.throw();
  });

  it('should be type safe', function () {
    this.timeout(5 * 1000);

    expectTypeErrors('tests/type-safety/sinon.ts');
  });
});

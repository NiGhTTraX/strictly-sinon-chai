import { spy } from 'sinon';
import * as chai from 'chai';
import plugin from '../../src';

const { expect: sinonExpect } = plugin(chai);
const appleSpie = spy();

sinonExpect(appleSpie).to.have.been.called(true);
sinonExpect(appleSpie).to.have.been.calledWith();

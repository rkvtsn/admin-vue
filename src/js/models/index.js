import ModelApi from './ModelApi';
import Model from './Model';
import ModelBase from './ModelBase';
import ModelValid from './ModelValid';
import Faprika from './Faprika';


const faprika = new Faprika('super-magik-fucking-huli-box-versiya-pervaya');
Object.freeze(faprika);

const models = faprika.models;

export default models;

export {
  Model,
  ModelBase,
  ModelValid,
  ModelApi,
  faprika,
  models
};

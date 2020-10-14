import { celebrate, Segments, Joi } from 'celebrate';

export default celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    gitNamesRepositories: Joi.string().min(3).required(),
  }),
});

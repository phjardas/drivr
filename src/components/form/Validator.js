const STATES = ['error', 'warning', 'success', null];

function maxState(states) {
  const nonEmpty = states.filter(s => s);
  if (!nonEmpty.length) return null;
  return STATES[nonEmpty.map(s => STATES.indexOf(s)).sort()[0]];
}

function combineValidations(validations) {
  const nonEmpty = validations.filter(v => v);
  const state = maxState(nonEmpty.map(v => v.state));
  const messages = nonEmpty.filter(v => v.messages && v.messages.length)
    .map(v => v.messages)
    .reduce((a, b) => [...a, ...b], []);
  return { state, messages };
}

function all(validators) {
  validators.forEach(v => {
    if (typeof v !== 'function') {
      throw new Error('Validator is not a function: ' + v);
    }
  });

  return value => combineValidations(
    validators.map(validator => {
      const { state, message, messages } = validator(value) || {};
      return {
        state,
        messages: messages || (message ? [ message ] : []),
      };
    }).filter(s => s)
  );
}

function required(value) {
  return value ? null : { state: 'error', message: 'required' };
}

export default {
  maxState,
  all,
  combineValidations,
  required,
};

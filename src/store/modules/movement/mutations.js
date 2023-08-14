import types from './types';

export default {
  [types.mutations.SET_MOVEMENTS](state, payload) {
    state.movements = payload;
  },
  [types.mutations.SET_MOVEMENTS_TO_PRINT](state, payload) {
    state.movementsToPrint = payload;
  },
  [types.mutations.SET_GENERATED_MOVEMENT_DATA](state, payload) {
    state.generatedMovementData = payload;
  },
  [types.mutations.SET_TICKETS_TO_GENERATE](state, payload) {
    state.ticketsToGenerate = payload;
  },
  [types.mutations.SET_STATUS](state, payload) {
    state.status = payload;
  },
  [types.mutations.SET_RESPONSE_MESSAGES](state, payload) {
    state.responseMessages = payload;
  },
};

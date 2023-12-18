export default {
  PATH: '@module/movement',
  actions: {
    LIST_MOVEMENTS: '@actions/listMovements',
    GET_TICKETS_TO_GENERATE: '@actions/getTicketsToGenerate',
    GENERATE_MOVEMENTS: '@actions/generateMovements',
    DELETE_MOVEMENT: '@actions/deleteMovement',
    PRINT_MOVEMENT: '@actions/printMovement',
    GENERATE_PRINT_DOCUMENT: '@actions/generatePrintDocument',
    GENERATE_PRINT_SQL_DELETE: '@actions/generatePrintSQLDelete',
  },
  getters: {
  },
  mutations: {
    SET_MOVEMENTS: '@mutations/movements',
    SET_TICKETS_TO_GENERATE: '@mutations/setTicketsToGenerate',
    SET_MOVEMENTS_TO_PRINT: '@mutations/setMovementsToPrint',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
    SET_GENERATED_MOVEMENT_DATA: '@mutations/setGeneratedMovementData',
  },
};

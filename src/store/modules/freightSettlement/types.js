export default {
  PATH: '@module/freightSettlement',
  actions: {
    LIST_FREIGHT_SETTLEMENTS: '@actions/listFreightSettlements',
    GET_FREIGHT_SETTLEMENT: '@actions/getFreightSettlement',
    GET_TICKETS_TO_SETTLE: '@actions/getTicketsToSettle',
    SETTLE_TICKETS: '@actions/settleTickets',
    ADD_SETTLEMENT_INFORMATION: '@actions/addSettlementInformation',
    PRINT_SETTLEMENT: '@actions/printSettlement',
    GENERATE_PRINT_DOCUMENT: '@actions/generatePrintDocument',
  },
  getters: {
  },
  mutations: {
    SET_FREIGHT_SETTLEMENTS: '@mutations/setFreightSettlements',
    SET_FREIGHT_SETTLEMENT: '@mutations/setFreightSettlement',
    SET_TICKETS_TO_SETTLE: '@mutations/setTicketsToSettle',
    SET_SETTLEMENT_TO_PRINT: '@mutations/setSettlementToPrint',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};

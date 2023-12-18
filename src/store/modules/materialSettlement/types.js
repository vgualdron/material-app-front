export default {
  PATH: '@module/materialSettlement',
  actions: {
    LIST_MATERIAL_SETTLEMENTS: '@actions/listMaterialSettlements',
    GET_MATERIAL_SETTLEMENT: '@actions/getMaterialSettlement',
    GET_TICKETS_TO_SETTLE: '@actions/getTicketsToSettle',
    SETTLE_TICKETS: '@actions/settleTickets',
    VALIDATE_MOVEMENTS: '@actions/validateMovements',
    ADD_SETTLEMENT_INFORMATION: '@actions/addSettlementInformation',
    PRINT_SETTLEMENT: '@actions/printSettlement',
    GENERATE_PRINT_DOCUMENT: '@actions/generatePrintDocument',
    GET_SETTLED_TICKETS: '@actions/getSettledTickets',
    UPDATE_MATERIAL_SETTLEMENT: '@actions/updateMaterialSettlement',
    DELETE_MATERIAL_SETTLEMENT: '@actions/deleteMaterialSettlement',
  },
  getters: {
  },
  mutations: {
    SET_MATERIAL_SETTLEMENTS: '@mutations/setMaterialSettlements',
    SET_MATERIAL_SETTLEMENT: '@mutations/setMaterialSettlement',
    SET_TICKETS_TO_SETTLE: '@mutations/setTicketsToSettle',
    SET_MOVEMENTS: '@mutations/setMovements',
    SET_SETTLEMENT_TO_PRINT: '@mutations/setSettlementToPrint',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};

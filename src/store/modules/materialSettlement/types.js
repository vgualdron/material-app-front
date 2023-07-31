export default {
  PATH: '@module/materialSettlement',
  actions: {
    LIST_MATERIAL_SETTLEMENTS: '@actions/listMaterialSettlements',
    GET_MATERIAL_SETTLEMENT: '@actions/getMaterialSettlement',
    GET_TICKETS_TO_SETTLE: '@actions/getTicketsToSettle',
    SETTLE_TICKETS: '@actions/settleTickets',
    ADD_SETTLEMENT_INFORMATION: '@actions/addSettlementInformation',
  },
  getters: {
  },
  mutations: {
    SET_MATERIAL_SETTLEMENTS: '@mutations/setMaterialSettlements',
    SET_MATERIAL_SETTLEMENT: '@mutations/setMaterialSettlement',
    SET_TICKETS_TO_SETTLE: '@mutations/setTicketsToSettle',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};

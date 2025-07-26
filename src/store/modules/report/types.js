export default {
  PATH: '@module/report',
  actions: {
    GET_MOVEMENTS: '@actions/getMovements',
    GET_YARD_STOCK: '@actions/getYardStock',
    GET_PRODUCTION: '@actions/getProduction',
    GET_COMPLETE_TRANSFERS: '@actions/getCompleteTransfers',
    GET_UNCOMPLETE_TRANSFERS: '@actions/getUncompleteTransfers',
    GET_UNBILLED_PURCHASES: '@actions/getUnbilledPurchases',
    GET_UNBILLED_SALES: '@actions/getUnbilledSales',
    GET_UNBILLED_FREIGHTS: '@actions/getUnbilledFreights',
    GENERATE_PRINT_DOCUMENT: '@actions/generatePrintDocument',
  },
  getters: {
  },
  mutations: {
    SET_REPORTS: '@mutations/setReports',
    SET_STATUS: '@mutations/setStatus',
    SET_RESPONSE_MESSAGES: '@mutations/setResponseMessages',
  },
};

import {
  listTickets,
  saveTicket,
  getTicket,
  updateTicket,
  deleteTicket,
} from '../../helpers/localTicket';

export default {
  list: () => listTickets(),
  get: (id) => getTicket(id),
  save: (data) => saveTicket(data),
  update: (data) => updateTicket(data),
  delete: (id) => deleteTicket(id),
};

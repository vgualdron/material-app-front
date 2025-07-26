import common, { name as commonName } from './common';
import zone, { name as zoneName } from './zone';
import role, { name as roleName } from './role';
import permission, { name as permissionName } from './permission';
import yard, { name as yardName } from './yard';
import user, { name as userName } from './user';
import home, { name as homeName } from './home';
import material, { name as materialName } from './material';
import third, { name as thirdName } from './third';
import adjustment, { name as adjustmentName } from './adjustment';
import rate, { name as rateName } from './rate';
import localDataManagement, { name as localDataManagementName } from './localDataManagement';
import synchronization, { name as synchronizationName } from './synchronization';
import localTicket, { name as localTicketName } from './localTicket';
import ticket, { name as ticketName } from './ticket';
import materialSettlement, { name as materialSettlementName } from './materialSettlement';
import freightSettlement, { name as freightSettlementName } from './freightSettlement';
import movement, { name as movementName } from './movement';
import report, { name as reportName } from './report';
import batterie, { name as batterieName } from './batterie';
import oven, { name as ovenName } from './oven';
import production, { name as productionName } from './production';

export default {
  [homeName]: home,
  [commonName]: common,
  [zoneName]: zone,
  [roleName]: role,
  [permissionName]: permission,
  [yardName]: yard,
  [userName]: user,
  [materialName]: material,
  [thirdName]: third,
  [adjustmentName]: adjustment,
  [rateName]: rate,
  [localDataManagementName]: localDataManagement,
  [synchronizationName]: synchronization,
  [localTicketName]: localTicket,
  [ticketName]: ticket,
  [materialSettlementName]: materialSettlement,
  [freightSettlementName]: freightSettlement,
  [movementName]: movement,
  [reportName]: report,
  [batterieName]: batterie,
  [ovenName]: oven,
  [productionName]: production,
};

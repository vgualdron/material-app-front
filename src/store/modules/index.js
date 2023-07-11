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
import localeTicket, { name as localeTicketName } from './localeTicket';

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
  [localeTicketName]: localeTicket,
};

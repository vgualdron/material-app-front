export default function () {
  return {
    statusSign: false,
    permissions: localStorage.getItem('permissionsMC') ? JSON.parse(localStorage.getItem('permissionsMC')) : [],
    responseMessages: [],
    menu: localStorage.getItem('menuMC') ? JSON.parse(localStorage.getItem('menuMC')) : [],
    yard: localStorage.getItem('yardMC') ? localStorage.getItem('yardMC') : 0,
    currentYard: localStorage.getItem('currentYardMC') ? localStorage.getItem('currentYardMC') : 0,
    listYards: localStorage.getItem('listYardsMC') ? localStorage.getItem('listYardsMC') : 0,
    document: localStorage.getItem('documentMC') ? localStorage.getItem('documentMC') : '',
    name: localStorage.getItem('nameMC') ? localStorage.getItem('nameMC') : '',
    token: localStorage.getItem('tokenMC') ? localStorage.getItem('tokenMC') : '',
    roles: localStorage.getItem('rolesMC') ? JSON.parse(localStorage.getItem('rolesMC')) : '',
    user: localStorage.getItem('userMC') ? JSON.parse(localStorage.getItem('userMC')) : '',
  };
}

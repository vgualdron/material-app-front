const routes = [
  {
    path: '/',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', name: 'Iniciar Sesión', component: () => import('pages/Login.vue') },
    ],
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Inicio', component: () => import('pages/Home.vue') },
    ],
  },
  {
    path: '/zone',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Zonas', component: () => import('pages/Zone.vue') },
    ],
  },
  {
    path: '/role',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Roles', component: () => import('pages/Role.vue') },
    ],
  },
  {
    path: '/yard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Patios', component: () => import('pages/Yard.vue') },
    ],
  },
  {
    path: '/user',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Usuarios', component: () => import('pages/User.vue') },
    ],
  },
  {
    path: '/material',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Materiales', component: () => import('pages/Material.vue') },
    ],
  },
  {
    path: '/third',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Terceros', component: () => import('pages/Third.vue') },
    ],
  },
  {
    path: '/adjustment',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Ajustes', component: () => import('pages/Adjustment.vue') },
    ],
  },
  {
    path: '/rate',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Tarifas', component: () => import('pages/Rate.vue') },
    ],
  },
  {
    path: '/localTicket',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Tiquetes (Offline)', component: () => import('src/pages/LocalTicket.vue') },
    ],
  },
  {
    path: '/ticket',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Administración de Tiquetes (Solo Administradores)', component: () => import('src/pages/Ticket.vue') },
    ],
  },
  {
    path: '/materialSettlement',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Liquidación (Material)', component: () => import('src/pages/MaterialSettlement.vue') },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;

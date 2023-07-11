<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Iniciar Sesión
        </q-toolbar-title>
        <div>Control de Materiales</div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'LoginLayout',
  components: {
  },
  data() {
    return {
    };
  },
};
</script>

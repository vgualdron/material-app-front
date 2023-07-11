<template>
  <q-page class="">
    <table-users />
  </q-page>
</template>

<script>
import TableUsers from 'components/user/TableUsers.vue';

export default {
  components: { TableUsers },
  data() {
    return {
    };
  },
  name: 'PageUser',
};
</script>

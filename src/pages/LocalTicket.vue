<template>
  <q-page class="">
    <table-local-tickets />
  </q-page>
</template>

<script>
import TableLocalTickets from 'components/localTicket/TableLocalTickets.vue';

export default {
  components: { TableLocalTickets },
  data() {
    return {
    };
  },
  name: 'PageLocalTicket',
  computed: {
  },
};
</script>

<template>
  <q-page class="">
    <table-tickets />
  </q-page>
</template>

<script>
import TableTickets from 'components/ticket/TableTickets.vue';

export default {
  components: { TableTickets },
  data() {
    return {
    };
  },
  name: 'PageTicket',
  computed: {
  },
};
</script>

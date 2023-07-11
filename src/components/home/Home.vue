<template>
  <div class="q-pa-md" style="max-width: 400px; margin: auto;">
    <q-card class="my-card" flat bordered>
      <h5>Main</h5>
    </q-card>
  </div>
</template>
<script>

export default {
  data() {
    return {};
  },
  computed: {},
  mounted() {
    this.validateLogin();
  },
  methods: {
    validateLogin() {
      if (localStorage.getItem('tokenMC')) {
        console.log('sincronizando');
      } else {
        this.$router.push('/');
      }
    },
  },
};
</script>

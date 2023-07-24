<template>
  <div class="q-pa-md" justify-center items-center>
    <div
      class="row justify-center"
    >
      <q-img
        src="~/assets/logo-rectangle.png" width="300px"
      />
    </div>
    <!-- <div
      class="row justify-center q-mt-md"
    >
      <q-btn
        class="q-mb-sm"
        color="grey-4"
        text-color="green"
        unelevated
        icon-right="sync"
        label="Sincronizar"
        size="xl"
        @click="synchronize"
      />
    </div> -->
  </div>
</template>
<script>

/*  import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission'; */

export default {
  data() {
    return {};
  },
  props: [],
  computed: {},
  mounted() {
    this.validateLogin();
  },
  methods: {
    validateLogin() {
      if (!localStorage.getItem('tokenMC')) {
        this.$router.push('/');
      }
    },
    /* synchronize() {
      this.$root.$emit('synchronize');
      // this.synchronizeRef();
    }, */
  },
};
</script>

<template>
  <div class="q-pa-md" justify-center items-center>
      <center>
        <q-btn
          class="q-mb-sm"
          color="grey-4"
          text-color="green"
          unelevated
          icon-right="sync"
          label="Sincronizar"
          size="xl"
        />
      </center>
      <q-img
        src="~/assets/flame-logo.png"
      />
  </div>
</template>
<script>

import { mapState, mapActions } from 'vuex';
import localDataManagementTypes from '../../store/modules/localDataManagement/types';
/*  import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission'; */

export default {
  data() {
    return {};
  },
  computed: {
    ...mapState(localDataManagementTypes.PATH, [
      'status',
      'responseMessages',
    ]),
  },
  mounted() {
    this.validateLogin();
  },
  methods: {
    ...mapActions(localDataManagementTypes.PATH, {
      getData: localDataManagementTypes.actions.GET_DATA,
      setData: localDataManagementTypes.actions.SET_DATA,
    }),
    validateLogin() {
      if (localStorage.getItem('tokenMC')) {
        this.getData();
        // console.log('sincronizando');
      } else {
        this.$router.push('/');
      }
    },
  },
};
</script>

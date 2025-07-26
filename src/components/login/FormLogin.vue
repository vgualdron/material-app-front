<template>
  <div class="q-pa-md" style="max-width: 400px; margin: auto;">
    <q-card class="my-card" flat bordered>
      <q-card-section horizontal>
        <img src="~/assets/logo-circle.png" width="200" class="q-mx-auto q-my-md">
      </q-card-section>
      <q-separator />
      <q-card-section horizontal>
        <q-card-section class="col-12">
          <q-form
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-md"
          >
            <q-input
              outlined
              v-model.trim="documentNumber"
              label="Documento *"
              hint="Escriba su número de documento"
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Este campo es obligatorio']"
            />
            <q-input
              outlined
              v-model.trim="password"
              label="Contraseña *"
              hint="Escriba la contraseña"
              type="password"
              lazy-rules
              :rules="[val => val && val.length > 0 || 'Este campo es obligatorio']"
            />
            <div class="row text-center">
              <q-btn
                label="Entrar"
                type="submit"
                color="primary"
                :loading="isLoading"
                class="col"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import commonTypes from '../../store/modules/common/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';

export default {
  data() {
    return {
      documentNumber: null,
      password: null,
      isLoading: false,
    };
  },
  computed: {
    ...mapState(commonTypes.PATH, [
      'statusSign',
      'responseMessages',
    ]),
  },
  created() {
    this.validateLogin();
  },
  methods: {
    ...mapActions(commonTypes.PATH, {
      signin: commonTypes.actions.SIGN_IN,
    }),
    async onSubmit() {
      showLoading('Iniciando sesión ...', 'Por favor, espere', true);
      const data = {
        documentNumber: this.documentNumber,
        password: this.password,
      };
      await this.signin(data);
      this.isLoading = false;
      if (this.statusSign === false) {
        showNotifications(this.responseMessages, this.statusSign, 'top-right', 5000);
        this.$q.loading.hide();
      } else {
        this.$q.loading.hide();
        this.$router.push('/home');
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    },
    onReset() {
      this.documentNumber = null;
      this.password = null;
    },
    validateLogin() {
      if (localStorage.getItem('tokenMC')) {
        this.$router.push('/home');
      }
    },
  },
};
</script>
<style scoped>
  .my-card {
    width: 100%;
    max-width: 450px;
  }
</style>

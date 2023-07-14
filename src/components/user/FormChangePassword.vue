<template>
  <div class="q-pa-md">
    <q-dialog
      v-model="modal.show"
      persistent
    >
      <q-card
        style="width: 500px; max-width: 80vw;"
      >
        <q-card-section class="row items-center">
          <div class="text-h6">{{modal.title}}</div>
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
            @click="modal.show = false"
          />
        </q-card-section>
        <q-separator />
        <q-card-section
          style="max-height: 60vh"
          class="scroll"
        >
          <q-form
            @submit="onSubmit"
            class="q-gutter-md"
            autocomplete="off"
          >
            <q-input
              type="password"
              outlined
              v-model.trim="password"
              label="Contraseña"
              lazy-rules
              hide-bottom-space
              :rules="rules.password"
            />
            <q-input
              type="password"
              outlined
              v-model.trim="confirmPassword"
              label="Confirmar contraseña"
              lazy-rules
              hide-bottom-space
              :rules="rules.confirmPassword"
            />
            <q-separator />
            <div class="row text-center">
              <q-btn label="cancelar"
                type="reset"
                color="primary"
                outline class="col"
                v-close-popup
                @click="modal.show = false"
              />
              <q-btn
                label="Aceptar"
                type="submit"
                color="primary"
                class="col q-ml-sm"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import userTypes from '../../store/modules/user/types';
import commonTypes from '../../store/modules/common/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';

export default {
  data() {
    return {
      modal: {
        show: false,
        title: 'Actualizar Perfil',
      },
      password: '',
      confirmPassword: '',
      rules: {
        password: [
          (val) => !!val || 'Debe ingresar una contraseña',
          (val) => val.length >= 5 || 'La contraseña debe tener un mínimo de 5 caracteres',
          (val) => val.length <= 20 || 'La contraseña debe tener un máximo de 20 caracteres',
        ],
        confirmPassword: [
          (val) => !!val || 'Debe ingresar una confirmación de contraseña',
          (val) => (val === this.password) || 'La confirmación no coincide con la contraseña',
        ],
      },
    };
  },
  props: [
    'showNotificationsRef',
  ],
  computed: {
    ...mapState(userTypes.PATH, [
      'status',
      'responseMessages',
    ]),
    ...mapState(commonTypes.PATH, [
      'user',
    ]),
  },
  methods: {
    ...mapActions(userTypes.PATH, {
      updateProfile: userTypes.actions.UPDATE_PROFILE,
    }),
    async onSubmit() {
      showLoading('Actualizando Perfil ...', 'Por favor, espere', true);
      await this.updateProfile({
        id: this.user,
        password: this.password,
        confirmPassword: this.confirmPassword,
      });
      this.$q.loading.hide();
      if (this.status === true) {
        this.showNotificationsRef(this.responseMessages, this.status, 'top-right', 5000);
        this.modal.show = false;
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      }
    },
    showModal() {
      this.password = '';
      this.confirmPassword = '';
      this.modal.show = true;
      this.$q.loading.hide();
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>

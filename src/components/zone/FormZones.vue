<template>
  <div class="q-pa-md">
    <q-dialog
      v-model="modal.show"
      persistent
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ modal.title }}</div>
          <q-space />
          <q-btn
            icon="close"
            flat
            round
            dense
            v-close-popup
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
          >
            <q-input
              v-model.trim="zone.code"
              label="Código"
              outlined
              lazy-rules
              :rules="rules.code"
              :disable="disableInputs"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model.trim="zone.name"
              label="Nombre *"
              lazy-rules
              :rules="rules.name"
              :disable="disableInputs"
              hide-bottom-space
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
import zoneTypes from '../../store/modules/zone/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';

export default {
  data() {
    return {
      modal: {
        show: false,
        title: '',
        type: '',
      },
      isLoading: false,
      zone: {
        id: null,
        code: '',
        name: '',
      },
      rules: {
        code: [
          (val) => (!!val) || 'El código es requerido',
          (val) => (val.length >= 2) || 'El código debe tener un mínimo de 2 caracteres',
          (val) => (val.length <= 10) || 'El código debe tener un máximo de 10 caracteres',
        ],
        name: [
          (val) => (!!val) || 'El nombre es requerido',
          (val) => (val.length >= 4) || 'El nombre debe tener un mínimo de 4 caracteres',
          (val) => (val.length <= 30) || 'El nombre debe tener un máximo de 30 caracteres',
        ],
      },
    };
  },
  props: [
    'showNotificationsRef',
    'listZonesMountedRef',
  ],
  computed: {
    ...mapState(zoneTypes.PATH, [
      'status',
      'responseMessages',
    ]),
    disableInputs() {
      return this.modal.type === 'D';
    },
  },
  methods: {
    ...mapActions(zoneTypes.PATH, {
      saveZone: zoneTypes.actions.SAVE_ZONE,
      updateZone: zoneTypes.actions.UPDATE_ZONE,
      deleteZone: zoneTypes.actions.DELETE_ZONE,
    }),
    async onSubmit() {
      if (this.modal.type === 'C') {
        showLoading('Guardando Zona ...', 'Por favor, espere', true);
        await this.saveZone(this.zone);
      } else if (this.modal.type === 'E') {
        showLoading('Actualizando Zona ...', 'Por favor, espere', true);
        await this.updateZone(this.zone);
      } else if (this.modal.type === 'D') {
        showLoading('Eliminando Zona ...', 'Por favor, espere', true);
        await this.deleteZone(this.zone.id);
      }
      if (this.status === true) {
        this.showNotificationsRef(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
        this.zone.id = null;
        this.zone.code = '';
        this.zone.name = '';
        this.listZonesMountedRef();
        this.modal.show = false;
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
      }
    },
    showModal(id, zone, type) {
      this.zone.id = id !== null ? id : null;
      this.zone.code = id !== null ? zone.code : '';
      this.zone.name = id !== null ? zone.name : '';
      this.modal.title = type === 'C' ? 'Agregar Zona' : (type === 'E' ? 'Editar Zona' : 'Eliminar Zona');
      this.modal.type = type;
      this.modal.show = true;
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>

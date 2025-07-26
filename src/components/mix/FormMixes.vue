<template>
  <div class="q-pa-md">
    <q-dialog v-model="modal.show" persistent>
      <q-card style="width: 900px; max-width: 90vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ modal.title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-separator />
        <q-card-section style="max-height: 70vh" class="scroll">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input outlined label="Fecha *" v-model="mix.date" :rules="rules.date" />
            <q-select outlined label="Planta *" v-model="mix.yard" :options="yards" option-label="name"
              option-value="id" :rules="rules.yard" />
            <q-input outlined label="Material *" v-model="mix.material" :rules="rules.material" />
            <q-input outlined label="Cantidad *" v-model="mix.amount" :rules="rules.amount" />
            <q-select outlined label="Tipo *" v-model="mix.type" :options="types" option-label="name"
              option-value="id" :rules="rules.type" />
            <q-separator />
            <div class="row text-center">
              <q-btn label="Cancelar" type="reset" color="primary" outline class="col" v-close-popup
                @click="modal.show = false" />
              <q-btn label="Aceptar" type="submit" color="primary" class="col q-ml-sm" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import adjustmentTypes from '../../store/modules/adjustment/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { validateDate } from '../../helpers/validateDate';

export default {
  data() {
    return {
      modal: {
        show: false,
        title: '',
        type: '',
      },
      mix: {
        id: null,
        date: '',
        yard: null,
        material: '',
        amount: '',
        type: null,
      },
      rules: {
        date: [
          (val) => (!!val) || 'La fecha es requerida',
          (val) => (validateDate(val) === true) || 'La fecha ingresada no es válida',
        ],
        yard: [
          (val) => (!!val) || 'La planta es requerida',
        ],
        material: [
          (val) => (!!val) || 'El material es requerido',
        ],
        amount: [
          (val) => (!!val) || 'La cantidad es requerida',
        ],
        type: [
          (val) => (!!val) || 'El tipo es requerido',
        ],
      },
      yards: [],
      types: [],
    };
  },
  props: [
    'showNotificationsRef',
    'listMixesMountedRef',
  ],
  computed: {
    ...mapState(adjustmentTypes.PATH, [
      'status',
      'responseMessages',
    ]),
  },
  methods: {
    ...mapActions(adjustmentTypes.PATH, {
      saveMix: adjustmentTypes.actions.SAVE_ADJUSTMENT,
      updateMix: adjustmentTypes.actions.UPDATE_ADJUSTMENT,
      deleteMix: adjustmentTypes.actions.DELETE_ADJUSTMENT,
      getMix: adjustmentTypes.actions.GET_ADJUSTMENT,
    }),
    async onSubmit() {
      showLoading('Procesando...', 'Por favor, espere', true);
      if (this.modal.type === 'C') {
        await this.saveMix(this.mix);
      } else if (this.modal.type === 'E') {
        await this.updateMix(this.mix);
      } else if (this.modal.type === 'D') {
        await this.deleteMix(this.mix.id);
      }
      if (this.status === true) {
        this.showNotificationsRef(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
        this.resetForm();
        this.listMixesMountedRef();
        this.modal.show = false;
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
      }
    },
    async showModal(id, mix, type) {
      if (mix) {
        this.mix = { ...mix };
      }
      try {
        if (id !== null) {
          await this.getMix(id);
          if (this.status === true) {
            this.mix = { ...this.mix };
          }
        } else {
          this.resetForm();
        }
        this.modal.title = type === 'C' ? 'Agregar Mezcla' : (type === 'E' ? 'Editar Mezcla' : 'Eliminar Mezcla');
        this.modal.type = type;
        this.modal.show = true;
      } catch (error) {
        console.error(`Error en showModal: ${error}`);
      } finally {
        this.$q.loading.hide();
      }
    },
    resetForm() {
      this.mix = {
        id: null,
        date: '',
        yard: null,
        material: '',
        amount: '',
        type: null,
      };
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>

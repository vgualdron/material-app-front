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
            <q-input outlined label="Fecha de Cargue *" v-model="production.date" :rules="rules.date"
              :readonly="modal.type === 'D'" />
            <q-input outlined label="Fecha de Descargue *" v-model="production.date_download"
              :rules="rules.date_download" :readonly="modal.type === 'D'" />
            <q-select outlined label="Horno *" v-model="production.oven" :options="ovens" option-label="name"
              option-value="id" :rules="rules.oven" :readonly="modal.type === 'D'" />
            <q-input outlined label="Eficiencia *" v-model="production.performance" :rules="rules.performance"
            :readonly="modal.type === 'D'" />
            <q-select outlined label="Producto Inicial *" v-model="production.starting" :options="materials"
              option-label="name" option-value="id" :rules="rules.starting" :readonly="modal.type === 'D'" />
            <q-select outlined label="Producto Medio" v-model="production.medium" :options="materials"
              option-label="name" option-value="id" :readonly="modal.type === 'D'" />
            <q-select outlined label="Producto Final *" v-model="production.finished" :options="materials"
              option-label="name" option-value="id" :rules="rules.finished" :readonly="modal.type === 'D'" />
            <q-input outlined label="Capacidad" v-model="production.capacity" :readonly="modal.type === 'D'" />
            <q-input outlined label="Performance Ton" v-model="production.performance_ton"
            :readonly="modal.type === 'D'" />
            <q-input outlined label="Horas" v-model="production.hours" :readonly="modal.type === 'D'" />
            <q-separator />
            <div class="row text-center">
              <q-btn label="Cancelar" type="reset" color="primary" outline class="col" v-close-popup
                @click="modal.show = false" />
              <q-btn label="Aceptar" type="submit" color="primary" class="col q-ml-sm"
                @click="onSubmit"
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
import productionTypes from '../../store/modules/production/types';
import ovenTypes from '../../store/modules/oven/types'; // Importa ovenTypes
import materialTypes from '../../store/modules/material/types'; // Importa materialsTypes
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
      production: {
        id: null,
        date: '',
        date_download: '',
        oven: null,
        performance: '',
        starting: null,
        medium: null,
        finished: null,
        capacity: '',
        performance_ton: '',
        hours: '',
        finalized: false,
      },
      rules: {
        date: [
          (val) => (!!val) || 'La fecha de cargue es requerida',
          (val) => (validateDate(val) === true) || 'La fecha ingresada no es válida',
        ],
        date_download: [
          (val) => (!!val) || 'La fecha de descargue es requerida',
          (val) => (validateDate(val) === true) || 'La fecha ingresada no es válida',
        ],
        oven: [
          (val) => (!!val) || 'El horno es requerido',
        ],
        performance: [
          (val) => (!!val) || 'La eficiencia es requerida',
        ],
        starting: [
          (val) => (!!val) || 'El producto inicial es requerido',
        ],
        finished: [
          (val) => (!!val) || 'El producto final es requerido',
        ],
      },
      ovens: [],
      materials: [],
    };
  },
  props: [
    'showNotificationsRef',
    'listProductionsMountedRef',
  ],
  computed: {
    ...mapState(productionTypes.PATH, [
      'status',
      'responseMessages',
    ]),
  },
  methods: {
    ...mapActions(productionTypes.PATH, {
      saveProduction: productionTypes.actions.SAVE_PRODUCTION,
      updateProduction: productionTypes.actions.UPDATE_PRODUCTION,
      deleteProduction: productionTypes.actions.DELETE_PRODUCTION,
      getProduction: productionTypes.actions.GET_PRODUCTION,
    }),
    ...mapActions(ovenTypes.PATH, { // Usa ovenTypes para las acciones de horno
      listOvens: ovenTypes.actions.LIST_OVENS,
    }),
    ...mapActions(materialTypes.PATH, { // Usa materialsTypes para las acciones de materiales
      listMaterials: materialTypes.actions.LIST_MATERIALS,
    }),
    async onSubmit() {
      showLoading('Procesando...', 'Por favor, espere1', true);
      if (this.modal.type === 'C') {
        await this.saveProduction(this.production);
      } else if (this.modal.type === 'E') {
        await this.updateProduction(this.production);
      } else if (this.modal.type === 'D') {
        // alert('Entrando en onSubmit para eliminar');
        await this.deleteProduction(this.production.id);
      }
      if (this.status === true) {
        this.showNotificationsRef(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
        this.resetForm();
        this.listProductionsMountedRef();
        this.modal.show = false;
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
      }
    },
    async showModal(id, production, type) {
      if (production) {
        this.production = { ...production };
      }
      try {
        // alert('Entrando en showModal');
        await this.listOvens();
        // alert('Después de listOvens');
        await this.listMaterials({ displayAll: 1, id: '0' });
        // alert('Después de listMaterials');
        if (id !== null) {
          await this.getProduction(id);
          // alert('Después de getProduction');
          // alert(JSON.stringify(this.production)); // Verifica el estado de this.production
          this.production = { ...this.production };
        } else {
          this.resetForm();
          // alert('Después de resetForm');
        }
        this.modal.title = type === 'C' ? 'Agregar Producción' : (type === 'E' ? 'Editar Producción' : 'Eliminar Producción');
        this.modal.type = type;
        // alert('Antes de mostrar el modal'); // Verifica el flujo antes de mostrar el modal
        this.modal.show = true;
        // alert('Modal configurado y mostrado');
      } catch (error) {
        // alert(`Error en showModal: ${error}`);
      } finally {
        this.$q.loading.hide(); // Cierra el indicador de carga
      }
    },
    resetForm() {
      this.production = {
        id: null,
        date: '',
        date_download: '',
        oven: null,
        performance: '',
        starting: null,
        medium: null,
        finished: null,
        capacity: '',
        performance_ton: '',
        hours: '',
        finalized: false,
      };
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>

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
              v-model.trim="material.code"
              label="Código"
              outlined
              lazy-rules
              :rules="rules.code"
              :disable="disableInputs"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model.trim="material.name"
              label="Nombre *"
              lazy-rules
              :rules="rules.name"
              :disable="disableInputs"
              hide-bottom-space
            />
            <q-select
              outlined
              label="Unidad *"
              v-model.trim="material.unit"
              :options="units"
              lazy-rules
              :rules="rules.unit"
              hide-bottom-space
              :disable="disableInputs"
              map-options
              emit-value
            />
            <q-checkbox
              left-label
              v-model="material.active"
              text-h6
              color="green"
              :disable="disableInputs"
              label="El material se encuentra activo"
            />
            <q-separator />
            <div class="row text-center">
              <q-btn label="Cancelar"
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
import materialTypes from '../../store/modules/material/types';
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
      material: {
        id: null,
        code: '',
        name: '',
        unit: null,
        active: true,
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
          (val) => (val.length <= 70) || 'El nombre debe tener un máximo de 70 caracteres',
        ],
        unit: [
          (val) => (!!val) || 'La unidad es requerida',
        ],
      },
      units: [
        {
          label: 'Tonelada',
          value: 'T',
        },
        {
          label: 'Unidad',
          value: 'U',
        },
      ],
    };
  },
  props: [
    'showNotificationsRef',
    'listMaterialsMountedRef',
  ],
  computed: {
    ...mapState(materialTypes.PATH, [
      'status',
      'responseMessages',
    ]),
    disableInputs() {
      return this.modal.type === 'D';
    },
  },
  methods: {
    ...mapActions(materialTypes.PATH, {
      saveMaterial: materialTypes.actions.SAVE_MATERIAL,
      updateMaterial: materialTypes.actions.UPDATE_MATERIAL,
      deleteMaterial: materialTypes.actions.DELETE_MATERIAL,
    }),
    async onSubmit() {
      if (this.modal.type === 'C') {
        showLoading('Guardando Material ...', 'Por favor, espere', true);
        await this.saveMaterial(this.material);
      } else if (this.modal.type === 'E') {
        showLoading('Actualizando Material ...', 'Por favor, espere', true);
        await this.updateMaterial(this.material);
      } else if (this.modal.type === 'D') {
        showLoading('Eliminando Material ...', 'Por favor, espere', true);
        await this.deleteMaterial(this.material.id);
      }
      if (this.status === true) {
        this.showNotificationsRef(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
        this.material.id = null;
        this.material.code = '';
        this.material.name = '';
        this.listMaterialsMountedRef();
        this.modal.show = false;
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
      }
    },
    showModal(id, material, type) {
      this.material.id = id !== null ? id : null;
      this.material.code = id !== null ? material.code : '';
      this.material.name = id !== null ? material.name : '';
      this.material.unit = id !== null ? material.unit : null;
      this.material.active = id !== null ? material.active === 1 : true;
      this.modal.title = type === 'C' ? 'Agregar Material' : (type === 'E' ? 'Editar Material' : 'Eliminar Material');
      this.modal.type = type;
      this.modal.show = true;
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>

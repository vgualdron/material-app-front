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
              v-model.trim="yard.code"
              label="Código"
              outlined
              lazy-rules
              :rules="rules.code"
              :disable="disableInputs"
              hide-bottom-space
            />
            <q-input
              outlined
              v-model.trim="yard.name"
              label="Nombre *"
              lazy-rules
              :rules="rules.name"
              :disable="disableInputs"
              hide-bottom-space
            />
            <q-select
              outlined
              v-model="yard.zone"
              class="q-mt-xs"
              use-input
              clearable
              input-debounce="0"
              label="Zona *"
              :disable="disableInputs"
              :options="optionZones"
              @filter="filterZone"
              option-label="name"
              option-value="id"
              map-options
              lazy-rules
              :rules="rules.zone"
              hide-bottom-space
              emit-value
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay coincidencias
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <div class="row">
              <div class="col-12 col-md q-pr-md-xs">
                <q-input
                  type="number"
                  step="0.000001"
                  outlined
                  v-model.trim="yard.longitude"
                  label="Longitud *"
                  :disable="disableInputs"
                  lazy-rules
                  :rules="rules.longitude"
                  hide-bottom-space
                />
              </div>
              <div class="col-12 col-md q-pt-sm-md q-pt-xs-md q-pt-md-none">
                <q-input
                  type="number"
                  step="0.000001"
                  outlined
                  v-model.trim="yard.latitude"
                  label="Latitud *"
                  :disable="disableInputs"
                  lazy-rules
                  :rules="rules.latitude"
                  hide-bottom-space
                />
              </div>
            </div>
            <q-checkbox
              :disable="disableInputs"
              left-label
              v-model="yard.active"
              text-h6
              color="green"
              label="El patio se encuentra activo"
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
import yardTypes from '../../store/modules/yard/types';
import zoneTypes from '../../store/modules/zone/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { removeAccents } from '../../helpers/removeAccents';

export default {
  data() {
    return {
      modal: {
        show: false,
        title: '',
        type: '',
      },
      isLoading: false,
      yard: {
        id: null,
        code: '',
        name: '',
        zone: null,
        longitude: '',
        latitude: '',
        active: true,
      },
      optionZones: [],
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
        zone: [
          (val) => (!!val) || 'La zona es requerida',
        ],
        longitude: [
          (val) => ((val === null || val.length === 0) || (((/^(-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|[0-1][0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/).test(val)) === true)) || 'El formato de la longitud no es válido',
        ],
        latitude: [
          (val) => ((val === null || val.length === 0) || (((/^(-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/).test(val)) === true)) || 'El formato de la latitud no es válido',
        ],
      },
    };
  },
  props: [
    'showNotificationsRef',
    'listYardsMountedRef',
  ],
  watch: {
    zones(val) {
      this.optionZones = [...val];
    },
  },
  computed: {
    ...mapState(yardTypes.PATH, [
      'status',
      'responseMessages',
    ]),
    ...mapState(zoneTypes.PATH, {
      zones: 'zones',
      zoneStatus: 'status',
      zoneResponseMessages: 'responseMessages',
    }),
    disableInputs() {
      return this.modal.type === 'D';
    },
  },
  methods: {
    ...mapActions(yardTypes.PATH, {
      saveYard: yardTypes.actions.SAVE_YARD,
      updateYard: yardTypes.actions.UPDATE_YARD,
      deleteYard: yardTypes.actions.DELETE_YARD,
    }),
    ...mapActions(zoneTypes.PATH, {
      listZones: zoneTypes.actions.LIST_ZONES,
    }),
    async onSubmit() {
      if (this.modal.type === 'C') {
        showLoading('Guardando Patio ...', 'Por favor, espere', true);
        await this.saveYard(this.yard);
      } else if (this.modal.type === 'E') {
        showLoading('Actualizando Patio ...', 'Por favor, espere', true);
        await this.updateYard(this.yard);
      } else if (this.modal.type === 'D') {
        showLoading('Eliminando Patio ...', 'Por favor, espere', true);
        await this.deleteYard(this.yard.id);
      }
      if (this.status === true) {
        this.showNotificationsRef(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
        this.yard.id = null;
        this.yard.code = '';
        this.yard.name = '';
        this.listYardsMountedRef();
        this.modal.show = false;
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
      }
    },
    async showModal(id, yard, type) {
      await this.listZones();
      if (this.zoneStatus === true) {
        this.yard.id = id !== null ? id : null;
        this.yard.code = id !== null ? yard.code : '';
        this.yard.name = id !== null ? yard.name : '';
        this.yard.zone = id !== null ? yard.zone : [];
        this.yard.longitude = id !== null ? yard.longitude : '';
        this.yard.latitude = id !== null ? yard.latitude : '';
        this.yard.active = id !== null ? yard.active === 1 : true;
        this.modal.title = type === 'C' ? 'Agregar Patio' : (type === 'E' ? 'Editar Patio' : 'Eliminar Patio');
        this.modal.type = type;
        this.$q.loading.hide();
        this.modal.show = true;
      } else {
        this.$q.loading.hide();
        this.showNotificationsRef(this.zoneResponseMessages, this.permissionStatus, 'top-right', 5000);
      }
    },
    filterZone(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionZones = this.zones.filter((option) => removeAccents(option.name).toLowerCase().indexOf(needle) > -1);
      });
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>

<template>
  <div class="q-pa-md">
    <q-dialog
      v-model="modal.show"
      persistent
    >
      <q-card style="width: 95vw; max-width: 95vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Liquidar Materiales</div>
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
          style="max-height: 85vh"
          class="scroll"
        >
          <div class="row">
            <q-toggle
              size="md"
              v-model="showFilter"
              checked-icon="visibility"
              color="green"
              label="Ver filtro"
              unchecked-icon="visibility_off"
            />
          </div>
          <q-form
            @submit="onSubmit"
            class="q-gutter-md"
          >
            <div class="row">
              <div
                class="col col-md-4 col-lg-4 col-xl-4 col-sm-12 col-xs-12 q-pr-md-xs"
              >
                <q-select
                  outlined
                  label="Tipo"
                  v-model="filter.type"
                  :options="types"
                  hide-bottom-space
                  lazy-rules
                  :rules="rules.type"
                  map-options
                  emit-value
                />
              </div>
              <div
                class="col col-md-4 col-lg-4 col-xl-4 col-sm-12 col-xs-12 q-pr-md-xs q-pl-md-xs q-pt-sm-xs q-pt-xs-xs q-pt-md-none"
              >
                <q-input
                  outlined
                  label="Fecha Inicio"
                  :disable="disableInputs"
                  v-model="filter.startDate"
                  :rules="rules.startDate"
                  hide-bottom-space
                  clearable
                  mask="##/##/####"
                >
                  <template v-slot:append>
                    <q-icon
                      name="event"
                      class="cursor-pointer"
                    >
                      <q-popup-proxy
                        ref="qStartDateProxy"
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="filter.startDate"
                          mask="DD/MM/YYYY"
                          :options="date =>  filter.finalDate ? date <= filter.finalDate.split('/').reverse().join('/') : true"
                          @input="$refs.qStartDateProxy.hide()"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div
                class="col col-md-4 col-lg-4 col-xl-4 col-sm-12 col-xs-12 q-pl-md-xs q-pt-sm-xs q-pt-xs-xs q-pt-md-none"
              >
                <q-input
                  outlined
                  label="Fecha Fin"
                  :disable="disableInputs"
                  v-model="filter.finalDate"
                  :rules="rules.finalDate"
                  hide-bottom-space
                  clearable
                  mask="##/##/####"
                >
                  <template v-slot:append>
                    <q-icon
                      name="event"
                      class="cursor-pointer"
                    >
                      <q-popup-proxy
                        ref="qFinalDateProxy"
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="filter.finalDate"
                          mask="DD/MM/YYYY"
                          :options="date =>  filter.startDate ? date >= filter.startDate.split('/').reverse().join('/') : true"
                          @input="$refs.qFinalDateProxy.hide()"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-mt-xs">
              <div
                class="col col-md-4 col-lg-4 col-xl-4 col-sm-12 col-xs-12 q-pr-md-xs"
              >
                <q-select
                  v-if="filter.type === 'C'"
                  outlined
                  v-model="filter.supplier"
                  use-input
                  clearable
                  input-debounce="0"
                  label="Proveedor"
                  :disable="disableInputs"
                  :options="optionSupplier"
                  option-label="name"
                  option-value="id"
                  lazy-rules
                  :rules="rules.supplier"
                  @filter="filterSupplier"
                  hide-bottom-space
                  map-options
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
                <q-select
                  v-if="filter.type === 'V'"
                  outlined
                  v-model="filter.customer"
                  use-input
                  clearable
                  input-debounce="0"
                  label="Cliente"
                  :disable="disableInputs"
                  :options="optionCustomer"
                  option-label="name"
                  option-value="id"
                  lazy-rules
                  :rules="rules.customer"
                  @filter="filterCustomer"
                  hide-bottom-space
                  map-options
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
              </div>
              <div
                class="col col-md-4 col-lg-4 col-xl-4 col-sm-12 col-xs-12 q-pr-md-xs q-pl-md-xs q-pt-sm-xs q-pt-xs-xs q-pt-md-none"
              >
                <q-select
                  outlined
                  v-model="filter.material"
                  use-input
                  clearable
                  input-debounce="0"
                  label="Material *"
                  :disable="disableInputs"
                  :options="optionMaterial"
                  option-label="name"
                  option-value="id"
                  lazy-rules
                  :rules="rules.material"
                  @filter="filterMaterial"
                  hide-bottom-space
                  map-options
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
              </div>
              <div
                class="col col-md-4 col-lg-4 col-xl-4 col-sm-12 col-xs-12 q-pl-md-xs q-pt-sm-xs q-pt-xs-xs q-pt-md-none vertical-middle"
              >
                <span class="label text-grey-7">Medida: </span>
                <q-radio
                  class="q-mt-none"
                  v-model="filter.materialType"
                  val="T"
                  label="Tonelada"
                />
                <q-radio
                  class="q-mt-none"
                  v-model="filter.materialType"
                  val="U"
                  label="Viaje"
                />
              </div>
            </div>
            <div class="row text-center">
              <q-btn
                label="Buscar"
                type="submit"
                color="primary"
                class="col q-ml-sm"
              />
            </div>
          </q-form>
          <q-separator class = "q-mt-sm"/>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import thirdTypes from '../../store/modules/third/types';
import materialTypes from '../../store/modules/material/types';
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
      showFilter: true,
      types: [
        {
          value: 'C',
          label: 'Compra',
        },
        {
          value: 'V',
          label: 'Venta',
        },
      ],
      optionCustomer: [],
      optionSupplier: [],
      optionMaterial: [],
      materialType: null,
      filter: {
        type: 'C',
        startDate: null,
        finalDate: null,
        supplier: null,
        customer: null,
        material: null,
        materialType: null,
      },
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
  watch: {
    thirds() {
      this.optionCustomer = this.thirds.filter((third) => (third.active === 1 && third.customer === 1));
      this.optionSupplier = this.thirds.filter((third) => (third.active === 1 && third.associated === 1));
    },
    materials() {
      this.optionMaterial = this.materials.filter((material) => material.active === 1);
    },
  },
  computed: {
    ...mapState(zoneTypes.PATH, [
      'status',
      'responseMessages',
    ]),
    ...mapState(thirdTypes.PATH, {
      thirds: 'thirds',
      thirdStatus: 'status',
      thirdResponseMessages: 'responseMessages',
    }),
    ...mapState(materialTypes.PATH, {
      materials: 'materials',
      materialStatus: 'status',
      materialResponseMessages: 'responseMessages',
    }),
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
    ...mapActions(thirdTypes.PATH, {
      listThirds: thirdTypes.actions.LIST_THIRDS,
    }),
    ...mapActions(materialTypes.PATH, {
      listMaterials: materialTypes.actions.LIST_MATERIALS,
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
    async showModal() {
      await Promise.all([
        this.listThirds({ displayAll: 0, type: '%20', third: 0 }),
        this.listMaterials({ displayAll: 0, id: 0 }),
      ]);
      this.modal.show = true;
      this.$q.loading.hide();
    },
    filterSupplier(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionSupplier = this.thirds.filter((option) => (removeAccents(option.name).toLowerCase().indexOf(needle) > -1 && option.active === 1 && option.associated === 1));
      });
    },
    filterCustomer(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionCustomer = this.thirds.filter((option) => (removeAccents(option.name).toLowerCase().indexOf(needle) > -1 && option.active === 1 && option.customer === 1));
      });
    },
    filterMaterial(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionMaterial = this.materials.filter((option) => (removeAccents(option.name).toLowerCase().indexOf(needle) > -1 && option.active === 1));
      });
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>

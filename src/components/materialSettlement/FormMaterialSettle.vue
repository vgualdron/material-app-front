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
          <q-slide-transition>
            <q-form
              v-show="showFilter"
              @submit="onFilterSubmit"
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
                    :rules="filterRules.type"
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
                    lazy-rules
                    :rules="filterRules.startDate"
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
                    lazy-rules
                    :rules="filterRules.finalDate"
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
                    reactive-rules
                    :rules="filterRules.supplier"
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
                    reactive-rules
                    :rules="filterRules.customer"
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
                    label="Material"
                    :disable="disableInputs"
                    :options="optionMaterial"
                    option-label="name"
                    option-value="id"
                    reactive-rules
                    :rules="filterRules.material"
                    @filter="filterMaterial"
                    hide-bottom-space
                    map-options
                    emit-value
                    @input="resetMaterialInputs('MA')"
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
                  <div>
                    <span class="label text-grey-7">medición: </span>
                    <q-radio
                      @input="resetMaterialInputs('MT')"
                      class="q-mt-none"
                      v-model="filter.materialType"
                      val="T"
                      label="Tonelada"
                      reactive-rules
                      :rules="filterRules.materialType"
                      hide-bottom-space
                    />
                    <q-radio
                      @input="resetMaterialInputs('MT')"
                      class="q-mt-none"
                      v-model="filter.materialType"
                      val="U"
                      label="Viaje"
                      reactive-rules
                      :rules="filterRules.materialType"
                      hide-bottom-space
                    />
                  </div>
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
          </q-slide-transition>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import thirdTypes from '../../store/modules/third/types';
import materialTypes from '../../store/modules/material/types';
import materialSettlementTypes from '../../store/modules/materialSettlement/types';
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
      filterRules: {
        type: [
          (val) => (!!val) || 'El tipo es requerido',
        ],
        startDate: [
          (val) => (!!val) || 'La fecha de inicio es requerida',
        ],
        finalDate: [
          (val) => (!!val) || 'La fecha final es requerida',
        ],
        supplier: [
          (val) => (!!val) || 'El proveedor es requerido',
        ],
        customer: [
          (val) => (!!val) || 'El cliente es requerido',
        ],
        materialType: [
          (val) => (this.filter.material !== null || (!!val)) || 'Debe seleccionar un tipo de medición o un material',
        ],
        material: [
          (val) => (this.filter.materialType !== null || (!!val)) || 'Debe seleccionar un tipo de medición o un material',
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
    ...mapState(materialSettlementTypes.PATH, [
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
    ...mapActions(materialSettlementTypes.PATH, {
      getTicketsToSettle: materialSettlementTypes.actions.GET_TICKETS_TO_SETTLE,
      /* updateZone: materialSettlementTypes.actions.UPDATE_ZONE,
      deleteZone: materialSettlementTypes.actions.DELETE_ZONE, */
    }),
    ...mapActions(thirdTypes.PATH, {
      listThirds: thirdTypes.actions.LIST_THIRDS,
    }),
    ...mapActions(materialTypes.PATH, {
      listMaterials: materialTypes.actions.LIST_MATERIALS,
    }),
    async onFilterSubmit() {
      showLoading('Consultando tiquetes ...', 'Por favor, espere', true);

      this.$q.loading.hide();
    },
    async showModal() {
      await Promise.all([
        this.listThirds({ displayAll: 0, type: '%20', third: 0 }),
        this.listMaterials({ displayAll: 0, id: 0 }),
      ]);
      if (this.thirdStatus === true && this.materialStatus === true) {
        this.filter.type = 'C';
        this.filter.startDate = null;
        this.filter.finalDate = null;
        this.filter.supplier = null;
        this.filter.customer = null;
        this.filter.material = null;
        this.filter.materialType = null;
        this.showFilter = true;
        this.modal.show = true;
      } else {
        if (this.thirdStatus === false) {
          this.showNotificationsRef(this.thirdResponseMessages, this.thirdStatus, 'top-right', 5000);
        }
        if (this.materialStatus === false) {
          this.showNotificationsRef(this.materialResponseMessages, this.materialStatus, 'top-right', 5000);
        }
      }
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
    resetMaterialInputs(type) {
      if (type === 'MA') {
        this.filter.materialType = null;
      } else {
        this.filter.material = null;
      }
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>

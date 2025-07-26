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
            <q-select outlined label="Movimiento *" :disable="disableInputs" v-model.trim="rate.movement"
              :options="movements" hide-bottom-space @input="resetOnTypeChange()" lazy-rules :rules="rules.movement"
              map-options emit-value />
            <div class="row q-pt-none q-mt-xs">
              <div class="col"
                :class="[rate.movement === 'T' ? 'col-lg-6 col-sm-12 col-xs-12 q-pr-md-none q-pr-sm-none q-pr-lg-xs' : 'col-md-12 col-sm-12 col-xs-12']">
                <q-select v-if="displayOriginYard" outlined v-model="rate.originYard" use-input clearable
                  input-debounce="0" label="Patio Despacho *" :disable="disableInputs" :options="optionOriginYards"
                  option-label="name" option-value="id" @filter="filterOriginYard" lazy-rules :rules="rules.originYard"
                  hide-bottom-space map-options emit-value>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay coincidencias
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col"
                :class="[rate.movement === 'T' ? 'col-lg-6 col-sm-12 col-xs-12 q-pl-md-none q-pl-sm-none q-pl-lg-xs q-pt-md-xs q-pt-lg-none q-pt-sm-xs q-pt-xs-xs' : 'col-md-12 col-sm-12 col-xs-12']">
                <q-select v-if="displayDestinyYard" outlined v-model="rate.destinyYard" use-input clearable
                  input-debounce="0" label="Patio Recepción *" :disable="disableInputs" :options="optionDestinyYards"
                  option-label="name" option-value="id" @filter="filterDestinyYard" lazy-rules
                  :rules="rules.destinyYard" hide-bottom-space map-options emit-value>
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        No hay coincidencias
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>
            <q-select v-if="displaySupplier" outlined v-model="rate.supplier" class="q-mt-none q-pt-xs" use-input
              clearable input-debounce="0" label="Proveedor *" :disable="disableInputs" :options="optionSupplier"
              option-label="name" option-value="id" lazy-rules :rules="rules.supplier" @filter="filterSupplier"
              hide-bottom-space map-options emit-value>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay coincidencias
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select v-if="displayCustomer" outlined v-model="rate.customer" class="q-mt-none q-pt-xs" use-input
              clearable input-debounce="0" label="Cliente *" :disable="disableInputs" :options="optionCustomer"
              option-label="name" option-value="id" lazy-rules :rules="rules.customer" @filter="filterCustomer"
              hide-bottom-space map-options emit-value>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay coincidencias
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <div class="row q-pt-none q-mt-xs">
              <div class="col-lg-6 col-sm-12 col-xs-12 q-pr-md-none q-pr-sm-none q-pr-lg-xs">
                <q-input outlined label="Fecha Inicio *" :disable="disableInputs" v-model="rate.startDate"
                  :rules="rules.startDate" hide-bottom-space clearable mask="##/##/####">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qStartDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="rate.startDate" mask="DD/MM/YYYY"
                          :options="date => rate.finalDate ? date <= rate.finalDate.split('/').reverse().join('/') : true"
                          @input="$refs.qStartDateProxy.hide()">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div
                class="col-lg-6 col-sm-12 col-xs-12 q-pl-md-none q-pl-sm-none q-pl-lg-xs q-pt-md-xs q-pt-lg-none q-pt-sm-xs q-pt-xs-xs">
                <q-input outlined label="Fecha Fin *" :disable="disableInputs" v-model="rate.finalDate"
                  :rules="rules.finalDate" hide-bottom-space clearable mask="##/##/####">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qFinalDateProxy" cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="rate.finalDate" mask="DD/MM/YYYY"
                          :options="date => rate.startDate ? date >= rate.startDate.split('/').reverse().join('/') : true"
                          @input="$refs.qFinalDateProxy.hide()">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <q-select outlined v-model="rate.material" class="q-mt-none q-pt-xs" use-input clearable input-debounce="0"
              label="Material *" :disable="disableInputs" :options="optionMaterial" option-label="name"
              option-value="id" lazy-rules :rules="rules.material" @filter="filterMaterial" hide-bottom-space
              map-options emit-value>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay coincidencias
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <q-select v-if="rate.movement === 'T'" outlined v-model="rate.conveyorCompany" class="q-mt-none q-pt-xs"
              use-input clearable input-debounce="0" label="Empresa Transportadora *" :disable="disableInputs"
              :options="optionConveyorCompany" option-label="name" option-value="id" reactive-rules
              :rules="rules.conveyorCompany" @filter="filterConveyorCompany" hide-bottom-space map-options emit-value>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    No hay coincidencias
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
            <div class="row q-pt-none q-mt-none">
              <div v-if="displayMaterialPrice"
                class="col col-md-12 col-sm-12 col-xs-12 col-lg-4 col-xl-4 q-pr-lg-xs q-pr-xl-xs">
                <q-input class="q-mt-xs" v-model.trim="rate.materialPrice" label="Valor Material *" outlined lazy-rules
                  :rules="rules.materialPrice" :disable="disableInputs" hide-bottom-space
                  @input="formatMaterialPrice(false), calculateTotalPrice()" @blur="formatMaterialPrice(true)" />
              </div>
              <div class="col"
                :class="rate.movement === 'T' ? 'col-12' : (rate.movement === 'C' ? 'col-lg-4 col-md-12 col-sm-12 col-xs-12 q-pl-lg-xs q-pr-lg-xs' : 'col-lg-6 col-md-12 col-xs-12 q-pr-lg-xs q-pr-xl-xs')">
                <q-input class="q-mt-xs" v-model.trim="rate.freightPrice" label="Valor Flete *" outlined lazy-rules
                  :rules="rules.freightPrice" :disable="disableInputs" hide-bottom-space
                  @input="formatFreightPrice(false), calculateTotalPrice()" @blur="formatFreightPrice(true)" />
              </div>
              <div v-if="displayTotalPrice" class="col"
                :class="rate.movement === 'C' ? 'col-lg-4 col-md-12 col-sm-12 col-xs-12 q-pl-lg-xs q-pl-xl-xs' : 'col-lg-6 col-md-12 col-sm-12 col-xs-12 q-pl-lg-xs q-pl-xl-xs'">
                <q-input class="q-mt-xs" v-model.trim="rate.totalPrice" label="Valor Total *" outlined lazy-rules
                  :rules="rules.totalPrice" :disable="disableInputs || disableTotalPrice" hide-bottom-space
                  @input="formatTotalPrice(false)" @blur="formatTotalPrice(true)" />
              </div>
            </div>
            <q-input class="q-mt-xs" :input-style="{ resize: 'none' }" type="textarea" v-model.trim="rate.observation"
              label="Observación" outlined :disable="disableInputs" hide-bottom-space rows="5" counter
              maxlength="600" />
            <q-checkbox v-if="rate.movement == 'T'" class="text-center" left-label v-model="rate.roundTrip" text-h6
              color="green" :disable="disableInputs" label="Viaje redondo" />
            <q-separator />
            <div class="row text-center">
              <q-btn label="cancelar" type="reset" color="primary" outline class="col" v-close-popup
                @click="modal.show = false" />
              <q-btn label="Aceptar" type="submit" color="primary" class="col q-ml-sm" />
              <q-btn label="Cargar Archivo" @click="uploadFile" color="primary" class="col q-ml-sm" />
              <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import rateTypes from '../../store/modules/rate/types';
import yardTypes from '../../store/modules/yard/types';
import thirdTypes from '../../store/modules/third/types';
import materialTypes from '../../store/modules/material/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { removeAccents } from '../../helpers/removeAccents';
import { formatDecimal } from '../../helpers/formatDecimal';
import { formatDateToSave } from '../../helpers/formatDateToSave';
import { validateDate } from '../../helpers/validateDate';
import { downloadFile } from '../../helpers/downloadFile';

export default {
  data() {
    return {
      modal: {
        show: false,
        title: '',
        type: '',
      },
      isLoading: false,
      movements: [
        { value: 'T', label: 'TRASLADO (DESPACHO/RECEPCIÓN)' },
        { value: 'C', label: 'COMPRA' },
        { value: 'V', label: 'VENTA' },
      ],
      rate: {
        id: null,
        movement: 'T',
        originYard: null,
        destinyYard: null,
        customer: null,
        supplier: null,
        conveyorCompany: null,
        startDate: null,
        finalDate: null,
        material: null,
        materialPrice: 0,
        freightPrice: 0,
        totalPrice: 0,
        observation: '',
        roundTrip: false,
      },
      optionOriginYards: [],
      optionDestinyYards: [],
      optionCustomer: [],
      optionSupplier: [],
      optionConveyorCompany: [],
      optionMaterial: [],
      rules: {
        movement: [
          (val) => (!!val) || 'El tipo de movimiento es requerido',
        ],
        originYard: [
          (val) => (!!val) || 'El patio de despacho es requerido',
        ],
        destinyYard: [
          (val) => (!!val) || 'El patio de destino es requerido',
        ],
        supplier: [
          (val) => (!!val) || 'El proveedor es requerido',
        ],
        customer: [
          (val) => (!!val) || 'El cliente es requerido',
        ],
        startDate: [
          (val) => (!!val) || 'La fecha de inicio es requerida',
          (val) => (validateDate(val) === true) || 'La fecha ingresada no es válida',
          (val) => (!this.rate.finalDate || (val.split('/').reverse().join('/') <= this.rate.finalDate.split('/').reverse().join('/'))) || 'La fecha de inicio no puede ser mayor a la fecha final',
        ],
        finalDate: [
          (val) => (!!val) || 'La fecha final es requerida',
          (val) => (validateDate(val) === true) || 'La fecha ingresada no es válida',
          (val) => (!this.rate.startDate || (val.split('/').reverse().join('/') >= this.rate.startDate.split('/').reverse().join('/'))) || 'La fecha final no puede ser menor a la fecha inicial',
        ],
        material: [
          (val) => (!!val) || 'El material es requerido',
        ],
        conveyorCompany: [
          (val) => (!!val) || 'La empresa transportadora es requerida',
        ],
        materialPrice: [
          (val) => (val && parseFloat(val.replaceAll(',', '')) >= 0) || 'El valor de material es requerido y no debe ser negativo',
        ],
        freightPrice: [
          (val) => (val !== undefined && val !== null && parseFloat(val.toString().replaceAll(',', '')) >= 0) || 'El valor de flete es requerido y no debe ser negativo',
        ],
        totalPrice: [
          (val) => (val !== undefined && val !== null && parseFloat(val.replaceAll(',', '')) >= 0) || 'El valor total es requerido y no debe ser negativo',
        ],
      },
    };
  },
  props: [
    'showNotificationsRef',
    'listRatesMountedRef',
  ],
  watch: {
    watchYards() {
      this.optionOriginYards = this.yards.filter((yard) => ((yard.active === 1 || yard.id === this.rate.originYard) && yard.id !== this.rate.destinyYard));
      this.optionDestinyYards = this.yards.filter((yard) => ((yard.active === 1 || yard.id === this.rate.destinyYard) && yard.id !== this.rate.originYard));
    },
    watchThirds() {
      this.optionCustomer = this.thirds.filter((third) => ((third.active === 1 && third.customer === 1) || third.id === this.rate.customer));
      this.optionSupplier = this.thirds.filter((third) => ((third.active === 1 && third.associated === 1) || third.id === this.rate.supplier));
      this.optionConveyorCompany = this.thirds.filter((third) => ((third.active === 1 && third.contractor === 1) || third.id === this.rate.conveyorCompany));
    },
    materials() {
      this.optionMaterial = this.materials.filter((material) => material.active === 1 || material.id === this.rate.material);
    },
  },
  computed: {
    ...mapState(rateTypes.PATH, [
      'status',
      'responseMessages',
    ]),
    ...mapState(yardTypes.PATH, {
      yards: 'yards',
      yardStatus: 'status',
      yardResponseMessages: 'responseMessages',
    }),
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
    watchYards() {
      return [
        this.rate.originYard,
        this.rate.destinyYard,
        this.yards,
      ];
    },
    watchThirds() {
      return [
        this.rate.supplier,
        this.rate.customer,
        this.rate.conveyorCompany,
        this.thirds,
      ];
    },
    watchMaterials() {
      return [
        this.rate.material,
        this.materials,
      ];
    },
    disableInputs() {
      return this.modal.type === 'D';
    },
    displayOriginYard() {
      if (this.rate.movement === 'T' || this.rate.movement === 'V') {
        return true;
      }
      return false;
    },
    displayDestinyYard() {
      if (this.rate.movement === 'T' || this.rate.movement === 'C') {
        return true;
      }
      return false;
    },
    displaySupplier() {
      if (this.rate.movement === 'C') {
        return true;
      }
      return false;
    },
    displayCustomer() {
      if (this.rate.movement === 'V') {
        return true;
      }
      return false;
    },
    displayMaterialPrice() {
      if (this.rate.movement === 'C') {
        return true;
      }
      return false;
    },
    displayTotalPrice() {
      if (this.rate.movement !== 'T') {
        return true;
      }
      return false;
    },
    disableTotalPrice() {
      if (this.rate.movement !== 'V') {
        return true;
      }
      return false;
    },
  },
  methods: {
    ...mapActions(rateTypes.PATH, {
      saveRate: rateTypes.actions.SAVE_RATE,
      updateRate: rateTypes.actions.UPDATE_RATE,
      deleteRate: rateTypes.actions.DELETE_RATE,
    }),
    ...mapActions(yardTypes.PATH, {
      listYards: yardTypes.actions.LIST_YARDS,
    }),
    ...mapActions(thirdTypes.PATH, {
      listThirds: thirdTypes.actions.LIST_THIRDS,
    }),
    ...mapActions(materialTypes.PATH, {
      listMaterials: materialTypes.actions.LIST_MATERIALS,
    }),
    async onSubmit() {
      if (this.modal.type === 'C') {
        const rateToSave = await this.setValuesToSave(this.rate.id, null);
        showLoading('Guardando Tarifa ...', 'Por favor, espere', true);
        // alert(`Valores1 a guardar: ${JSON.stringify(rateToSave)}`);
        await this.saveRate(rateToSave);
      } else if (this.modal.type === 'E') {
        const rateToSave = await this.setValuesToSave(this.rate.id, null);
        showLoading('Actualizando Tarifa ...', 'Por favor, espere', true);
        await this.updateRate(rateToSave, this.rate.id);
      } else if (this.modal.type === 'D') {
        showLoading('Eliminando Tarifa ...', 'Por favor, espere', true);
        await this.deleteRate(this.rate.id);
      }
      if (this.status === true) {
        this.showNotificationsRef(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
        this.resetForm();
        this.listRatesMountedRef();
        this.modal.show = false;
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
      }
    },
    async showModal(id, rate, type) {
      await Promise.all([
        this.listYards({ id: (id !== null ? rate.originYard : 0), displayAll: 0 }),
        this.listThirds({
          displayAll: 0,
          type: '%20',
          third: `${id !== null ? rate.supplier : '0'},${id !== null ? rate.customer : '0'},${id !== null ? rate.conveyorCompany : '0'}`,
          origin: '%20',
          startDate: '%20',
          finalDate: '%20',
        }),
        this.listMaterials({ displayAll: 1, id: (id !== null ? rate.material : 0) }),
      ]);
      if (this.yardStatus === true && this.thirdStatus === true && this.materialStatus === true) {
        if (id !== null) {
          this.rate.id = id;
          this.rate.movement = rate.movement;
          this.rate.originYard = rate.originYard;
          this.rate.destinyYard = rate.destinyYard;
          this.rate.supplier = rate.supplier;
          this.rate.customer = rate.customer;
          this.rate.startDate = rate.startDate;
          this.rate.finalDate = rate.finalDate;
          this.rate.material = rate.material;
          this.rate.conveyorCompany = rate.conveyorCompany;
          this.rate.materialPrice = rate.materialPrice;
          this.rate.freightPrice = rate.freightPrice;
          this.rate.totalPrice = rate.totalPrice;
          this.rate.observation = rate.observation;
          this.rate.roundTrip = rate.roundTrip === 1;
        } else {
          this.resetForm();
        }
        this.modal.title = type === 'C' ? 'Agregar Tarifa' : (type === 'E' ? 'Editar Tarifa' : 'Eliminar Tarifa');
        this.modal.type = type;
        this.modal.show = true;
        this.$q.loading.hide();
      } else {
        this.$q.loading.hide();
        if (this.yardStatus === false) {
          this.showNotificationsRef(this.yardResponseMessages, this.yardStatus, 'top-right', 5000);
        }
        if (this.thirdStatus === false) {
          this.showNotificationsRef(this.thirdResponseMessages, this.thirdStatus, 'top-right', 5000);
        }
        if (this.materialStatus === false) {
          this.showNotificationsRef(this.materialResponseMessages, this.materialStatus, 'top-right', 5000);
        }
      }
    },
    filterOriginYard(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionOriginYards = this.yards.filter((yard) => (((yard.active === 1 || yard.id === this.rate.originYard) && yard.id !== this.rate.destinyYard) && removeAccents(yard.name).toLowerCase().indexOf(needle) > -1));
      });
    },
    filterDestinyYard(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionDestinyYards = this.yards.filter((yard) => (((yard.active === 1 || yard.id === this.rate.destinyYard) && yard.id !== this.rate.originYard) && removeAccents(yard.name).toLowerCase().indexOf(needle) > -1));
      });
    },
    filterSupplier(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionSupplier = this.thirds.filter((option) => ((removeAccents(option.name).toLowerCase().indexOf(needle) > -1 && option.active === 1 && option.associated === 1) || option.id === this.rate.supplier));
      });
    },
    filterCustomer(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionCustomer = this.thirds.filter((option) => ((removeAccents(option.name).toLowerCase().indexOf(needle) > -1 && option.active === 1 && option.customer === 1) || option.id === this.rate.customer));
      });
    },
    filterMaterial(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionMaterial = this.materials.filter((option) => ((removeAccents(option.name).toLowerCase().indexOf(needle) > -1 && option.active === 1) || option.id === this.rate.material));
      });
    },
    filterConveyorCompany(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionConveyorCompany = this.thirds.filter((option) => ((removeAccents(option.name).toLowerCase().indexOf(needle) > -1 && option.active === 1 && option.contractor === 1) || option.id === this.rate.conveyorCompany));
      });
    },
    formatMaterialPrice(blur) {
      this.rate.materialPrice = formatDecimal(this.rate.materialPrice, blur);
    },
    formatFreightPrice(blur) {
      this.rate.freightPrice = formatDecimal(this.rate.freightPrice, blur);
    },
    formatTotalPrice(blur) {
      this.rate.totalPrice = formatDecimal(this.rate.totalPrice, blur);
    },
    calculateTotalPrice() {
      if (this.rate.movement === 'C') {
        const localMaterialPrice = this.rate.materialPrice === null || this.rate.materialPrice === '' ? 0 : parseFloat(this.rate.materialPrice.toString().replace(/,/g, ''));
        const localFreightPrice = this.rate.freightPrice === null || this.rate.freightPrice === '' ? 0 : parseFloat(this.rate.freightPrice.toString().replace(/,/g, ''));
        this.rate.totalPrice = formatDecimal((localMaterialPrice + localFreightPrice).toFixed(2), false);
      }
    },
    resetForm() {
      this.rate.id = null;
      this.rate.movement = 'T';
      this.rate.originYard = null;
      this.rate.destinyYard = null;
      this.rate.supplier = null;
      this.rate.customer = null;
      this.rate.startDate = null;
      this.rate.finalDate = null;
      this.rate.material = null;
      this.rate.conveyorCompany = null;
      this.rate.materialPrice = 0;
      this.rate.freightPrice = 0;
      this.rate.totalPrice = 0;
      this.rate.observation = null;
      this.rate.roundTrip = false;
    },
    resetOnTypeChange() {
      this.rate.originYard = null;
      this.rate.destinyYard = null;
      this.rate.supplier = null;
      this.rate.customer = null;
      this.rate.conveyorCompany = null;
      this.calculateTotalPrice();
    },
    setValuesToSave(id, rate) {
      if (rate) {
        this.rate = rate;
      }
      // alert(`Valores a guardarSET 1: ${JSON.stringify(rate)}`);
      const value = {
        id,
        movement: this.rate.movement,
        originYard: this.rate.movement === 'C' ? null : this.rate.originYard,
        destinyYard: this.rate.movement === 'V' ? null : this.rate.destinyYard,
        startDate: this.rate.startDate ? formatDateToSave(this.rate.startDate) : null,
        finalDate: this.rate.finalDate ? formatDateToSave(this.rate.finalDate) : null,
        material: this.rate.material,
        supplier: this.rate.movement === 'C' ? this.rate.supplier : null,
        customer: this.rate.movement === 'V' ? this.rate.customer : null,
        conveyorCompany: this.rate.movement === 'T' ? this.rate.conveyorCompany : null,
        materialPrice: this.rate.movement === 'C' && this.rate.materialPrice ? String(this.rate.materialPrice).replaceAll(',', '') : null,
        freightPrice: this.rate.freightPrice ? String(this.rate.freightPrice).replaceAll(',', '') : 0,
        totalPrice: this.rate.movement === 'T' ? null : String(this.rate.totalPrice).replaceAll(',', ''),
        observation: this.rate.observation,
        roundTrip: this.rate.roundTrip,
      };
      // alert(`Valores a guardarSET: ${JSON.stringify(value)}`);
      // showNotifications([`Valores a guardarSET: ${JSON.stringify(value)}`], true, 'top-right', 3000);

      return value;
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    uploadFile() {
      // alert('Botón de carga de archivo clickeado');
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        // alert(`Archivo seleccionado: ${file.name}`);
        this.showNotificationsRef(this.responseMessages, this.status, 'top-right', 5000);
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target.result;
          // alert(`Contenido del archivo: ${content}`);
          this.processFileContent(content);
        };
        reader.readAsText(file);
      }
    },
    processFileContent(content) {
      const lines = content.split('\n');
      const errorLines = []; // Aquí almacenaremos todos los errores

      // Cambiar el bucle for...of por Promise.all para ejecutar las promesas en paralelo
      const processAllLines = async () => {
        const promises = lines.map((line, index) => this.processLine(line, index + 1, errorLines));
        await Promise.all(promises);
        if (errorLines.length > 0) {
          // Crear archivo con los errores
          const errorContent = errorLines.join('\n');
          downloadFile(errorContent, 'errores.txt', 'text/plain'); // Descarga el archivo con los errores
        }
      };

      processAllLines();
      this.modal.show = false;
    },
    async processLine(line, lineNumber, errorLines) {
      const [movement, originYard, destinyYard, supplier, customer, startDate, finalDate, material, conveyorCompany, materialPrice, freightPrice, totalPrice, observation, roundTrip] = line.split(';');
      const rate = {
        movement,
        originYard: originYard || null,
        destinyYard: destinyYard || null,
        supplier: supplier || null,
        customer: customer || null,
        startDate,
        finalDate,
        material,
        conveyorCompany: conveyorCompany || null,
        materialPrice: parseFloat(materialPrice) || 0,
        freightPrice: parseFloat(freightPrice) || 0,
        totalPrice: parseFloat(totalPrice) || 0,
        observation: observation || null,
        roundTrip: roundTrip === '1',
      };
      await this.saveRateFromFile(rate, lineNumber, errorLines);
    },
    async saveRateFromFile(rate, lineNumber, errorLines) {
      try {
        const rateToSave = await this.setValuesToSave(null, rate);
        showLoading('Guardando Tarifa ...', 'Por favor, espere', true);
        await this.saveRate(rateToSave);

        if (this.status === true) {
          this.showNotificationsRef(this.responseMessages, this.status, 'top-right', 5000);
        } else {
          const messages = Array.isArray(this.responseMessages) ? this.responseMessages : [];
          const warningMessage = messages.length > 0 ? messages[0].detail : 'Error al guardar tarifa';
          errorLines.push(`Línea ${lineNumber}: ${warningMessage}`); // Guardamos el error en el arreglo
          this.showNotificationsRef(this.responseMessages, this.status, 'top-right', 5000);
        }
      } catch (error) {
        const errorMessage = `Error al guardar tarifa desde línea ${lineNumber}: ${error.message}`;
        // this.showNotificationsRef(this.responseMessages, this.status, 'top-right', 5000);
        errorLines.push(`Línea ${lineNumber}: ${errorMessage}`); // Guardamos el error en el arreglo
      } finally {
        this.$q.loading.hide();
        this.listRatesMountedRef();
      }
    },
  },
};
</script>

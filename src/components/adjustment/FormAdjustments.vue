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
            <q-select
              outlined
              label="Tipo *"
              :disable="disableInputs"
              v-model.trim="adjustment.type"
              :options="types"
              lazy-rules
              :rules="rules.type"
              hide-bottom-space
              map-options
              emit-value
            />
            <q-select
              outlined
              v-model="adjustment.yard"
              class="q-mt-xs"
              use-input
              clearable
              input-debounce="0"
              label="Patio *"
              :disable="disableInputs"
              :options="optionYards"
              option-label="name"
              option-value="id"
              @filter="filterYard"
              lazy-rules
              :rules="rules.yard"
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
              outlined
              v-model="adjustment.material"
              class="q-mt-xs"
              use-input
              clearable
              input-debounce="0"
              label="Material *"
              :disable="disableInputs"
              :options="optionMaterials"
              option-label="name"
              option-value="id"
              @filter="filterMaterial"
              lazy-rules
              :rules="rules.material"
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
            <q-input
              outlined
              label="Fecha *"
              :disable="disableInputs"
              v-model="adjustment.date"
              :rules="rules.date"
              class="q-mt-xs"
              hide-bottom-space
              mask="##/##/####"
            >
              <template v-slot:append>
                <q-icon
                  name="event"
                  class="cursor-pointer"
                >
                  <q-popup-proxy
                    ref="qDateProxy"
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date
                      v-model="adjustment.date"
                      mask="DD/MM/YYYY"
                      @input="$refs.qDateProxy.hide()"
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
            <q-input
              class="q-mt-xs"
              v-model.trim="adjustment.amount"
              label="Cantidad *"
              outlined
              lazy-rules
              :rules="rules.amount"
              :disable="disableInputs"
              hide-bottom-space
              @input="formatAmount(false)"
              @blur="formatAmount(true)"
            />
            <q-input
              class="q-mt-xs"
              :input-style="{resize: 'none'}"
              type="textarea"
              v-model.trim="adjustment.observation"
              label="Observación"
              outlined
              :disable="disableInputs"
              hide-bottom-space
              rows="5"
              counter
              maxlength="600"
            />
            <q-separator />
            {{adjustment.amout}}
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
import adjustmentTypes from '../../store/modules/adjustment/types';
import yardTypes from '../../store/modules/yard/types';
import materialTypes from '../../store/modules/material/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { removeAccents } from '../../helpers/removeAccents';
import { getDateTime } from '../../helpers/getDateTime';
import { formatDateToSave } from '../../helpers/formatDateToSave';
import { formatDecimal } from '../../helpers/formatDecimal';
import { validateDate } from '../../helpers/validateDate';

export default {
  data() {
    return {
      modal: {
        show: false,
        title: '',
        type: '',
      },
      types: [
        {
          label: 'Aumento',
          value: 'A',
        },
        {
          label: 'Disminución',
          value: 'D',
        },
      ],
      isLoading: false,
      adjustment: {
        id: null,
        type: 'A',
        yard: null,
        material: null,
        date: null,
        amount: 0,
        observation: 0,
      },
      optionYards: [],
      optionMaterials: [],
      rules: {
        type: [
          (val) => (!!val) || 'El tipo de ajuste es requerido',
        ],
        yard: [
          (val) => (!!val) || 'El patio es requerido',
        ],
        material: [
          (val) => (!!val) || 'El material es requerido',
        ],
        date: [
          (val) => (!!val) || 'La fecha es requerida',
          (val) => (validateDate(val) === true) || 'La fecha ingresada no es válida',
        ],
        amount: [
          (val) => (!!val) || 'Debe ingresar una cantidad mayor a cero',
          (val) => parseFloat(val.replaceAll(',', '')) > 0 || 'La cantidad ingresada no puede ser 0',
          (val) => parseFloat(val.replaceAll(',', '')) < 100000000 || 'La cantidad ingresada debe ser menor a 100,000,000',
        ],
      },
    };
  },
  props: [
    'showNotificationsRef',
    'listAdjustmentsMountedRef',
  ],
  watch: {
    yards(val) {
      this.optionYards = [...val];
    },
    materials(val) {
      this.optionMaterials = [...val];
    },
  },
  computed: {
    ...mapState(adjustmentTypes.PATH, [
      'status',
      'responseMessages',
    ]),
    ...mapState(yardTypes.PATH, {
      yards: 'yards',
      yardStatus: 'status',
      yardResponseMessages: 'responseMessages',
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
    ...mapActions(adjustmentTypes.PATH, {
      saveAdjustment: adjustmentTypes.actions.SAVE_ADJUSTMENT,
      updateAdjustment: adjustmentTypes.actions.UPDATE_ADJUSTMENT,
      deleteAdjustment: adjustmentTypes.actions.DELETE_ADJUSTMENT,
    }),
    ...mapActions(yardTypes.PATH, {
      listYards: yardTypes.actions.LIST_YARDS,
    }),
    ...mapActions(materialTypes.PATH, {
      listMaterials: materialTypes.actions.LIST_MATERIALS,
    }),
    async onSubmit() {
      if (this.modal.type === 'C') {
        showLoading('Guardando Ajuste ...', 'Por favor, espere', true);
        const adjustmentToSave = this.setValuesToSave(null);
        await this.saveAdjustment(adjustmentToSave);
      } else if (this.modal.type === 'E') {
        showLoading('Actualizando Ajuste ...', 'Por favor, espere', true);
        const adjustmentToSave = this.setValuesToSave(this.adjustment.id);
        await this.updateAdjustment(adjustmentToSave);
      } else if (this.modal.type === 'D') {
        showLoading('Eliminando Ajuste ...', 'Por favor, espere', true);
        await this.deleteAdjustment(this.adjustment.id);
      }
      if (this.status === true) {
        this.showNotificationsRef(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
        this.adjustment.id = null;
        this.adjustment.code = '';
        this.adjustment.name = '';
        this.listAdjustmentsMountedRef();
        this.modal.show = false;
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
      }
    },
    async showModal(id, adjustment, type) {
      await Promise.all([this.listMaterials({ id: (id !== null ? adjustment.material : 0), displayAll: 0 }), this.listYards({ id: (id !== null ? adjustment.yard : 0), displayAll: 0 })]);
      if (this.materialStatus === true && this.yardStatus === true) {
        this.adjustment.id = id !== null ? id : null;
        this.adjustment.type = id !== null ? adjustment.type : 'A';
        this.adjustment.yard = id !== null ? adjustment.yard : null;
        this.adjustment.material = id !== null ? adjustment.material : null;
        const dateTime = getDateTime();
        this.adjustment.date = id !== null ? adjustment.date : dateTime.date;
        this.adjustment.amount = id !== null ? adjustment.amount : 0;
        this.adjustment.observation = id !== null ? adjustment.observation : '';
        this.modal.title = type === 'C' ? 'Agregar Ajuste' : (type === 'E' ? 'Editar Ajuste' : 'Eliminar Ajuste');
        this.modal.type = type;
        this.modal.show = true;
      } else {
        this.$q.loading.hide();
        if (this.yardStatus === false) {
          this.showNotificationsRef(this.yardResponseMessages, this.yardStatus, 'top-right', 5000);
        }
        if (this.materialStatus === false) {
          this.showNotificationsRef(this.materialResponseMessages, this.yardStatus, 'top-right', 5000);
        }
      }
    },
    filterYard(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionYards = this.yards.filter((option) => removeAccents(option.name).toLowerCase().indexOf(needle) > -1);
      });
    },
    filterMaterial(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionMaterials = this.materials.filter((option) => removeAccents(option.name).toLowerCase().indexOf(needle) > -1);
      });
    },
    formatAmount(blur) {
      this.adjustment.amount = formatDecimal(this.adjustment.amount, blur);
    },
    setValuesToSave(id) {
      const value = {
        id,
        type: this.adjustment.type,
        yard: this.adjustment.yard,
        material: this.adjustment.material,
        date: formatDateToSave(this.adjustment.date),
        amount: this.adjustment.amount.replaceAll(',', ''),
        observation: this.adjustment.observation,
      };
      return value;
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>

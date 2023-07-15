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
            <div class="text-center">
              <q-checkbox
                v-if="modal.type === 'C' && canCreateInBatch === true"
                class="q-mr-auto q-ml-auto text-center"
                size="md"
                label="Registrar mediante archivo plano CSV"
                v-model="file.active"
              />
            </div>
            <template v-if="file.active">
              <q-banner inline-actions rounded class="bg-grey text-black">
                * No se debe poner titulo a las celdas<br>
                * Cada registro de tercero deben estar separados por salto de linea.<br>
                * Cada campo de tercero deben estar separados por coma ",".<br>
                * Los campos de Nit y Nombre no pueden contener el caracter coma ",".<br>
                * Si un NIT ya se encuentra registrado, los que se hace es actualizar los datos
                  de los demás campos, con el nuevo valor que viene en el archivo.<br>
                * Ejemplo de registros: <br>
                    1090404800-1,EMPRESA 1,SI,NO,NO<br>
                    90404811-4,EMPRESA 2,NO,SI,NO<br>
              </q-banner>
              <q-markup-table separator="vertical" flat bordered>
                <thead>
                  <tr>
                    <th class="text-center">NIT</th>
                    <th class="text-center">NOMBRE</th>
                    <th class="text-center">ESCLIENTE</th>
                    <th class="text-center">ESPROVEEDOR</th>
                    <th class="text-center">ESCONTRATISTA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="text-center">1090404800-1</td>
                    <td class="text-center">EMPRESA 1</td>
                    <td class="text-center">SI</td>
                    <td class="text-center">NO</td>
                    <td class="text-center">NO</td>
                  </tr>
                  <tr>
                    <td class="text-center">90404811-4</td>
                    <td class="text-center">EMPRESA 2</td>
                    <td class="text-center">NO</td>
                    <td class="text-center">SI</td>
                    <td class="text-center">NO</td>
                  </tr>
                </tbody>
              </q-markup-table>
              <q-file
                v-model.trim="file.file"
                label="Archivo CSV de terceros *"
                outlined
                lazy-rules
                :rules="rules.file"
                hide-bottom-space
                clearable
                accept="text/csv"
              />
            </template>
            <template v-else>
              <q-input
                v-model.trim="third.nit"
                label="Nit *"
                outlined
                lazy-rules
                :rules="rules.nit"
                :disable="disableInputs"
                hide-bottom-space
              />
              <q-input
                outlined
                v-model.trim="third.name"
                label="Nombre *"
                lazy-rules
                :rules="rules.name"
                :disable="disableInputs"
                hide-bottom-space
              />
              <q-separator />
              <q-card>
                <q-list
                  bordered
                  class="rounded-borders"
                >
                  <q-card-section class="text-weight-light q-pt-xs q-pb-xs">
                    <q-item v-ripple>
                      <q-checkbox
                        class="q-mr-auto q-ml-auto"
                        size="md"
                        label="Cliente"
                        v-model="third.customer"
                        :disable="disableInputs"
                      />
                    </q-item>
                    <q-item>
                      <q-checkbox
                        class="q-mr-auto q-ml-auto"
                        size="md"
                        label="Proveedor de carbón"
                        v-model="third.associated"
                        :disable="disableInputs"
                      />
                    </q-item>
                    <q-item>
                      <q-checkbox
                        class="q-mr-auto q-ml-auto"
                        size="md"
                        label="Transportador"
                        v-model="third.contractor"
                        :disable="disableInputs"
                      />
                    </q-item>
                  </q-card-section>
                </q-list>
              </q-card>
              <q-checkbox
                left-label
                v-model="third.active"
                text-h6
                color="green"
                :disable="disableInputs"
                label="El tercero se encuentra activo"
              />
            </template>
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
import thirdTypes from '../../store/modules/third/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { havePermission } from '../../helpers/havePermission';

export default {
  data() {
    return {
      modal: {
        show: false,
        title: '',
        type: '',
      },
      isLoading: false,
      third: {
        id: null,
        nit: '',
        name: '',
        customer: false,
        associated: false,
        contractor: false,
        active: true,
      },
      file: {
        active: false,
        file: null,
      },
      rules: {
        nit: [
          (val) => (!!val) || 'El NIT es requerido',
          (val) => (val.length >= 2) || 'El NIT debe tener un mínimo de 2 caracteres',
          (val) => (val.length <= 50) || 'El NIT debe tener un máximo de 50 caracteres',
        ],
        name: [
          (val) => (!!val) || 'El nombre es requerido',
          (val) => (val.length >= 4) || 'El nombre debe tener un mínimo de 4 caracteres',
          (val) => (val.length <= 100) || 'El nombre debe tener un máximo de 100 caracteres',
        ],
        file: [
          (val) => (!!val) || 'Debe cargar un archivo',
        ],
      },
    };
  },
  props: [
    'showNotificationsRef',
    'listThirdsMountedRef',
  ],
  computed: {
    ...mapState(thirdTypes.PATH, [
      'status',
      'responseMessages',
    ]),
    disableInputs() {
      return this.modal.type === 'D';
    },
    canCreateInBatch() {
      return havePermission('third.createInBatch');
    },
  },
  methods: {
    ...mapActions(thirdTypes.PATH, {
      saveThird: thirdTypes.actions.SAVE_THIRD,
      updateThird: thirdTypes.actions.UPDATE_THIRD,
      deleteThird: thirdTypes.actions.DELETE_THIRD,
      saveThirdsInBatch: thirdTypes.actions.SAVE_THIRDS_IN_BATCH,
    }),
    async onSubmit() {
      if (this.modal.type === 'C') {
        showLoading('Guardando Tercero ...', 'Por favor, espere', true);
        if (this.file.active === true) {
          await this.saveThirdsInBatch(this.file.file);
        } else {
          await this.saveThird(this.third);
        }
      } else if (this.modal.type === 'E') {
        showLoading('Actualizando Tercero ...', 'Por favor, espere', true);
        await this.updateThird(this.third);
      } else if (this.modal.type === 'D') {
        showLoading('Eliminando Tercero ...', 'Por favor, espere', true);
        await this.deleteThird(this.third.id);
      }
      if (this.status === true) {
        this.showNotificationsRef(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
        this.third.id = null;
        this.third.nit = '';
        this.third.name = '';
        this.third.customer = false;
        this.third.associated = false;
        this.third.contractor = false;
        this.third.active = true;
        this.listThirdsMountedRef();
        this.modal.show = false;
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
      }
    },
    showModal(id, third, type) {
      this.file.active = false;
      this.file.file = null;
      this.third.id = id !== null ? id : null;
      this.third.nit = id !== null ? third.nit : '';
      this.third.name = id !== null ? third.name : '';
      this.third.customer = id !== null ? third.customer === 1 : false;
      this.third.associated = id !== null ? third.associated === 1 : false;
      this.third.contractor = id !== null ? third.contractor === 1 : false;
      this.third.active = id !== null ? third.active === 1 : true;
      this.modal.title = type === 'C' ? 'Agregar Tercero' : (type === 'E' ? 'Editar Tercero' : 'Eliminar Tercero');
      this.modal.type = type;
      this.modal.show = true;
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>

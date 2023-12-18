<template>
  <div class="q-pa-md">
    <q-dialog
      v-model="modal.show"
      persistent
    >
      <q-card style="width: 700px; max-width: 80vw;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Movimientos</div>
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
          <q-banner inline-actions rounded class="bg-grey text-black">
            * La liquidación que intenta gestionar, tiene tiquetes asociados a los cuales se les ha generado movimiento en TNS.<br>
            * Debe gestionar estos movimientos manualmente sobre TNS (eliminarlos o actualizar su valores segun aplique).<br>
            * Puede descargar los movimientos para conocer los detalles de los mismos.<br>
            * Una vez haya realizado la gestion sobre TNS, puede eliminar el movimiento (este paso es completamente manual).<br>
            * No podrá gestionar la liquidación hasta que se hayan eliminado todos los movimientos asociados a la misma.<br>
          </q-banner>
          <div class="q-pa-none q-mt-xs text-center">
            <q-btn
              color="white"
              text-color="black"
              icon-right="download"
              label="SQL"
              :disable="data.length === 0"
              @click="printDeleteFile()"
            />
          </div>
          <q-table
            :grid="$q.screen.xs"
            :data="data"
            :columns="columns"
            class="q-mt-xs"
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <div>
                  <q-btn
                    color="white"
                    text-color="black"
                    field="print"
                    icon="print"
                    :disabled="!validatedPermissions.print.status"
                    :title="validatedPermissions.print.title"
                    @click="print(props.row.id, props.row.id)"
                  />
                  <q-btn
                    class="q-ml-xs"
                    color="red"
                    field="delete"
                    icon="delete"
                    :disabled="!validatedPermissions.delete.status"
                    :title="validatedPermissions.delete.title"
                    @click="showConfirm(props.row.id, 'D')"
                  />
                </div>
              </q-td>
            </template>
            <!--items for small screens-->
            <template v-slot:item="props">
              <div
                class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
              >
                <q-card>
                  <q-list bordered separator>
                    <q-item v-ripple>
                      <q-item-section>
                        <template
                          v-for="column in columns"
                        >
                          <q-item-label
                            v-if="column.visible"
                            :key="column.name + '-label'"
                          >
                              {{column.label}}
                          </q-item-label>
                          <q-item-label
                            v-if="column.visible"
                            caption
                            :key="column.name + '-value'"
                          >
                            {{ props.row[column.field]}}
                          </q-item-label>
                        </template>
                      </q-item-section>
                      <q-item-section side>
                        <div>
                          <q-btn
                            round
                            icon="print"
                            size="xs"
                            color="white"
                            text-color="black"
                            :disabled="!validatedPermissions.print.status"
                            :title="validatedPermissions.print.title"
                            @click="print(props.row.id, props.row.id)"
                          />
                        </div>
                        <div>
                          <q-btn
                            round
                            icon="delete"
                            size="xs"
                            color="red"
                            text-color="white"
                            :disabled="!validatedPermissions.delete.status"
                            :title="validatedPermissions.delete.title"
                            @click="showConfirm(props.row.id, 'D')"
                          />
                        </div>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- CONFIRM DIALOG -->
    <q-dialog v-model="confirm.show" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar :icon="confirm.icon" :color="confirm.iconColor" text-color="white"></q-avatar>
          <span class="q-ml-sm">¿Esta seguro de {{confirm.action}} este registro?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            label="Cancelar"
            color="primary"
            outline class="col"
            v-close-popup
            @click="confirm.show = false"
          />
          <q-btn
            label="Aceptar"
            @click="submit"
            color="primary"
            class="col q-ml-sm"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import movementTypes from '../../store/modules/movement/types';
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
      columns: [
        {
          name: 'movement',
          label: 'Movimiento',
          align: 'left',
          field: 'movement',
          sortable: true,
          visible: true,
        },
        {
          name: 'actions',
          label: 'Acciones',
          align: 'center',
          visible: false,
        },
      ],
      confirm: {
        show: false,
        action: '',
        icon: '',
        iconColor: '',
        type: '',
      },
      data: [],
      isLoading: false,
      movement: null,
      settlementConsecutive: '',
    };
  },
  props: [],
  computed: {
    ...mapState(movementTypes.PATH, [
      'status',
      'responseMessages',
      'movementsToPrint',
    ]),
    validatedPermissions() {
      const statusPrint = havePermission('movement.print');
      const statusDelete = havePermission('movement.delete');
      return {
        print: {
          title: statusPrint ? 'Imprimir Movimiento' : 'No tiene permisos para imprimir movimientos',
          status: statusPrint,
        },
        delete: {
          title: statusDelete ? 'Eliminar Movimiento' : 'No tiene permisos para eliminar movimientos',
          status: statusDelete,
        },
      };
    },
  },
  methods: {
    ...mapActions(movementTypes.PATH, {
      deleteMovement: movementTypes.actions.DELETE_MOVEMENT,
      printMovement: movementTypes.actions.PRINT_MOVEMENT,
      generatePrintDocument: movementTypes.actions.GENERATE_PRINT_DOCUMENT,
      generateDeleteFile: movementTypes.actions.GENERATE_PRINT_SQL_DELETE,
    }),
    showModal(movements, settlementConsecutive) {
      this.data = movements.map((element) => ({ id: element, movement: element }));
      this.modal.show = true;
      this.settlementConsecutive = settlementConsecutive;
      this.$q.loading.hide();
    },
    showConfirm(id, type) {
      if (id !== null) {
        if (type === 'D') {
          this.confirm.action = 'eliminar';
          this.confirm.icon = 'delete';
          this.confirm.iconColor = 'red';
          this.confirm.type = type;
          this.movement = id;
        }
        this.confirm.show = true;
      }
    },
    async print(id, consecutive) {
      showLoading('Imprimiendo movimientos ...', 'Por favor, espere', true);
      await this.printMovement(id);
      if (this.status === true) {
        this.generatePrintDocument({
          data: this.movementsToPrint,
          fileName: consecutive,
        });
      } else {
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      }
      this.$q.loading.hide();
    },
    async printDeleteFile() {
      this.generateDeleteFile({
        data: this.data,
        fileName: `Movimientos TNS - liq ${this.settlementConsecutive}`,
      });
    },
    async submit() {
      if (this.confirm.type !== null && this.confirm.type !== '') {
        if (this.confirm.type === 'D') {
          showLoading('Eliminando movimiento ...', 'Por favor, espere', true);
          await this.deleteMovement(this.movement);
          this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
          if (this.status === true) {
            this.confirm.show = false;
            const index = this.data.findIndex((movement) => movement.id === this.movement);
            if (index !== -1) {
              this.data.splice(index, 1);
            }
          }
        }
        this.$q.loading.hide();
      }
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>

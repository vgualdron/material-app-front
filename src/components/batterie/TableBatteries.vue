<template>
  <div class="q-pa-md">
    <div class="row q-mt-md">
      <div class="col-9 text-center">
        <q-input
          dense
          debounce="400"
          color="primary"
          v-model="filter"
          class="q-ml-xs"
          placeholder="Buscar bateria"
          clearable
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>
    <q-table
      :data="data"
      :columns="columns"
      row-key="id"
      :selected.sync="selected"
      :loading="isLoadingTable"
      :filter="filter"
      :pagination.sync="pagination"
      class="q-mt-md">
      <template v-slot:body="props">
        <q-tr :props="props" @click="clickRow(props.row)">
          <q-td key="ovens" :props="props" auto-width>
            <q-btn
              size="sm"
              color="primary"
              @click="props.expand = !props.expand"
              :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'">
              ({{ props.row.ovens.length }})
            </q-btn>
          </q-td>
          <q-td key="name" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.name }}
            <q-popup-edit :value="props.row.name" v-slot="scope" buttons
              @input="val => save('name', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="capacity" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.capacity }}
            <q-popup-edit :value="props.row.capacity" v-slot="scope" buttons
              @input="val => save('capacity', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="performance" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.performance }}
            <q-popup-edit :value="props.row.performance" v-slot="scope" buttons
              @input="val => save('performance', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="description" :props="props">
            <q-icon size="xs" name="edit" />
            {{ props.row.description }}
            <q-popup-edit :value="props.row.description" v-slot="scope" buttons
              @input="val => save('description', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="active" :props="props">
            <q-icon size="xs" name="edit" />
            <q-badge :color="props.row.active ? 'green' : 'red'">
              {{ props.row.active ? 'Activo' : 'Inactivo' }}
            </q-badge>
            <q-popup-edit
              :value="optionsStatus.find((status) => props.row.active === status.value)"
              v-slot="scope"
              @input="val => save('active', val)"
              buttons>
              <q-select
                outlined
                v-model="scope.value"
                :options="optionsStatus" />
            </q-popup-edit>
          </q-td>
          <q-td key="yard" :props="props">
            <q-icon size="xs" name="edit" />
            {{ optionsYards.find((yard) => props.row.yard === yard.value).label }}
            <q-popup-edit
              :value="optionsYards.find((yard) => props.row.yard === yard.value)"
              v-slot="scope"
              @input="val => save('yard', val)"
              buttons>
              <q-select
                outlined
                v-model="scope.value"
                :options="optionsYards"/>
            </q-popup-edit>
          </q-td>
          <q-td key="actions" :props="props" auto-width>
            <q-btn icon="delete" type="reset" color="primary" flat size="sm"
              class="col q-ml-sm" @click="openModalDelete(props.row)" />
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%" class="is-flex">

            <div class="q-pa-md row items-start q-gutter-md">
              <q-card
                v-for="oven in props.row.ovens"
                :key="`btn_dropdown_${oven.batterie}_${oven.name}`"
                flat bordered class="my-card bg-grey-1">
                <div class="row items-center no-wrap">
                  <div class="col q-pa-md">
                    <div style="display: flex; justify-content: space-between;">
                      <div class="text-h6">{{ oven.name }}</div>
                      <div class="col-auto">
                        <q-btn color="grey-7" round flat icon="close" @click="openModalDeleteOven(oven)"></q-btn>
                      </div>
                    </div>
                    <div class="text-subtitle2">
                      Estado:
                      <q-badge :color="oven.active === 1 ? 'green' : oven.active === 2 ? 'yellow' : 'red'">
                        {{ oven.active === 0 ? 'Inactivo' : oven.active === 2 ? 'Mtto' : 'Activo' }}
                      </q-badge>
                    </div>
                    <div key="capacity" @click="itemSelected=oven">
                      <div>
                        <span class="text-subtitle2">Capacidad: </span>
                        <span>{{ oven.capacity }} Ton</span>
                        <q-icon size="xs" name="edit" v-if="oven.load === 0"/>
                      </div>
                      <q-tooltip>
                          TONELADAS INGRESADAS
                      </q-tooltip>
                      <q-popup-edit :value="oven.capacity" v-slot="scopeH" buttons
                        @input="val => saveOven('capacity', val)">
                        <q-input v-model="scopeH.value" dense autofocus />
                      </q-popup-edit>
                    </div>
                    <div key="performance" @click="itemSelected=oven" >
                      <div>
                        <span class="text-subtitle2">Rendimiento: </span>
                        <span>{{ oven.performance }} %</span>
                        <q-icon size="xs" name="edit" />
                      </div>
                      <q-tooltip>
                          RENDIMIENTO ESPERADO {{  oven.performance_ton }} Ton
                      </q-tooltip>
                      <q-popup-edit
                          :value="oven.performance"
                          v-slot="scope"
                          @input="val => saveOven('performance', val)"
                          buttons>
                        <q-input v-model="scope.value" dense autofocus />
                      </q-popup-edit>
                    </div>
                  </div>
                </div>
                <q-separator />
                <q-card-actions align="right">
                  <q-btn flat @click="itemSelected=oven" style="font-size: 0.99em">
                    Editar
                    <q-popup-edit
                        :value="oven.name"
                        v-slot="scope"
                        @input="val => saveOven('name', val)"
                        buttons>
                      <q-input v-model="scope.value" dense autofocus />
                    </q-popup-edit>
                  </q-btn>
                  <q-btn flat @click="openModalChangeStateOven(oven)" style="font-size: 0.99em">
                    {{ oven.active === 1 ? 'Inactivar' : oven.active === 0 ? 'Mtto' : 'Activar'}}
                  </q-btn>
                </q-card-actions>
              </q-card>

              <q-card
                flat bordered class="my-card bg-grey-1">
                <div class="items-center no-wrap q-pa-md">
                  <q-form
                    @submit="openModalCreateOven({
                      name: nameNewOven,
                      active: true,
                      batterie: props.row.id,
                      capacity: props.row.capacity,
                      performance: props.row.performance
                    })"
                  >
                    <q-input
                      v-model.trim="nameNewOven"
                      :label="'Nombre, T=' + props.row.capacity + ', %=' + props.row.performance"
                      outlined
                      lazy-rules
                      hide-bottom-space
                    />
                  </q-form>
                </div>
                <q-separator />
                <q-card-actions align="right">
                  <q-btn
                    :disabled="!nameNewOven"
                    flat
                    @click="openModalCreateOven({
                    name: nameNewOven,
                    active: true,
                    batterie: props.row.id,
                    capacity: props.row.capacity,
                    performance: props.row.performance
                  })">
                    Guardar
                  </q-btn>
                </q-card-actions>
              </q-card>
            </div>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:bottom-row>
        <q-tr class="row-item">
          <q-td>
            Completa los campos
            <br> y oprime el boton + para
            <br> crear una nueva bateria
          </q-td>
          <q-td key="name">
            <q-icon size="xs" name="edit" />
            {{ newItem.name }}
            <q-popup-edit
              :value="newItem.name"
              v-slot="scope"
              buttons
              @input="val => changeNewItem('name', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="capacity">
            <q-icon size="xs" name="edit" />
            {{ newItem.capacity }}
            <q-popup-edit
              :value="newItem.capacity"
              v-slot="scope"
              buttons
              @input="val => changeNewItem('capacity', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="performance">
            <q-icon size="xs" name="edit" />
            {{ newItem.performance }}
            <q-popup-edit
              :value="newItem.performance"
              v-slot="scope"
              buttons
              @input="val => changeNewItem('performance', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="description">
            <q-icon size="xs" name="edit" />
            {{ newItem.description }}
            <q-popup-edit
              :value="newItem.description"
              v-slot="scope"
              buttons
              @input="val => changeNewItem('description', val)">
              <q-input v-model="scope.value" dense autofocus />
            </q-popup-edit>
          </q-td>
          <q-td key="active">
            <q-icon size="xs" name="edit" />
            <q-btn flat @click="openModalChangeStateOven(oven)"
              :class="newItem.active === 0 ? 'bg-red text-white' : 'bg-green text-white' " size="xs">
              {{ newItem.active === 0 ? 'Inactivo' : 'Activo' }}
            </q-btn>
            <q-popup-edit
              :value="optionsStatus.find((status) => newItem.active === status.value)"
              v-slot="scope"
              @input="val => changeNewItem('active', val.value)"
              buttons>
              <q-select
                outlined
                v-model="scope.value"
                :options="optionsStatus" />
            </q-popup-edit>
          </q-td>
          <q-td key="yard">
            <q-icon size="xs" name="edit" />
            {{
              optionsYards.find((yard) => newItem.yard === yard.value)
              ? optionsYards.find((yard) => newItem.yard === yard.value).label
              : ''
            }}
            <q-popup-edit
              :value="optionsYards.find((yard) => newItem.yard === yard.value)"
              v-slot="scope"
              @input="val => changeNewItem('yard', val.value)"
              buttons>
              <q-select
                outlined
                v-model="scope.value"
                :options="optionsYards"/>
            </q-popup-edit>
          </q-td>
          <q-td auto-width>
            <q-btn size="sm" color="green" @click="openModalCreate()" icon="add" :disabled="disabledAdd"/>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import batterieTypes from '../../store/modules/batterie/types';
import yardTypes from '../../store/modules/yard/types';
import materialTypes from '../../store/modules/material/types';
import ovenTypes from '../../store/modules/oven/types';
import commonTypes from '../../store/modules/common/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
// import { havePermission } from '../../helpers/havePermission';

export default {
  data() {
    return {
      isLoadingTable: false,
      selected: [],
      copyNewItem: {
        name: '',
        description: '',
        active: 1,
        yard: 0,
        capacity: 0,
        performance: 0,
      },
      newItem: {
        name: '',
        description: '',
        active: 1,
        yard: 0,
        capacity: 0,
        performance: 0,
      },
      itemSelected: {},
      columns: [
        {
          name: 'ovens',
          required: true,
          label: 'Hornos',
          align: 'left',
        },
        {
          name: 'name',
          required: true,
          label: 'Nombre',
          align: 'left',
          field: (row) => row.name,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'capacity',
          required: true,
          label: 'T',
          align: 'left',
          field: (row) => row.capacity,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'performance',
          required: true,
          label: '%',
          align: 'left',
          field: (row) => row.performance,
          format: (val) => `${val}`,
          sortable: true,
        },
        {
          name: 'description',
          required: true,
          label: 'Descripción',
          align: 'left',
          sortable: true,
        },
        {
          name: 'active',
          required: true,
          label: 'Estado',
          align: 'left',
          sortable: true,
        },
        {
          name: 'yard',
          required: true,
          label: 'Patio',
          align: 'left',
          sortable: true,
        },
        {
          name: 'actions',
          required: true,
          label: 'Acciones',
          align: 'left',
        },
      ],
      pagination: {
        rowsPerPage: 30,
      },
      filter: '',
      isDiabledAdd: false,
      showModal: false,
      optionsStatus: [
        {
          label: 'Activo',
          value: 1,
        },
        {
          label: 'Inactivo',
          value: 0,
        },
      ],
      newItemOven: {
        active: 1,
        name: '',
        batterie: null,
        capacity: null,
        performance: null,
      },
      nameNewOven: '',
    };
  },
  async mounted() {
    this.newItem.yard = parseInt(this.currentYard, 10);
    this.copyNewItem.yard = parseInt(this.currentYard, 10);
    this.isLoadingTable = true;
    showLoading('Cargando Baterias ...', 'Por favor, espere', true);
    await this.fetchYards({ id: 0, displayAll: 1 });
    await this.fetchMaterials({ id: 0, displayAll: 1 });
    await this.fetchBatteries(this.currentYard);
    this.isLoadingTable = false;
    this.$q.loading.hide();
  },
  computed: {
    ...mapState(batterieTypes.PATH, [
      'batteries',
      'batterie',
      'status',
      'responseMessages',
    ]),
    ...mapState(ovenTypes.PATH, {
      ovens: 'ovens',
      oven: 'oven',
      statusOven: 'status',
      responseMessagesOven: 'responseMessages',
    }),
    ...mapState(yardTypes.PATH, [
      'yards',
    ]),
    ...mapState(materialTypes.PATH, [
      'materials',
    ]),
    ...mapState(commonTypes.PATH, [
      'currentYard',
    ]),
    data() {
      return [...this.batteries];
    },
    optionsYards() {
      return this.yards.map(({ id, name }) => ({ label: name, value: id }));
    },
    optionsMaterials() {
      return this.materials.map(({ id, name }) => ({ label: name, value: id }));
    },

    disabledAdd() {
      const {
        name,
        active,
        yard,
      } = this.newItem;
      return !name || !active || !yard;
    },
  },
  methods: {
    ...mapActions(batterieTypes.PATH, {
      fetchBatteries: batterieTypes.actions.LIST_BATTERIES,
      createBatterie: batterieTypes.actions.SAVE_BATTERIE,
      updateBatterie: batterieTypes.actions.UPDATE_BATTERIE,
      deleteBatterie: batterieTypes.actions.DELETE_BATTERIE,
    }),
    ...mapActions(yardTypes.PATH, {
      fetchYards: yardTypes.actions.LIST_YARDS,
    }),
    ...mapActions(materialTypes.PATH, {
      fetchMaterials: materialTypes.actions.LIST_MATERIALS,
    }),
    ...mapActions(ovenTypes.PATH, {
      createOven: ovenTypes.actions.SAVE_OVEN,
      updateOven: ovenTypes.actions.UPDATE_OVEN,
      deleteOven: ovenTypes.actions.DELETE_OVEN,
    }),
    async saveOven(field, value) {
      showLoading('Guardando cambios ...', 'Por favor, espere', true);
      this.itemSelected[field] = value.value || value;
      await this.updateOven(this.itemSelected);
      await this.fetchBatteries(this.currentYard);
      this.showNotification(this.responseMessagesOven, this.statusOven, 'top-right', 5000);
      this.$q.loading.hide();
    },
    async openModalChangeStateOven(row) {
      this.$q.dialog({
        title: 'Cambiar estado',
        message: 'Está seguro que desea cabiar el estado del horno?',
        ok: {
          push: true,
        },
        cancel: {
          push: true,
          color: 'negative',
          text: 'adsa',
        },
        persistent: true,
      }).onOk(async () => {
        showLoading('Guardando cambios ...', 'Por favor, espere', true);
        this.itemSelected = {
          ...row,
          active: row.active === 0 ? 2 : row.active === 1 ? 0 : 1,
        };
        await this.updateOven(this.itemSelected);
        await this.fetchBatteries(this.currentYard);
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
    },
    async save(field, value) {
      showLoading('Guardando cambios ...', 'Por favor, espere', true);
      this.itemSelected[field] = value.value || value;
      await this.updateBatterie(this.itemSelected);
      await this.fetchBatteries(this.currentYard);
      this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
      this.$q.loading.hide();
    },
    async changeNewItem(field, value) {
      this.newItem[field] = value.value || value;
    },
    clickRow(row) {
      this.itemSelected = { ...row };
    },
    addRow() {
      this.showModal = true;
    },
    openModalCreateOven(row) {
      this.$q.dialog({
        title: 'Crear',
        message: 'Está seguro que desea crear el horno?',
        ok: {
          push: true,
        },
        cancel: {
          push: true,
          color: 'negative',
          text: 'adsa',
        },
        persistent: true,
      }).onOk(async () => {
        showLoading('Creando ...', 'Por favor, espere', true);
        await this.createOven(row);
        await this.fetchBatteries(this.currentYard);
        this.isLoadingTable = false;
        this.nameNewOven = '';
        this.showNotification(this.responseMessagesOven, this.statusOven, 'top-right', 5000);
        this.$q.loading.hide();
      }).onCancel(() => {
        console.log('>>>> Cancel');
      }).onDismiss(() => {
        console.log('I am triggered on both OK and Cancel');
      });
    },
    openModalCreate() {
      this.$q.dialog({
        title: 'Agregar',
        message: 'Está seguro que desea agregar la bateria?',
        ok: {
          push: true,
        },
        cancel: {
          push: true,
          color: 'negative',
          text: 'adsa',
        },
        persistent: true,
      }).onOk(async () => {
        showLoading('Guardando cambios ...', 'Por favor, espere', true);
        await this.createBatterie(this.newItem);
        await this.fetchBatteries(this.currentYard);
        this.isLoadingTable = false;
        this.newItem = { ...this.copyNewItem };
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
      }).onCancel(() => {
        console.log(`>>>> Cancel BATERIENEW ${this.currentYard}`);
      }).onDismiss(() => {
        console.log('I am triggered on both OK and Cancel');
      });
    },
    openModalDeleteOven(row) {
      this.$q.dialog({
        title: 'Eliminar',
        message: 'Está seguro que desea eliminar el horno?',
        ok: {
          push: true,
        },
        cancel: {
          push: true,
          color: 'negative',
          text: 'adsa',
        },
        persistent: true,
      }).onOk(async () => {
        showLoading('Eliminando ...', 'Por favor, espere', true);
        this.isLoadingTable = true;
        await this.deleteOven(row.id);
        await this.fetchBatteries(this.currentYard);
        this.isLoadingTable = false;
        this.showNotification(this.responseMessagesOven, this.statusOven, 'top-right', 5000);
        this.$q.loading.hide();
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
    },
    openModalDelete(row) {
      this.$q.dialog({
        title: 'Eliminar',
        message: 'Está seguro que desea eliminar la bateria?',
        ok: {
          push: true,
        },
        cancel: {
          push: true,
          color: 'negative',
          text: 'adsa',
        },
        persistent: true,
      }).onOk(async () => {
        showLoading('Eliminando ...', 'Por favor, espere', true);
        this.isLoadingTable = true;
        await this.deleteBatterie(row.id);
        await this.fetchBatteries(this.currentYard);
        this.isLoadingTable = false;
        this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
        this.$q.loading.hide();
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      });
    },
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
  },
};
</script>
<style scoped>
  .my-card {
    width: 100%;
    max-width: 250px;
  }
  .row-item {
    background: mintcream;
  }
</style>

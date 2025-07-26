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
              v-if="parseInt(props.row.yard) === parseInt(currentYard)"
              size="sm"
              color="primary"
              @click="props.expand = !props.expand; clickRow(props.row)"
              :icon="props.expand ? 'keyboard_arrow_up' : 'keyboard_arrow_down'">
              ({{ props.row.ovens.length }})
            </q-btn>
          </q-td>
          <q-td key="name" :props="props">
            {{ props.row.name }}
          </q-td>
          <q-td key="capacity" :props="props">
            {{ props.row.capacity }}
          </q-td>
          <q-td key="performance" :props="props">
            {{ props.row.performance }}
          </q-td>
          <q-td key="description" :props="props">
            {{ props.row.description }}
          </q-td>
          <q-td key="active" :props="props">
            <q-badge :color="props.row.active ? 'green' : 'red'">
              {{ props.row.active ? 'Activo' : 'Inactivo' }}
            </q-badge>
          </q-td>
          <q-td key="yard" :props="props">
            {{ optionsYards.find((yard) => props.row.yard === yard.value).label }}
          </q-td>
        </q-tr>
        <q-tr v-show="props.expand" :props="props">
          <q-td colspan="100%" class="is-flex">

            <div class="q-pa-md row items-start q-gutter-md">
              <q-card
                v-for="oven in props.row.ovens"
                :key="`btn_dropdown_${oven.batterie}_${oven.name}`"
                flat bordered class="my-card bg-grey-1"
                :style="{ backgroundColor: 1 === 1 ? 'blue' : '' }">
                <div class="row items-center no-wrap">
                  <div class="col q-pa-md">
                    <div style="display: flex; justify-content: space-between;">
                      <div class="text-h6">
                        <i class="material-icons" v-if="oven.productions.length"> local_fire_department</i> {{ oven.name }}
                      </div>
                      <div class="col-auto">
                        <q-btn color="grey-7" round flat icon="close" @click="openModalDeleteOven(oven)"></q-btn>
                      </div>
                    </div>
                    <div class="text-subtitle2">
                      Estado:
                      <q-badge :color="oven.load === 1 ? 'blue' : oven.active === 1 ? 'green' : oven.active === 2 ? 'yellow' : 'red'">
                        {{ oven.load === 1 ? 'Cargado' : oven.active === 0 ? 'Inactivo' : oven.active === 2 ? 'Mtto' : 'Activo' }}
                      </q-badge>
                    </div>
                    <div key="capacity" @click="itemSelected=oven" v-if="oven.active === 1">
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
                    <div key="performance" @click="itemSelected=oven" v-if="oven.active === 1 && oven.load === 0">
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
                    <div key="performance_ton" @click="itemSelected=oven" v-if="oven.active === 1 && oven.load === 1">
                      <div>
                        <span class="text-subtitle2">Rendimiento: </span>
                        <span>{{ oven.performance_ton }} Ton</span>
                        <q-icon size="xs" name="edit" />
                      </div>
                      <q-tooltip>
                          RENDIMIENTO ESPERADO {{ oven.performance }} %
                      </q-tooltip>
                      <q-popup-edit
                          :value="oven.performance_ton"
                          v-slot="scope"
                          @input="val => saveOven('performance_ton', val)"
                          buttons>
                        <q-input v-model="scope.value" dense autofocus />
                      </q-popup-edit>
                    </div>
                    <div key="date" @click="itemSelected=oven" v-if="oven.active === 1">
                      <div>
                        <span class="text-subtitle2">Fecha Cargue: </span>
                        <span>{{ oven.date }}</span>
                        <q-icon size="xs" name="edit" v-if="oven.load === 0"/>
                      </div>
                      <q-tooltip>
                          FECHA DE CARGUE
                      </q-tooltip>
                      <q-popup-edit
                          :value="oven.date"
                          v-slot="scope"
                          @input="val => saveOven('date', val)"
                          buttons>
                          <q-date
                            v-model="scope.value"
                            mask="YYYY-MM-DD"
                            today-btn
                          />
                      </q-popup-edit>
                    </div>
                    <div key="time" @click="itemSelected=oven" v-if="oven.active === 1">
                      <div>
                        <span class="text-subtitle2">Hora Cargue: </span>
                        <span>{{ oven.time }}</span>
                        <q-icon size="xs" name="edit" v-if="oven.load === 0"/>
                      </div>
                      <q-tooltip>
                          HORA INICIO DEL HORNO
                      </q-tooltip>
                      <q-popup-edit
                          :value="oven.time"
                          v-slot="scope"
                          @input="val => saveOven('time', val)"
                          buttons>
                          <q-time
                            v-model="scope.value"
                            mask="HH:mm"
                            today-btn
                          />
                      </q-popup-edit>
                    </div>
                    <div key="hours" @click="itemSelected=oven" v-if="oven.active === 1 && oven.load === 0">
                      <div>
                        <span class="text-subtitle2">Horas Estimadas: </span>
                        <span>{{ oven.hours }}</span>
                        <q-icon size="xs" name="edit"/>
                      </div>
                      <q-tooltip>
                          HORAS ESTIMADAS DE COCCION {{ oven.date_download }} - {{ oven.time_download }}
                      </q-tooltip>
                      <q-popup-edit
                          :value="oven.hours"
                          v-slot="scope"
                          @input="val => saveOven('hours', val)"
                          buttons>
                        <q-input v-model="scope.value" dense autofocus />
                      </q-popup-edit>
                    </div>
                    <div key="date_download" @click="itemSelected=oven" v-if="oven.active === 1 && oven.load === 1">
                      <div>
                        <span class="text-subtitle2">Fecha Descargue: </span>
                        <span>{{ oven.date_download }}</span>
                        <q-icon size="xs" name="edit" v-if="oven.load === 1"/>
                      </div>
                      <q-tooltip>
                          FECHA DESCARGUE
                      </q-tooltip>
                      <q-popup-edit
                          :value="oven.date_download"
                          v-slot="scope"
                          @input="val => saveOven('date_download', val)"
                          buttons>
                          <q-date
                            v-model="scope.value"
                            mask="YYYY-MM-DD"
                            today-btn
                          />
                      </q-popup-edit>
                    </div>
                    <div key="time_download" @click="itemSelected=oven" v-if="oven.active === 1 && oven.load === 1">
                      <div>
                        <span class="text-subtitle2">Hora Descargue: </span>
                        <span>{{ oven.time_download }}</span>
                        <q-icon size="xs" name="edit" v-if="oven.load === 1"/>
                      </div>
                      <q-tooltip>
                          HORA DESCARGUE
                      </q-tooltip>
                      <q-popup-edit
                          :value="oven.time_download"
                          v-slot="scope"
                          @input="val => saveOven('time_download', val)"
                          buttons>
                          <q-time
                            v-model="scope.value"
                            mask="HH:mm"
                            today-btn
                          />
                      </q-popup-edit>
                    </div>
                    <div key="starting" @click="itemSelected=oven" v-if="oven.active === 1 && oven.load === 0">
                      <q-btn flat style="font-weight: normal; font-size: 0.9em">
                        <div>
                          <span class="text-subtitle2">M.P : </span>
                          <span>{{ (optionsMaterials.find((starting) => oven.starting === starting.value) || {}).label }}</span>
                          <q-icon size="xs" name="edit"/>
                        </div>
                        <q-tooltip>
                          MATERIA PRIMA
                        </q-tooltip>
                      </q-btn>
                      <q-popup-edit
                        :value="optionsMaterials.find((starting) => oven.starting === starting.value)"
                        v-slot="scope"
                        @input="val => saveOven('starting', val)"
                        buttons>
                        <q-select
                          outlined
                          v-model="scope.value"
                          :options="optionsMaterials"/>
                      </q-popup-edit>
                    </div>
                    <div key="medium" @click="itemSelected=oven" v-if="oven.active === 1 && oven.load === 0">
                      <q-btn flat style="font-weight: normal; font-size: 0.9em">
                        <div>
                          <span class="text-subtitle2">P.P : </span>
                          <span>{{ (optionsMaterials.find((medium) => oven.medium === medium.value) || {}).label }}</span>
                          <q-icon size="xs" name="edit"/>
                        </div>
                        <q-tooltip>
                          PRODUCTO EN PROCESO
                        </q-tooltip>
                      </q-btn>
                      <q-popup-edit
                        :value="optionsMaterials.find((medium) => oven.medium === medium.value)"
                        v-slot="scope"
                        @input="val => saveOven('medium', val)"
                        buttons>
                        <q-select
                          outlined
                          v-model="scope.value"
                          :options="optionsMaterials"/>
                      </q-popup-edit>
                    </div>
                    <div key="finished" @click="itemSelected=oven" v-if="oven.active === 1 && oven.load === 1">
                      <q-btn flat style="font-weight: normal; font-size: 0.9em">
                        <div>
                          <span class="text-subtitle2">P.T : </span>
                          <span>{{ (optionsMaterials.find((finished) => oven.finished === finished.value) || {}).label }}</span>
                          <q-icon size="xs" name="edit"/>
                        </div>
                        <q-tooltip>
                          PRODUCTO TERMINADO
                        </q-tooltip>
                      </q-btn>
                      <q-popup-edit
                        :value="optionsMaterials.find((finished) => oven.finished === finished.value)"
                        v-slot="scope"
                        @input="val => saveOven('finished', val)"
                        buttons>
                        <q-select
                          outlined
                          v-model="scope.value"
                          :options="optionsMaterials"/>
                      </q-popup-edit>
                    </div>
                  </div>
                </div>
                <q-separator />
                <q-card-actions align="right">
                  <q-btn flat @click="openModalChangeLoadOven(oven)" v-if="oven.active === 1"
                        :style="{ fontSize: '0.99em', color:((oven.timestampInSecondsLOAD >= timestampInSeconds ) || ( oven.load === 0) ) ? 'black' : 'red' }">
                    {{ oven.load === 1 ? 'Descargar' : 'Cargar' }}
                  </q-btn>
                  <!--
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
                  -->
                  <q-btn flat @click="openModalChangeStateOven(oven)" style="font-size: 0.99em" v-if="oven.load === 0">
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
    </q-table>
  </div>
</template>
<script>
import moment from 'moment-timezone';
import { mapState, mapActions } from 'vuex';
import batterieTypes from '../../store/modules/batterie/types';
import yardTypes from '../../store/modules/yard/types';
import materialTypes from '../../store/modules/material/types';
import productionTypes from '../../store/modules/production/types';
import ovenTypes from '../../store/modules/oven/types';
import userTypes from '../../store/modules/user/types';
import commonTypes from '../../store/modules/common/types';
import adjustmentTypes from '../../store/modules/adjustment/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
// import { havePermission } from '../../helpers/havePermission';

export default {
  data() {
    const now = moment().tz('America/Bogota');
    const downloadDate = now.add(0, 'hours');
    return {
      listYards: null,
      timestampInSeconds: 0,
      buttonColor: 'black',
      date: now.format('YYYY-MM-DD'), // Obtiene la fecha en el formato correcto
      time: now.format('HH:mm'), // Obtiene la hora
      hours: 62,
      expected_tons: 0,
      date_download: downloadDate.toISOString().split('T')[0],
      time_download: downloadDate.toISOString().split('T')[1].slice(0, 5),
      props: {
        expand: true,
      },
      production: {
        capacity: 0,
        performance: 0,
        performance_ton: 0,
        yard: 0,
        oven: 0,
        starting: 0,
        medium: 0,
        finished: 0,
        date: '',
        date_download: '',
        time: '',
        time_download: '',
        hours: 0,
        finalized: 0,
      },
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
    this.updateDateTime(); // Actualiza el color al montar el componente
    showLoading('Cargando Baterias ...', 'Por favor, espere', true);
    await this.fetchYards({ id: 0, displayAll: 1 });
    await this.fetchMaterials({ id: 0, displayAll: 1 });
    await this.fetchBatteries();
    await this.fetchUsers(this.user);
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
    ...mapState(userTypes.PATH, [
      'users',
      'user',
      'status',
      'responseMessages',
    ]),
    ...mapState(ovenTypes.PATH, {
      ovens: 'ovens',
      oven: 'oven',
      statusOven: 'status',
      responseMessagesOven: 'responseMessages',
    }),
    ...mapState(productionTypes.PATH, {
      productions: 'productions',
      production: 'production',
      statusProduction: 'status',
      responseMessagesProduction: 'responseMessages',
    }),
    ...mapState(yardTypes.PATH, [
      'yards',
    ]),
    ...mapState(materialTypes.PATH, [
      'materials',
    ]),
    ...mapState(commonTypes.PATH, [
      'currentYard',
      'user',
    ]),
    ...mapState(adjustmentTypes.PATH, [
      'responseMessages',
      'status',
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
    updateDateTime() {
      const now = moment().tz('America/Bogota');
      const currentDate = now.format('YYYY-MM-DD');
      const currentTime = now.format('HH:mm');
      this.time = currentTime;
      this.date = currentDate;
      const combinedDateTime = moment(`${this.date} ${this.time}`, 'YYYY-MM-DD HH:mm').tz('America/Bogota');
      this.timestampInSeconds = combinedDateTime.unix();
    },
    updateOvensTimestamp(ovens) {
      console.log('ovens', ovens);
      ovens.forEach((oven) => {
        oven.timestampInSecondsLOAD = moment(`${oven.date_download} ${oven.time_download}`, 'YYYY-MM-DD HH:mm').tz('America/Bogota').unix();
      });
      console.log('ovens2', ovens);
    },
    ...mapActions(batterieTypes.PATH, {
      fetchBatteries: batterieTypes.actions.LIST_BATTERIES,
      createBatterie: batterieTypes.actions.SAVE_BATTERIE,
      updateBatterie: batterieTypes.actions.UPDATE_BATTERIE,
      deleteBatterie: batterieTypes.actions.DELETE_BATTERIE,
    }),
    ...mapActions(productionTypes.PATH, {
      createProduction: productionTypes.actions.SAVE_PRODUCTION,
      updateProduction: productionTypes.actions.UPDATE_PRODUCTION,
      deleteProduction: productionTypes.actions.DELETE_PRODUCTION,
    }),
    ...mapActions(yardTypes.PATH, {
      fetchYards: yardTypes.actions.LIST_YARDS,
    }),
    ...mapActions(materialTypes.PATH, {
      fetchMaterials: materialTypes.actions.LIST_MATERIALS,
    }),
    ...mapActions(userTypes.PATH, {
      fetchUsers: userTypes.actions.GET_USER,
    }),
    ...mapActions(ovenTypes.PATH, {
      createOven: ovenTypes.actions.SAVE_OVEN,
      updateOven: ovenTypes.actions.UPDATE_OVEN,
      deleteOven: ovenTypes.actions.DELETE_OVEN,
    }),
    ...mapActions(adjustmentTypes.PATH, {
      saveAdjustmentMixOrRiddle: adjustmentTypes.actions.SAVE_ADJUSTMENT_MIX_OR_RIDDLE,
    }),
    handleDateChange(date) {
      console.log('Fecha seleccionada:', date);
      // Aquí puedes agregar el código para usar la fecha seleccionada
    },
    handleTimeChange(time) {
      console.log('Hora seleccionada:', time);
      // Aquí puedes agregar el código para usar la hora seleccionada
    },
    async saveOven(field, value) {
      showLoading('Guardando cambios ...', 'Por favor, espere', true);
      const originalValues = { ...this.itemSelected };
      this.itemSelected[field] = value.value || value;

      if (field === 'performance') {
        this.itemSelected.performance_ton = (this.itemSelected.capacity * this.itemSelected.performance) / 100;
      }

      if (field === 'performance_ton') {
        this.itemSelected.performance = (100 * this.itemSelected.performance_ton) / this.itemSelected.capacity;
      }

      if (field === 'date' || field === 'time' || field === 'hours') {
        // Asignar valores predeterminados si 'date' o 'time' son null
        const currentDate = this.itemSelected.date || new Date().toISOString().split('T')[0];
        const currentTime = this.itemSelected.time || new Date().toTimeString().split(' ')[0];
        const currentHours = this.itemSelected.hours || 0;

        // Crear un objeto Date a partir de 'date' y 'time'
        let dateTime = new Date(`${currentDate}T${currentTime}`);

        // Añadir 'hours' al objeto Date
        dateTime = new Date(dateTime.getTime() + currentHours * 60 * 60 * 1000);

        // Actualizar 'date_download' y 'time_download' usando desestructuración de arrays
        this.itemSelected.performance_ton = (this.itemSelected.capacity * this.itemSelected.performance) / 100;
        [this.itemSelected.date_download] = dateTime.toISOString().split('T');
        [this.itemSelected.time_download] = dateTime.toTimeString().split(' ');
      }

      function convertTimeToSeconds(time) {
        const [hours, minutes] = time.split(':').map(Number);
        let seconds = Number(time.split(':')[2]);
        if (Number.isNaN(seconds)) {
          seconds = 0;
        }
        return hours * 3600 + minutes * 60 + seconds;
      }
      if (field === 'date_download' || field === 'time_download') {
        const timeDownloadSeconds = convertTimeToSeconds(this.itemSelected.time_download);
        const timeSeconds = convertTimeToSeconds(this.itemSelected.time);
        // Validar que 'date_download' no sea inferior a 'date'
        if (new Date(this.itemSelected.date_download) < new Date(this.itemSelected.date)) {
          showLoading('La fecha de descarga no puede ser inferior a la fecha de carga');
          this.itemSelected = originalValues;
        }

        if (new Date(this.itemSelected.date_download).toISOString().slice(0, 10) === new Date(this.itemSelected.date).toISOString().slice(0, 10)) {
          showLoading('La fecha de descarga es igual a la fecha de carga');
          if (timeDownloadSeconds <= timeSeconds) {
            showLoading('La hora de descarga no puede ser igual o inferior a la hora de carga');
            this.itemSelected = originalValues;
          }
        }

        // Combina la fecha y la hora en dos objetos Date
        const dateTimeDownload = new Date(`${this.itemSelected.date_download}T${this.itemSelected.time_download}`);
        const dateTime = new Date(`${this.itemSelected.date}T${this.itemSelected.time}`);

        // Calcula la diferencia en milisegundos
        const diffInMilliseconds = dateTimeDownload - dateTime;

        // Convierte la diferencia a horas
        const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

        // Actualizar 'hours' con las horas que da la operación de 'date', 'date_download', 'time' y 'time_download'
        this.itemSelected.hours = diffInHours;
      }

      if (field === 'capacity') {
        this.itemSelected.performance_ton = (this.itemSelected.capacity * this.itemSelected.performance) / 100;
      }
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
    async openModalChangeLoadOven(row) {
      this.$q.dialog({
        title: 'Cambiar Cargue Horno',
        message: 'Está seguro que desea cabiar el Cargue del horno?',
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
        let newAdjusment = [{}];
        if (row.capacity === null || row.performance === null || row.date === null || row.time === null || row.hours === null) {
          showLoading('Uno o más campos estan Incompletos. Por favor, completa todos los campos antes de continuar.', true);
          this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
          this.$q.loading.hide();
        } else {
          showLoading('Guardando cambios ...', 'Por favor, espere', true);
          this.itemSelected = {
            ...row,
            load: row.load === 0 ? 1 : 0,
          };
          if (row.load === 0) {
            newAdjusment = {
              date: row.date,
              yard: this.currentYard,
              origin: 'O',
              oven: row.id,
              user: localStorage.getItem('userMC'),
              material: [
                {
                  material: row.starting,
                  amount: row.capacity,
                  type: 'D',
                },
                {
                  material: row.medium,
                  amount: row.capacity,
                  type: 'A',
                },
              ],
            };
            console.log('LOAD', newAdjusment);
          } else {
            // console.log('>>>> Cancel', row);
            newAdjusment = {
              date: row.date_download,
              yard: this.currentYard,
              origin: 'O',
              oven: row.id,
              user: localStorage.getItem('userMC'),
              material: [
                {
                  material: row.medium,
                  amount: row.capacity,
                  type: 'D',
                },
                {
                  material: row.finished,
                  amount: row.performance_ton,
                  type: 'A',
                },
              ],
            };
          }
          try {
            // alert(localStorage.getItem('userMC'));
            await this.updateOven(this.itemSelected);
            await this.saveAdjustmentMixOrRiddle(newAdjusment);
            // El segundo método se ejecutará solo si el primero fue exitoso
          } catch (error) {
            console.error('Error al actualizar el horno o guardar el ajuste:', error);
            // Maneja el error según tus necesidades
          }
          await this.fetchBatteries(this.currentYard);
          this.showNotification(this.responseMessages, this.status, 'top-right', 5000);
          this.$q.loading.hide();
        }
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
      this.updateOvensTimestamp(row.ovens);
      setInterval(() => {
        console.log('verifica', row.ovens); // Verifica qué contiene itemselected
        if (row.ovens) {
          this.updateOvensTimestamp(row.ovens); // Actualiza cada timestamp de oven
          console.log('sec'); // Esto debería ejecutarse si itemselected es verdadero
        }
        this.updateDateTime();
      }, 60000);
      this.itemSelected = { ...row };
    },
    calculateDateTimeOvenSeconds(oven) {
      return moment(`${oven.date_download} ${oven.time_download}`, 'YYYY-MM-DD HH:mm').tz('America/Bogota').unix();
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

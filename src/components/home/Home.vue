<template>
  <div class="q-pa-md" justify-center items-center>
    <div class="justify-center q-mt-sm">
      <div class="row justify-center q-mt-sm">
        <div class="col">
          <home-card
            title="Tiquetes"
            subhead="Lista de tiquetes que estan en offline"
            :rows="ticketsRows"
          />
        </div>
      </div>
      <div class="row justify-center q-mt-sm">
        <home-card
          title="Materiales"
          subhead="Lista de materiales para usar en offline"
          :rows="materialsRows"
        />
        <home-card
          title="Patios"
          subhead="Lista de patios para usar en offline"
          :rows="yardsRows"
        />
      </div>
      <div class="row justify-center q-mt-sm">
        <home-card
          title="Terceros"
          subhead="Lista de terceros para usar en offline"
          :rows="thirdsRows"
        />
      </div>
    </div>
  </div>
</template>
<script>

import { mapState } from 'vuex';
import HomeCard from './card/HomeCard.vue';
import localDataManagementTypes from '../../store/modules/localDataManagement/types';

export default {
  data() {
    return {};
  },
  props: [],
  computed: {
    ...mapState(localDataManagementTypes.PATH, {
      thirds: 'localThirds',
      yards: 'localYards',
      materials: 'localMaterials',
      localDataManagementData: 'data',
    }),
    ticketsRows() {
      return this.localDataManagementData.map(({
        type,
        synchronized,
        date,
        time,
        driverDocument,
        driverName,
        licensePlate,
        trailerNumber,
        grossWeight,
        tareWeight,
        netWeight,
      }) => ({
        tipo: type,
        en_nube: synchronized === 1 ? 'SI' : 'NO',
        fecha: date,
        hora: time,
        doc_conductor: driverDocument,
        conductor: driverName,
        placa: licensePlate,
        trailer: trailerNumber,
        peso_bruto: grossWeight,
        peso_tara: tareWeight,
        peso_neto: netWeight,
      }));
    },
    thirdsRows() {
      return this.thirds.map(({
        nit,
        name,
        customer,
        associated,
        contractor,
      }) => ({
        nit,
        nombre: name,
        cliente: customer === 1 ? 'SI' : 'NO',
        proveedor: associated === 1 ? 'SI' : 'NO',
        transportador: contractor === 1 ? 'SI' : 'NO',
      }));
    },
    yardsRows() {
      return this.yards.map(({ code, name }) => ({
        codigo: code,
        nombre: name,
      }));
    },
    materialsRows() {
      return this.materials.map(({ code, name, unit }) => ({
        codigo: code,
        nombre: name,
        unidad: unit,
      }));
    },
  },
  components: {
    HomeCard,
  },
  mounted() {
    this.validateLogin();
  },
  methods: {
    validateLogin() {
      if (!localStorage.getItem('tokenMC')) {
        this.$router.push('/');
      }
    },
  },
};
</script>

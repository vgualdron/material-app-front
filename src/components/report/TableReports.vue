<template>
  <div class="q-pa-md">
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
    <div
      class="row"
    >
    <q-toggle
      v-model = "showListYards"
      color="green"
      label="Check en Base de datos de listar todos los movimientos"
    />
    </div>
    <q-form
      ref="formFilterRef"
      @submit="onFilterSubmit"
      class="q-gutter-md"
      v-if="showFilter"
    >
      <div class="row">
        <div
          class="col-12
          text-center"
        >
          <q-select
            dense
            outlined
            label="Reporte"
            v-model.trim="report"
            :options="allowedReports"
            option-label="text"
            option-value="value"
            lazy-rules
            hide-bottom-space
            map-options
            emit-value
            @input="resetForm"
          />
        </div>
      </div>
      <!-- MOVEMENTS REPORT -->
      <div
        v-show="report === 'movements'"
        class="row q-pt-none q-mt-xs"
      >
        <div
          class="col-lg-6 col-sm-12 col-xs-12 q-pr-md-none q-pr-sm-none q-pr-lg-xs"
        >
          <q-input
            v-if="report === 'movements'"
            dense
            outlined
            label="Fecha Inicio *"
            v-model="filter.startDate"
            :rules="rules.startDate"
            hide-bottom-space
            clearable
            mask="##/##/####"
            @click="$refs.qStartDateProxyRM.show()"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="qStartDateProxyRM"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="filter.startDate"
                    mask="DD/MM/YYYY"
                    :options="date =>  filter.finalDate ? date <= filter.finalDate.split('/').reverse().join('/') : true"
                    @input="$refs.qStartDateProxyRM.hide()"
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
          class="col-lg-6 col-sm-12 col-xs-12 q-pl-md-none q-pl-sm-none q-pl-lg-xs q-pt-md-xs q-pt-lg-none q-pt-sm-xs q-pt-xs-xs"
        >
          <q-input
            v-if="report === 'movements'"
            dense
            outlined
            label="Fecha Fin *"
            v-model="filter.finalDate"
            :rules="rules.finalDate"
            hide-bottom-space
            clearable
            mask="##/##/####"
            @click="$refs.qFinalDateProxyRM.show()"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="qFinalDateProxyRM"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="filter.finalDate"
                    mask="DD/MM/YYYY"
                    :options="date =>  filter.startDate ? date >= filter.startDate.split('/').reverse().join('/') : true"
                    @input="$refs.qFinalDateProxyRM.hide()"
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
      <div
        v-show="report === 'movements'"
        class="row q-pt-none q-mt-xs"
      >
        <div
          class="col-lg-6 col-sm-12 col-xs-12 q-pr-md-none q-pr-sm-none q-pr-lg-xs"
        >
          <q-select
            v-if="report === 'movements'"
            dense
            outlined
            label="Movimiento *"
            v-model.trim="filter.movement"
            :options="movements"
            option-label="text"
            option-value="value"
            hide-bottom-space
            map-options
            emit-value
            @input="resetOriginDestiny"
          />
        </div>
        <div
          class="col-lg-6 col-sm-12 col-xs-12 q-pl-md-none q-pl-sm-none q-pl-lg-xs q-pt-md-xs q-pt-lg-none q-pt-sm-xs q-pt-xs-xs"
        >
          <q-select
            v-if="report === 'movements'"
            dense
            outlined
            v-model="filter.material"
            class="q-mt-none"
            use-input
            clearable
            input-debounce="0"
            label="Material"
            :options="optionMaterial"
            option-label="name"
            option-value="id"
            lazy-rules
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
      </div>
      <div
        v-show="report === 'movements'"
        v-if="filter.movement !== null"
        class="row q-pt-none q-mt-xs"
      >
        <div
          class="col-lg-6 col-sm-12 col-xs-12 q-pr-md-none q-pr-sm-none q-pr-lg-xs"
        >
          <q-select
            v-if="report === 'movements' && (filter.movement === 'T' || filter.movement === 'V')"
            outlined
            dense
            v-model="filter.originYard"
            use-input
            clearable
            input-debounce="0"
            label="Patio Despacho"
            :options="optionOriginYards"
            option-label="name"
            option-value="id"
            @filter="filterOriginYard"
            lazy-rules
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
            v-if="report === 'movements' && filter.movement === 'C'"
            dense
            outlined
            v-model="filter.supplier"
            use-input
            clearable
            input-debounce="0"
            label="Proveedor"
            :options="optionSupplier"
            option-label="name"
            option-value="id"
            lazy-rules
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
        </div>
        <div
          class="col-lg-6 col-sm-12 col-xs-12 q-pl-md-none q-pl-sm-none q-pl-lg-xs q-pt-md-xs q-pt-lg-none q-pt-sm-xs q-pt-xs-xs"
        >
          <q-select
            v-if="report === 'movements' && (filter.movement === 'T' || filter.movement === 'C')"
            outlined
            dense
            v-model="filter.destinyYard"
            use-input
            clearable
            input-debounce="0"
            label="Patio Recepción"
            :options="optionDestinyYards"
            option-label="name"
            option-value="id"
            @filter="filterDestinyYard"
            lazy-rules
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
            v-if="filter.movement === 'V'"
            dense
            outlined
            v-model="filter.customer"
            class="q-mt-none"
            use-input
            clearable
            input-debounce="0"
            label="Cliente"
            :options="optionCustomer"
            option-label="name"
            option-value="id"
            lazy-rules
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
      </div>
      <!-- YARD STOCK TRANFER REPORT -->
      <div
        v-show="report === 'yardStock'"
        class="row q-mt-none q-pt-xs"
      >
        <div class="col">
          <q-input
            v-if="report === 'yardStock'"
            dense
            outlined
            label="Fecha Corte *"
            v-model="filter.finalDate"
            :rules="rules.finalDate"
            hide-bottom-space
            clearable
            mask="##/##/####"
            @click="$refs.qFinalDateProxyYS.show()"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="qFinalDateProxyYS"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="filter.finalDate"
                    mask="DD/MM/YYYY"
                    @input="$refs.qFinalDateProxyYS.hide()"
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
      <!-- PRODUCTIONS REPORT -->
      <div
        v-show="report === 'productions'"
        class="row q-pt-none q-mt-xs"
      >
        <div
          class="col-lg-6 col-sm-12 col-xs-12 q-pr-md-none q-pr-sm-none q-pr-lg-xs"
        >
          <q-input
            v-if="report === 'productions'"
            dense
            outlined
            label="Fecha Inicio *"
            v-model="filter.startDate"
            :rules="rules.startDate"
            hide-bottom-space
            clearable
            mask="##/##/####"
            @click="$refs.qStartDateProxyRM.show()"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="qStartDateProxyRM"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="filter.startDate"
                    mask="DD/MM/YYYY"
                    :options="date =>  filter.finalDate ? date <= filter.finalDate.split('/').reverse().join('/') : true"
                    @input="$refs.qStartDateProxyRM.hide()"
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
          class="col-lg-6 col-sm-12 col-xs-12 q-pl-md-none q-pl-sm-none q-pl-lg-xs q-pt-md-xs q-pt-lg-none q-pt-sm-xs q-pt-xs-xs"
        >
          <q-input
            v-if="report === 'productions'"
            dense
            outlined
            label="Fecha Fin *"
            v-model="filter.finalDate"
            :rules="rules.finalDate"
            hide-bottom-space
            clearable
            mask="##/##/####"
            @click="$refs.qFinalDateProxyRM.show()"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="qFinalDateProxyRM"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="filter.finalDate"
                    mask="DD/MM/YYYY"
                    :options="date =>  filter.startDate ? date >= filter.startDate.split('/').reverse().join('/') : true"
                    @input="$refs.qFinalDateProxyRM.hide()"
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
      <div
        v-show="report === 'productions'"
        class="row q-pt-none q-mt-xs"
      >

        <div
          class="col-lg-6 col-sm-12 col-xs-12 q-pl-md-none q-pl-sm-none q-pl-lg-xs q-pt-md-xs q-pt-lg-none q-pt-sm-xs q-pt-xs-xs"
        >
          <q-select
            v-if="report === 'productions'"
            dense
            outlined
            v-model="filter.material"
            class="q-mt-none"
            use-input
            clearable
            input-debounce="0"
            label="Material"
            :options="optionMaterial"
            option-label="name"
            option-value="id"
            lazy-rules
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
      </div>
      <div
        v-show="report === 'productions'"
        v-if="filter.movement !== null"
        class="row q-pt-none q-mt-xs"
      >
        <div
          class="col-lg-6 col-sm-12 col-xs-12 q-pr-md-none q-pr-sm-none q-pr-lg-xs"
        >
          <q-select
            v-if="report === 'productions' && (filter.movement === 'T' || filter.movement === 'V')"
            outlined
            dense
            v-model="filter.originYard"
            use-input
            clearable
            input-debounce="0"
            label="Patio Despacho"
            :options="optionOriginYards"
            option-label="name"
            option-value="id"
            @filter="filterOriginYard"
            lazy-rules
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
            v-if="report === 'productions' && filter.movement === 'C'"
            dense
            outlined
            v-model="filter.supplier"
            use-input
            clearable
            input-debounce="0"
            label="Proveedor"
            :options="optionSupplier"
            option-label="name"
            option-value="id"
            lazy-rules
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
        </div>
        <div
          class="col-lg-6 col-sm-12 col-xs-12 q-pl-md-none q-pl-sm-none q-pl-lg-xs q-pt-md-xs q-pt-lg-none q-pt-sm-xs q-pt-xs-xs"
        >
          <q-select
            v-if="report === 'productions' && (filter.movement === 'T' || filter.movement === 'C')"
            outlined
            dense
            v-model="filter.destinyYard"
            use-input
            clearable
            input-debounce="0"
            label="Patio Recepción"
            :options="optionDestinyYards"
            option-label="name"
            option-value="id"
            @filter="filterDestinyYard"
            lazy-rules
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
            v-if="filter.movement === 'V'"
            dense
            outlined
            v-model="filter.customer"
            class="q-mt-none"
            use-input
            clearable
            input-debounce="0"
            label="Cliente"
            :options="optionCustomer"
            option-label="name"
            option-value="id"
            lazy-rules
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
      </div>
      <!-- COMPLETE TRANFER REPORT -->
      <div
        v-show="report === 'completeTransfers'"
        class="row q-pt-none q-mt-xs"
      >
        <div
          class="col-lg-6 col-sm-12 col-xs-12 q-pr-md-none q-pr-sm-none q-pr-lg-xs"
        >
          <q-input
            v-if="report === 'completeTransfers'"
            dense
            outlined
            label="Fecha Inicio *"
            v-model="filter.startDate"
            :rules="rules.startDate"
            hide-bottom-space
            clearable
            mask="##/##/####"
            @click="$refs.qStartDateProxyCT.show()"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="qStartDateProxyCT"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="filter.startDate"
                    mask="DD/MM/YYYY"
                    :options="date =>  filter.finalDate ? date <= filter.finalDate.split('/').reverse().join('/') : true"
                    @input="$refs.qStartDateProxyCT.hide()"
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
          class="col-lg-6 col-sm-12 col-xs-12 q-pl-md-none q-pl-sm-none q-pl-lg-xs q-pt-md-xs q-pt-lg-none q-pt-sm-xs q-pt-xs-xs"
        >
          <q-input
            v-if="report === 'completeTransfers'"
            dense
            outlined
            label="Fecha Fin *"
            v-model="filter.finalDate"
            :rules="rules.finalDate"
            hide-bottom-space
            clearable
            mask="##/##/####"
            @click="$refs.qFinalDateProxyCT.show()"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="qFinalDateProxyCT"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="filter.finalDate"
                    mask="DD/MM/YYYY"
                    :options="date =>  filter.startDate ? date >= filter.startDate.split('/').reverse().join('/') : true"
                    @input="$refs.qFinalDateProxyCT.hide()"
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
      <div
        v-show="report === 'completeTransfers'"
        class="row q-pt-none q-mt-xs"
      >
        <div
          class="col-lg-6 col-sm-12 col-xs-12 q-pr-md-none q-pr-sm-none q-pr-lg-xs"
        >
          <q-select
            v-if="report === 'completeTransfers'"
            outlined
            dense
            v-model="filter.originYard"
            use-input
            clearable
            input-debounce="0"
            label="Patio Despacho"
            :options="optionOriginYards"
            option-label="name"
            option-value="id"
            @filter="filterOriginYard"
            lazy-rules
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
          class="col-lg-6 col-sm-12 col-xs-12 q-pl-md-none q-pl-sm-none q-pl-lg-xs q-pt-md-xs q-pt-lg-none q-pt-sm-xs q-pt-xs-xs"
        >
          <q-select
            v-if="report === 'completeTransfers'"
            outlined
            dense
            v-model="filter.destinyYard"
            use-input
            clearable
            input-debounce="0"
            label="Patio Recepción"
            :options="optionDestinyYards"
            option-label="name"
            option-value="id"
            @filter="filterDestinyYard"
            lazy-rules
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
      </div>
      <!-- UNCOMPLETE TRANFER REPORT -->
      <div
        v-show="report === 'uncompleteTransfers'"
        class="row q-pt-none q-mt-xs"
      >
        <div
          class="col-lg-6 col-sm-12 col-xs-12 q-pr-md-none q-pr-sm-none q-pr-lg-xs"
        >
          <q-input
            v-if="report === 'uncompleteTransfers'"
            dense
            outlined
            label="Fecha Inicio *"
            v-model="filter.startDate"
            :rules="rules.startDate"
            hide-bottom-space
            clearable
            mask="##/##/####"
            @click="$refs.qStartDateProxyUT.show()"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="qStartDateProxyUT"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="filter.startDate"
                    mask="DD/MM/YYYY"
                    :options="date =>  filter.finalDate ? date <= filter.finalDate.split('/').reverse().join('/') : true"
                    @input="$refs.qStartDateProxyUT.hide()"
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
          class="col-lg-6 col-sm-12 col-xs-12 q-pl-md-none q-pl-sm-none q-pl-lg-xs q-pt-md-xs q-pt-lg-none q-pt-sm-xs q-pt-xs-xs"
        >
          <q-input
            v-if="report === 'uncompleteTransfers'"
            dense
            outlined
            label="Fecha Fin *"
            v-model="filter.finalDate"
            :rules="rules.finalDate"
            hide-bottom-space
            clearable
            mask="##/##/####"
            @click="$refs.qFinalDateProxy.show()"
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
      <div
        v-show="report === 'uncompleteTransfers'"
        class="row q-pt-none q-mt-xs"
      >
        <div
          class="col-lg-6 col-sm-12 col-xs-12 q-pr-md-none q-pr-sm-none q-pr-lg-xs"
        >
          <q-select
            v-if="report === 'uncompleteTransfers'"
            outlined
            dense
            v-model="filter.originYard"
            use-input
            clearable
            input-debounce="0"
            label="Patio Despacho"
            :options="optionOriginYards"
            option-label="name"
            option-value="id"
            @filter="filterOriginYard"
            lazy-rules
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
          class="col-lg-6 col-sm-12 col-xs-12 q-pl-md-none q-pl-sm-none q-pl-lg-xs q-pt-md-xs q-pt-lg-none q-pt-sm-xs q-pt-xs-xs"
        >
          <q-select
            v-if="report === 'uncompleteTransfers'"
            outlined
            dense
            v-model="filter.destinyYard"
            use-input
            clearable
            input-debounce="0"
            label="Patio Recepción"
            :options="optionDestinyYards"
            option-label="name"
            option-value="id"
            @filter="filterDestinyYard"
            lazy-rules
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
      </div>
      <!-- UNBILLED PURCHASES REPORT -->
      <div
        v-show="report === 'unbilledPurchases'"
        class="row q-pt-none q-mt-xs"
      >
        <div
          class="col-lg-6 col-sm-12 col-xs-12 q-pr-md-none q-pr-sm-none q-pr-lg-xs"
        >
          <q-input
            v-if="report === 'unbilledPurchases'"
            dense
            outlined
            label="Fecha Inicio *"
            v-model="filter.startDate"
            :rules="rules.startDate"
            hide-bottom-space
            clearable
            mask="##/##/####"
            @click="$refs.qStartDateProxyUP.show()"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="qStartDateProxyUP"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="filter.startDate"
                    mask="DD/MM/YYYY"
                    :options="date =>  filter.finalDate ? date <= filter.finalDate.split('/').reverse().join('/') : true"
                    @input="$refs.qStartDateProxyUP.hide()"
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
          class="col-lg-6 col-sm-12 col-xs-12 q-pl-md-none q-pl-sm-none q-pl-lg-xs q-pt-md-xs q-pt-lg-none q-pt-sm-xs q-pt-xs-xs"
        >
          <q-input
            v-if="report === 'unbilledPurchases'"
            dense
            outlined
            label="Fecha Fin *"
            v-model="filter.finalDate"
            :rules="rules.finalDate"
            hide-bottom-space
            clearable
            mask="##/##/####"
            @click="$refs.qFinalDateProxy.show()"
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
      <div
        v-show="report === 'unbilledPurchases'"
        class="row q-pt-none q-mt-xs"
      >
        <div
          class="col-lg-6 col-sm-12 col-xs-12 q-pr-md-none q-pr-sm-none q-pr-lg-xs"
        >
          <q-select
            v-if="report === 'unbilledPurchases'"
            dense
            outlined
            v-model="filter.supplier"
            use-input
            clearable
            input-debounce="0"
            label="Proveedor"
            :options="optionSupplier"
            option-label="name"
            option-value="id"
            lazy-rules
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
        </div>
        <div
          class="col-lg-6 col-sm-12 col-xs-12 q-pl-md-none q-pl-sm-none q-pl-lg-xs q-pt-md-xs q-pt-lg-none q-pt-sm-xs q-pt-xs-xs"
        >
          <q-select
            v-if="report === 'unbilledPurchases'"
            dense
            outlined
            v-model="filter.material"
            class="q-mt-none"
            use-input
            clearable
            input-debounce="0"
            label="Material"
            :options="optionMaterial"
            option-label="name"
            option-value="id"
            lazy-rules
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
      </div>
      <!-- UBILLED SALES REPORT -->
      <div
        v-show="report === 'unbilledSales'"
        class="row q-pt-none q-mt-xs"
      >
        <div
          class="col-lg-6 col-sm-12 col-xs-12 q-pr-md-none q-pr-sm-none q-pr-lg-xs"
        >
          <q-input
            v-if="report === 'unbilledSales'"
            dense
            outlined
            label="Fecha Inicio *"
            v-model="filter.startDate"
            :rules="rules.startDate"
            hide-bottom-space
            clearable
            mask="##/##/####"
            @click="$refs.qStartDateProxyUS.show()"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="qStartDateProxyUS"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="filter.startDate"
                    mask="DD/MM/YYYY"
                    :options="date =>  filter.finalDate ? date <= filter.finalDate.split('/').reverse().join('/') : true"
                    @input="$refs.qStartDateProxyUS.hide()"
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
          class="col-lg-6 col-sm-12 col-xs-12 q-pl-md-none q-pl-sm-none q-pl-lg-xs q-pt-md-xs q-pt-lg-none q-pt-sm-xs q-pt-xs-xs"
        >
          <q-input
            v-if="report === 'unbilledSales'"
            dense
            outlined
            label="Fecha Fin *"
            v-model="filter.finalDate"
            :rules="rules.finalDate"
            hide-bottom-space
            clearable
            mask="##/##/####"
            @click="$refs.qFinalDateProxyUS.show()"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="qFinalDateProxyUS"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="filter.finalDate"
                    mask="DD/MM/YYYY"
                    :options="date =>  filter.startDate ? date >= filter.startDate.split('/').reverse().join('/') : true"
                    @input="$refs.qFinalDateProxyUS.hide()"
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
      <div
        v-show="report === 'unbilledSales'"
        class="row q-pt-none q-mt-xs"
      >
        <div
          class="col-lg-6 col-sm-12 col-xs-12 q-pr-md-none q-pr-sm-none q-pr-lg-xs"
        >
          <q-select
            v-if="report === 'unbilledSales'"
            dense
            outlined
            v-model="filter.customer"
            class="q-mt-none"
            use-input
            clearable
            input-debounce="0"
            label="Cliente"
            :options="optionCustomer"
            option-label="name"
            option-value="id"
            lazy-rules
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
          class="col-lg-6 col-sm-12 col-xs-12 q-pl-md-none q-pl-sm-none q-pl-lg-xs q-pt-md-xs q-pt-lg-none q-pt-sm-xs q-pt-xs-xs"
        >
          <q-select
            v-if="report === 'unbilledSales'"
            dense
            outlined
            v-model="filter.material"
            class="q-mt-none"
            use-input
            clearable
            input-debounce="0"
            label="Material"
            :options="optionMaterial"
            option-label="name"
            option-value="id"
            lazy-rules
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
      </div>
      <!-- UNBILLED FREIGHTS REPORT -->
      <div
        v-show="report === 'unbilledFreights'"
        class="row q-pt-none q-mt-xs"
      >
        <div
          class="col-lg-6 col-sm-12 col-xs-12 q-pr-md-none q-pr-sm-none q-pr-lg-xs"
        >
          <q-input
            v-if="report === 'unbilledFreights'"
            dense
            outlined
            label="Fecha Inicio *"
            v-model="filter.startDate"
            :rules="rules.startDate"
            hide-bottom-space
            clearable
            mask="##/##/####"
            @click="$refs.qStartDateProxyUF.show()"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="qStartDateProxyUF"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="filter.startDate"
                    mask="DD/MM/YYYY"
                    :options="date =>  filter.finalDate ? date <= filter.finalDate.split('/').reverse().join('/') : true"
                    @input="$refs.qStartDateProxyUF.hide()"
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
          class="col-lg-6 col-sm-12 col-xs-12 q-pl-md-none q-pl-sm-none q-pl-lg-xs q-pt-md-xs q-pt-lg-none q-pt-sm-xs q-pt-xs-xs"
        >
          <q-input
            v-if="report === 'unbilledFreights'"
            dense
            outlined
            label="Fecha Fin *"
            v-model="filter.finalDate"
            :rules="rules.finalDate"
            hide-bottom-space
            clearable
            mask="##/##/####"
            @click="$refs.qFinalDateProxyUF.show()"
          >
            <template v-slot:append>
              <q-icon
                name="event"
                class="cursor-pointer"
              >
                <q-popup-proxy
                  ref="qFinalDateProxyUF"
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="filter.finalDate"
                    mask="DD/MM/YYYY"
                    :options="date =>  filter.startDate ? date >= filter.startDate.split('/').reverse().join('/') : true"
                    @input="$refs.qFinalDateProxyUF.hide()"
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
      <div
        v-show="report === 'unbilledFreights'"
        class="row q-pt-none q-mt-xs"
      >
        <div
          class="col-lg-6 col-sm-12 col-xs-12 q-pr-md-none q-pr-sm-none q-pr-lg-xs"
        >
          <q-select
            v-if="report === 'unbilledFreights'"
            dense
            outlined
            v-model="filter.conveyorCompany"
            use-input
            clearable
            input-debounce="0"
            label="Empresa Transportadora"
            :options="optionConveyorCompany"
            option-label="name"
            option-value="id"
            reactive-rules
            @filter="filterConveyorCompany"
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
          class="col-lg-6 col-sm-12 col-xs-12 q-pl-md-none q-pl-sm-none q-pl-lg-xs q-pt-md-xs q-pt-lg-none q-pt-sm-xs q-pt-xs-xs"
        >
          <q-select
            v-if="report === 'unbilledFreights'"
            dense
            outlined
            v-model="filter.material"
            class="q-mt-none"
            use-input
            clearable
            input-debounce="0"
            label="Material"
            :options="optionMaterial"
            option-label="name"
            option-value="id"
            lazy-rules
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
      </div>
      <div
        v-if="this.report !== null && this.report !== ''"
        class="row text-center q-mt-none q-pt-xs"
      >
        <q-btn
          label="Buscar"
          type="submit"
          color="primary"
          class="col q-ml-sm"
        />
      </div>
    </q-form>
    <div v-if="data !== null && data.length > 0">
      <q-table
        :grid="$q.screen.xs"
        :data="data"
        :columns="columns"
        :rows-per-page-options="[0]"
        :hide-pagination="true"
        class="q-mt-md"
      >
      </q-table>
      <div class="row q-mt-md">
        <div
          class="col-12
          text-center"
        >
          <q-btn
            color="primary"
            label="Exportar"
            icon-right="file_download"
            @click="print()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import { mapState, mapActions } from 'vuex';
import reportTypes from '../../store/modules/report/types';
import commonTypes from '../../store/modules/common/types';
import yardTypes from '../../store/modules/yard/types';
import productionTypes from '../../store/modules/production/types';
import thirdTypes from '../../store/modules/third/types';
import materialTypes from '../../store/modules/material/types';
import { showNotifications } from '../../helpers/showNotifications';
import { showLoading } from '../../helpers/showLoading';
import { validateDate } from '../../helpers/validateDate';
import { removeAccents } from '../../helpers/removeAccents';
import { formatDateToSave } from '../../helpers/formatDateToSave';
import { getDateTime } from '../../helpers/getDateTime';
// import { user } from '../../src/store/modules/user';

export default {
  data() {
    return {
      route: '/report',
      name: 'Reportes',
      showFilter: true,
      showListYards: false,
      movements: [
        {
          value: null,
          text: 'TODOS',
        },
        {
          value: 'T',
          text: 'TRASLADO',
        },
        {
          value: 'C',
          text: 'COMPRA',
        },
        {
          value: 'V',
          text: 'VENTA',
        },
      ],
      filter: {
        startDate: null,
        finalDate: null,
        movement: null,
        customer: null,
        supplier: null,
        originYard: null,
        destinyYard: null,
        material: null,
        yard: null,
        conveyorCompany: null,
      },
      optionOriginYards: [],
      optionDestinyYards: [],
      optionCustomer: [],
      optionSupplier: [],
      optionConveyorCompany: [],
      optionMaterial: [],
      rules: {
        startDate: [
          (val) => (!!val) || 'La fecha de inicio es requerida',
          (val) => (validateDate(val) === true) || 'La fecha ingresada no es válida',
          (val) => (!this.filter.finalDate || (val.split('/').reverse().join('/') <= this.filter.finalDate.split('/').reverse().join('/'))) || 'La fecha de inicio no puede ser mayor a la fecha final',
        ],
        finalDate: [
          (val) => (!!val) || 'La fecha final es requerida',
          (val) => (validateDate(val) === true) || 'La fecha ingresada no es válida',
          (val) => (!this.filter.startDate || (val.split('/').reverse().join('/') >= this.filter.startDate.split('/').reverse().join('/'))) || 'La fecha final no puede ser menor a la fecha inicial',
        ],
      },
      report: '',
      data: [],
    };
  },
  async mounted() {
    this.setDefaultDates();
    console.log('start', this.filter.startDate);
    console.log('end', this.filter.finalDate);
    this.validateLogin();
    console.log('this.permissions', this.permissions);
    console.log('allowedReports', this.data);
  },
  created() { },
  computed: {
    ...mapState(reportTypes.PATH, [
      'reports',
      'responseMessages',
      'status',
    ]),
    ...mapState(commonTypes.PATH, [
      'permissions',
    ]),
    ...mapState(yardTypes.PATH, {
      yards: 'yards',
      yardStatus: 'status',
      yardResponseMessages: 'responseMessages',
    }),
    ...mapState(productionTypes.PATH, {
      productions: 'productions',
      productionStatus: 'status',
      productionResponseMessages: 'responseMessages',
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
    allowedReports() {
      const data = [];
      const stringReport = 'report.';
      this.permissions.forEach((e) => {
        if (e.name.includes(stringReport)) {
          data.push({
            text: e.displayName,
            value: e.name.replace(stringReport, ''),
          });
        }
      });
      return data;
    },
    columns() {
      let data = [];
      switch (this.report) {
        case 'movements':
          data = [
            {
              name: 'date',
              label: 'Fecha',
              align: 'left',
              field: 'date',
              sortable: true,
              visible: true,
            },
            {
              name: 'movement',
              label: 'Tipo',
              align: 'left',
              field: 'movement',
              sortable: true,
              visible: true,
            },
            {
              name: 'referralNumber',
              label: 'N° Remisión',
              align: 'left',
              field: 'referralNumber',
              sortable: true,
              visible: true,
            },
            {
              name: 'receiptNumber',
              label: 'N° Recibo',
              align: 'left',
              field: 'receiptNumber',
              sortable: true,
              visible: true,
            },
            {
              name: 'licensePlate',
              label: 'Placa',
              align: 'left',
              field: 'licensePlate',
              sortable: true,
              visible: true,
            },
            {
              name: 'trailerNumber',
              label: 'Trailer',
              align: 'left',
              field: 'trailerNumber',
              sortable: true,
              visible: true,
            },
            {
              name: 'driverName',
              label: 'Nom. Conductor',
              align: 'left',
              field: 'driverName',
              sortable: true,
              visible: true,
            },
            {
              name: 'driverDocument',
              label: 'Doc. Conductor',
              align: 'left',
              field: 'driverDocument',
              sortable: true,
              visible: true,
            },
            {
              name: 'originYard',
              label: 'P. Despacho / Proveedor',
              align: 'left',
              field: 'originYard',
              sortable: true,
              visible: true,
            },
            {
              name: 'destinyYard',
              label: 'P. Destino / Cliente',
              align: 'left',
              field: 'destinyYard',
              sortable: true,
              visible: true,
            },
            {
              name: 'conveyorCompany',
              label: 'Emp. Transportadora',
              align: 'left',
              field: 'conveyorCompany',
              sortable: true,
              visible: true,
            },
            {
              name: 'material',
              label: 'Material',
              align: 'left',
              field: 'material',
              sortable: true,
              visible: true,
            },
            {
              name: 'originNetWeight',
              label: 'Can. Despachada',
              align: 'left',
              field: 'originNetWeight',
              sortable: true,
              visible: true,
            },
            {
              name: 'destinyNetWeight',
              label: 'Can. Recibida',
              align: 'left',
              field: 'destinyNetWeight',
              sortable: true,
              visible: true,
            },
            {
              name: 'originDate',
              label: 'F. Despacho',
              align: 'left',
              field: 'originDate',
              sortable: true,
              visible: true,
            },
            {
              name: 'destinyDate',
              label: 'F. Recepción',
              align: 'left',
              field: 'destinyDate',
              sortable: true,
              visible: true,
            },
            {
              name: 'freightSettlementUnitValue',
              label: 'Val. Unit. Flete',
              align: 'left',
              field: 'freightSettlementUnitValue',
              sortable: true,
              visible: true,
            },
            {
              name: 'freightSettlementNetValue',
              label: 'Valor Flete',
              align: 'left',
              field: 'freightSettlementNetValue',
              sortable: true,
              visible: true,
            },
            {
              name: 'materialSettlementUnitValue',
              label: 'Val. Unit. Material',
              align: 'left',
              field: 'materialSettlementUnitValue',
              sortable: true,
              visible: true,
            },
            {
              name: 'materialSettlementNetValue',
              label: 'Valor Material',
              align: 'left',
              field: 'materialSettlementNetValue',
              sortable: true,
              visible: true,
            },
            {
              name: 'unitRoyalties',
              label: 'Val. Unit. Regalías',
              align: 'left',
              field: 'unitRoyalties',
              sortable: true,
              visible: true,
            },
            {
              name: 'royalties',
              label: 'Valor Regalías',
              align: 'left',
              field: 'royalties',
              sortable: true,
              visible: true,
            },
            {
              name: 'freightSettlementConsecutive',
              label: 'Liq. Flete',
              align: 'left',
              field: 'freightSettlementConsecutive',
              sortable: true,
              visible: true,
            },
            {
              name: 'materialSettlementConsecutive',
              label: 'Liq. Material',
              align: 'left',
              field: 'materialSettlementConsecutive',
              sortable: true,
              visible: true,
            },
            {
              name: 'movementId',
              label: 'Movimiento',
              align: 'left',
              field: 'movementId',
              sortable: true,
              visible: true,
            },
            {
              name: 'movementDate',
              label: 'F. Movimiento',
              align: 'left',
              field: 'movementDate',
              sortable: true,
              visible: true,
            },
            {
              name: 'freightInvoiceDate',
              label: 'F. Factura Flete',
              align: 'left',
              field: 'freightInvoiceDate',
              sortable: true,
              visible: true,
            },
            {
              name: 'freightInvoice',
              label: 'Factura Flete',
              align: 'left',
              field: 'freightInvoice',
              sortable: true,
              visible: true,
            },
            {
              name: 'freightInternalDocument',
              label: 'Doc. Int. Flete',
              align: 'left',
              field: 'freightInternalDocument',
              sortable: true,
              visible: true,
            },
            {
              name: 'materialInvoiceDate',
              label: 'F. Factura Material',
              align: 'left',
              field: 'materialInvoiceDate',
              sortable: true,
              visible: true,
            },
            {
              name: 'materialInvoice',
              label: 'Factura Material',
              align: 'left',
              field: 'materialInvoice',
              sortable: true,
              visible: true,
            },
            {
              name: 'materialInternalDocument',
              label: 'Doc. Int. Material',
              align: 'left',
              field: 'materialInternalDocument',
              sortable: true,
              visible: true,
            },
          ];
          break;

        case 'yardStock':
          data = [
            {
              name: 'yardName',
              label: 'Patio',
              align: 'left',
              field: 'yardName',
              sortable: true,
              visible: true,
            },
            {
              name: 'materialName',
              label: 'Material',
              align: 'left',
              field: 'materialName',
              sortable: true,
              visible: true,
            },
            {
              name: 'unit',
              label: 'Unidad',
              align: 'left',
              field: 'unit',
              sortable: true,
              visible: true,
            },
            {
              name: 'amount',
              label: 'Cantidad',
              align: 'left',
              field: 'amount',
              sortable: true,
              visible: true,
            },
          ];
          break;

        case 'productions':
          data = [
            {
              name: 'yardName',
              label: 'Patio',
              align: 'left',
              field: 'yardName',
              sortable: true,
              visible: true,
            },
            {
              name: 'batterieName',
              label: 'Bateria',
              align: 'left',
              field: 'batterieName',
              sortable: true,
              visible: true,
            },
            {
              name: 'ovenName',
              label: 'Horno',
              align: 'left',
              field: 'ovenName',
              sortable: true,
              visible: true,
            },
            {
              name: 'date_load',
              label: 'Fecha Cargue',
              align: 'left',
              field: 'date_load',
              sortable: true,
              visible: true,
            },
            {
              name: 'time',
              label: 'Hora Cargue',
              align: 'left',
              field: 'time',
              sortable: true,
              visible: true,
            },
            {
              name: 'startingName',
              label: 'Material Cargue',
              align: 'left',
              field: 'startingName',
              sortable: true,
              visible: true,
            },
            {
              name: 'capacity',
              label: 'Cargue Inicial',
              align: 'left',
              field: 'capacity',
              sortable: true,
              visible: true,
            },
            {
              name: 'mediumName',
              label: 'Material en Proceso',
              align: 'left',
              field: 'mediumName',
              sortable: true,
              visible: true,
            },
            {
              name: 'date_download',
              label: 'Fecha Descargue',
              align: 'left',
              field: 'dateDownload',
              sortable: true,
              visible: true,
            },
            {
              name: 'timeDownload',
              label: 'Hora DesCargue',
              align: 'left',
              field: 'timeDownload',
              sortable: true,
              visible: true,
            },
            {
              name: 'finishedName',
              label: 'Material Descargue',
              align: 'left',
              field: 'finishedName',
              sortable: true,
              visible: true,
            },
            {
              name: 'performanceTons',
              label: 'Cargue Final',
              align: 'left',
              field: 'performanceTons',
              sortable: true,
              visible: true,
            },
            {
              name: 'hours',
              label: 'Duracion Coccion Horas',
              align: 'left',
              field: 'hours',
              sortable: true,
              visible: true,
            },
            {
              name: 'performance',
              label: 'Rendimiento',
              align: 'left',
              field: 'performance',
              sortable: true,
              visible: true,
            },

          ];
          break;

        case 'completeTransfers':
          data = [
            {
              name: 'movement',
              label: 'Tipo',
              align: 'left',
              field: 'movement',
              sortable: true,
              visible: true,
            },
            {
              name: 'referralNumber',
              label: 'N° Remisión',
              align: 'left',
              field: 'referralNumber',
              sortable: true,
              visible: true,
            },
            {
              name: 'receiptNumber',
              label: 'N° Recibo',
              align: 'left',
              field: 'receiptNumber',
              sortable: true,
              visible: true,
            },
            {
              name: 'originDate',
              label: 'F. Despacho',
              align: 'left',
              field: 'originDate',
              sortable: true,
              visible: true,
            },
            {
              name: 'destinyDate',
              label: 'F. Recepción',
              align: 'left',
              field: 'destinyDate',
              sortable: true,
              visible: true,
            },
            {
              name: 'originLicensePlate',
              label: 'Placa Despacho',
              align: 'left',
              field: 'originLicensePlate',
              sortable: true,
              visible: true,
            },
            {
              name: 'destinyLicensePlate',
              label: 'Placa Recepción',
              align: 'left',
              field: 'destinyLicensePlate',
              sortable: true,
              visible: true,
            },
            {
              name: 'originTrailerNumber',
              label: 'Trailer Despacho',
              align: 'left',
              field: 'originTrailerNumber',
              sortable: true,
              visible: true,
            },
            {
              name: 'destinyTrailerNumber',
              label: 'Trailer Recepción',
              align: 'left',
              field: 'destinyTrailerNumber',
              sortable: true,
              visible: true,
            },
            {
              name: 'originDriverName',
              label: 'Nom. Conductor Despacho',
              align: 'left',
              field: 'originDriverName',
              sortable: true,
              visible: true,
            },
            {
              name: 'originDriverDocument',
              label: 'Doc. Conductor Despacho',
              align: 'left',
              field: 'originDriverDocument',
              sortable: true,
              visible: true,
            },
            {
              name: 'destinyDriverName',
              label: 'Nom. Conductor Recepción',
              align: 'left',
              field: 'destinyDriverName',
              sortable: true,
              visible: true,
            },
            {
              name: 'destinyDriverDocument',
              label: 'Doc. Conductor Recepción',
              align: 'left',
              field: 'destinyDriverDocument',
              sortable: true,
              visible: true,
            },
            {
              name: 'originOriginYard',
              label: 'Patio Despacho (Despacho)',
              align: 'left',
              field: 'originOriginYard',
              sortable: true,
              visible: true,
            },
            {
              name: 'originDestinyYard',
              label: 'Patio Recepción (Despacho)',
              align: 'left',
              field: 'originDestinyYard',
              sortable: true,
              visible: true,
            },
            {
              name: 'destinyOriginYard',
              label: 'Patio Despacho (Recepción)',
              align: 'left',
              field: 'destinyOriginYard',
              sortable: true,
              visible: true,
            },
            {
              name: 'destinyDestinyYard',
              label: 'Patio Recepción (Recepción)',
              align: 'left',
              field: 'destinyDestinyYard',
              sortable: true,
              visible: true,
            },
            {
              name: 'originConveyorCompanyName',
              label: 'Emp. Transportadora Despacho',
              align: 'left',
              field: 'originConveyorCompanyName',
              sortable: true,
              visible: true,
            },
            {
              name: 'destinyConveyorCompanyName',
              label: 'Emp. Transportadora Recepción',
              align: 'left',
              field: 'destinyConveyorCompanyName',
              sortable: true,
              visible: true,
            },
            {
              name: 'originMaterial',
              label: 'Material (Despacho)',
              align: 'left',
              field: 'originMaterial',
              sortable: true,
              visible: true,
            },
            {
              name: 'destinyMaterial',
              label: 'Material (Recepción)',
              align: 'left',
              field: 'destinyMaterial',
              sortable: true,
              visible: true,
            },
            {
              name: 'originNetWeight',
              label: 'Peso Neto Despacho',
              align: 'left',
              field: 'originNetWeight',
              sortable: true,
              visible: true,
            },
            {
              name: 'destinyNetWeight',
              label: 'Peso Neto Recepción',
              align: 'left',
              field: 'destinyNetWeight',
              sortable: true,
              visible: true,
            },
            {
              name: 'weightDifference',
              label: 'Diferencia Peso',
              align: 'left',
              field: 'weightDifference',
              sortable: true,
              visible: true,
            },
            {
              name: 'percentageWeightDifference',
              label: 'Porcentaje Diferencia Peso',
              align: 'left',
              field: 'percentageWeightDifference',
              sortable: true,
              visible: true,
            },
          ];
          break;

        case 'uncompleteTransfers':
          data = [
            {
              name: 'movement',
              label: 'Tipo',
              align: 'left',
              field: 'movement',
              sortable: true,
              visible: true,
            },
            {
              name: 'referralNumber',
              label: 'N° Remisión',
              align: 'left',
              field: 'referralNumber',
              sortable: true,
              visible: true,
            },
            {
              name: 'receiptNumber',
              label: 'N° Recibo',
              align: 'left',
              field: 'receiptNumber',
              sortable: true,
              visible: true,
            },
            {
              name: 'date',
              label: 'Fecha',
              align: 'left',
              field: 'date',
              sortable: true,
              visible: true,
            },
            {
              name: 'licensePlate',
              label: 'Placa',
              align: 'left',
              field: 'licensePlate',
              sortable: true,
              visible: true,
            },
            {
              name: 'trailerNumber',
              label: 'Trailer',
              align: 'left',
              field: 'trailerNumber',
              sortable: true,
              visible: true,
            },
            {
              name: 'driverName',
              label: 'Nombre Conductor',
              align: 'left',
              field: 'driverName',
              sortable: true,
              visible: true,
            },
            {
              name: 'driverDocument',
              label: 'Doc. Conductor',
              align: 'left',
              field: 'driverDocument',
              sortable: true,
              visible: true,
            },
            {
              name: 'originYard',
              label: 'Patio Despacho',
              align: 'left',
              field: 'originYard',
              sortable: true,
              visible: true,
            },
            {
              name: 'destinyYard',
              label: 'Patio Recepción',
              align: 'left',
              field: 'destinyYard',
              sortable: true,
              visible: true,
            },
            {
              name: 'conveyorCompany',
              label: 'Emp. Transportadora',
              align: 'left',
              field: 'conveyorCompany',
              sortable: true,
              visible: true,
            },
            {
              name: 'material',
              label: 'Material',
              align: 'left',
              field: 'material',
              sortable: true,
              visible: true,
            },
            {
              name: 'netWeight',
              label: 'Peso Neto',
              align: 'left',
              field: 'netWeight',
              sortable: true,
              visible: true,
            },
          ];
          break;

        case 'unbilledPurchases':
          data = [
            {
              name: 'movement',
              label: 'Tipo',
              align: 'left',
              field: 'movement',
              sortable: true,
              visible: true,
            },
            {
              name: 'referralNumber',
              label: 'N° Remisión',
              align: 'left',
              field: 'referralNumber',
              sortable: true,
              visible: true,
            },
            {
              name: 'receiptNumber',
              label: 'N° Recibo',
              align: 'left',
              field: 'receiptNumber',
              sortable: true,
              visible: true,
            },
            {
              name: 'date',
              label: 'Fecha',
              align: 'left',
              field: 'date',
              sortable: true,
              visible: true,
            },
            {
              name: 'licensePlate',
              label: 'Placa',
              align: 'left',
              field: 'licensePlate',
              sortable: true,
              visible: true,
            },
            {
              name: 'trailerNumber',
              label: 'Trailer',
              align: 'left',
              field: 'trailerNumber',
              sortable: true,
              visible: true,
            },
            {
              name: 'driverName',
              label: 'Nombre Conductor',
              align: 'left',
              field: 'driverName',
              sortable: true,
              visible: true,
            },
            {
              name: 'driverDocument',
              label: 'Doc. Conductor',
              align: 'left',
              field: 'driverDocument',
              sortable: true,
              visible: true,
            },
            {
              name: 'supplierName',
              label: 'Proveedor',
              align: 'left',
              field: 'supplierName',
              sortable: true,
              visible: true,
            },
            {
              name: 'destinyYard',
              label: 'Patio Destino',
              align: 'left',
              field: 'destinyYard',
              sortable: true,
              visible: true,
            },
            {
              name: 'material',
              label: 'Material',
              align: 'left',
              field: 'material',
              sortable: true,
              visible: true,
            },
            {
              name: 'netWeight',
              label: 'Peso Neto',
              align: 'left',
              field: 'netWeight',
              sortable: true,
              visible: true,
            },
            {
              name: 'materialSettlementUnitValue',
              label: 'Valor Unitario Material',
              align: 'left',
              field: 'materialSettlementUnitValue',
              sortable: true,
              visible: true,
            },
            {
              name: 'materialSettlementNetValue',
              label: 'Valor Material',
              align: 'left',
              field: 'materialSettlementNetValue',
              sortable: true,
              visible: true,
            },
            {
              name: 'unitRoyalties',
              label: 'Valor Unitario Regalias',
              align: 'left',
              field: 'unitRoyalties',
              sortable: true,
              visible: true,
            },
            {
              name: 'royalties',
              label: 'Valor Regalias',
              align: 'left',
              field: 'royalties',
              sortable: true,
              visible: true,
            },
            {
              name: 'settlementConsecutive',
              label: 'Consecutivo Liquidación',
              align: 'left',
              field: 'settlementConsecutive',
              sortable: true,
              visible: true,
            },
            {
              name: 'movementId',
              label: 'Movimiento',
              align: 'left',
              field: 'movementId',
              sortable: true,
              visible: true,
            },
            {
              name: 'movementDate',
              label: 'Fecha Movimiento',
              align: 'left',
              field: 'movementDate',
              sortable: true,
              visible: true,
            },
          ];
          break;

        case 'unbilledSales':
          data = [
            {
              name: 'movement',
              label: 'Tipo',
              align: 'left',
              field: 'movement',
              sortable: true,
              visible: true,
            },
            {
              name: 'referralNumber',
              label: 'Numero Remisión',
              align: 'left',
              field: 'referralNumber',
              sortable: true,
              visible: true,
            },
            {
              name: 'receiptNumber',
              label: 'Número Recibo',
              align: 'left',
              field: 'receiptNumber',
              sortable: true,
              visible: true,
            },
            {
              name: 'date',
              label: 'Fecha',
              align: 'left',
              field: 'date',
              sortable: true,
              visible: true,
            },
            {
              name: 'licensePlate',
              label: 'Placa',
              align: 'left',
              field: 'licensePlate',
              sortable: true,
              visible: true,
            },
            {
              name: 'trailerNumber',
              label: 'Trailer',
              align: 'left',
              field: 'trailerNumber',
              sortable: true,
              visible: true,
            },
            {
              name: 'driverName',
              label: 'Nom. Conductor',
              align: 'left',
              field: 'driverName',
              sortable: true,
              visible: true,
            },
            {
              name: 'driverDocument',
              label: 'Doc. Conductor',
              align: 'left',
              field: 'driverDocument',
              sortable: true,
              visible: true,
            },
            {
              name: 'customerName',
              label: 'Cliente',
              align: 'left',
              field: 'customerName',
              sortable: true,
              visible: true,
            },
            {
              name: 'destinyYard',
              label: 'Patio Destino',
              align: 'left',
              field: 'destinyYard',
              sortable: true,
              visible: true,
            },
            {
              name: 'material',
              label: 'Material',
              align: 'left',
              field: 'material',
              sortable: true,
              visible: true,
            },
            {
              name: 'netWeight',
              label: 'Peso Neto',
              align: 'left',
              field: 'netWeight',
              sortable: true,
              visible: true,
            },
            {
              name: 'materialSettlementUnitValue',
              label: 'Valor Unitario Material',
              align: 'left',
              field: 'materialSettlementUnitValue',
              sortable: true,
              visible: true,
            },
            {
              name: 'materialSettlementNetValue',
              label: 'Valor Material',
              align: 'left',
              field: 'materialSettlementNetValue',
              sortable: true,
              visible: true,
            },
            {
              name: 'unitRoyalties',
              label: 'Valor Unitario Regalías',
              align: 'left',
              field: 'unitRoyalties',
              sortable: true,
              visible: true,
            },
            {
              name: 'royalties',
              label: 'Valor Regalías',
              align: 'left',
              field: 'royalties',
              sortable: true,
              visible: true,
            },
            {
              name: 'settlementConsecutive',
              label: 'Consecutivo Liquidación',
              align: 'left',
              field: 'settlementConsecutive',
              sortable: true,
              visible: true,
            },
            {
              name: 'movementId',
              label: 'Movimiento',
              align: 'left',
              field: 'movementId',
              sortable: true,
              visible: true,
            },
            {
              name: 'movementDate',
              label: 'Fecha Movimiento',
              align: 'left',
              field: 'movementDate',
              sortable: true,
              visible: true,
            },
          ];
          break;

        case 'unbilledFreights':
          data = [
            {
              name: 'movement',
              label: 'Tipo',
              align: 'left',
              field: 'movement',
              sortable: true,
              visible: true,
            },
            {
              name: 'referralNumber',
              label: 'Numero Remisión',
              align: 'left',
              field: 'referralNumber',
              sortable: true,
              visible: true,
            },
            {
              name: 'receiptNumber',
              label: 'Número Recibo',
              align: 'left',
              field: 'receiptNumber',
              sortable: true,
              visible: true,
            },
            {
              name: 'originDate',
              label: 'Fecha Despacho',
              align: 'left',
              field: 'originDate',
              sortable: true,
              visible: true,
            },
            {
              name: 'destinyDate',
              label: 'Fecha Recepción',
              align: 'left',
              field: 'destinyDate',
              sortable: true,
              visible: true,
            },
            {
              name: 'licensePlate',
              label: 'Placa',
              align: 'left',
              field: 'licensePlate',
              sortable: true,
              visible: true,
            },
            {
              name: 'trailerNumber',
              label: 'Trailer',
              align: 'left',
              field: 'trailerNumber',
              sortable: true,
              visible: true,
            },
            {
              name: 'driverName',
              label: 'Nom. Conductor',
              align: 'left',
              field: 'driverName',
              sortable: true,
              visible: true,
            },
            {
              name: 'driverDocument',
              label: 'Doc. Conductor',
              align: 'left',
              field: 'driverDocument',
              sortable: true,
              visible: true,
            },
            {
              name: 'originYard',
              label: 'P. Despacho / Proveedor',
              align: 'left',
              field: 'originYard',
              sortable: true,
              visible: true,
            },
            {
              name: 'destinyYard',
              label: 'P. Recepción / Cliente',
              align: 'left',
              field: 'destinyYard',
              sortable: true,
              visible: true,
            },
            {
              name: 'material',
              label: 'Material',
              align: 'left',
              field: 'material',
              sortable: true,
              visible: true,
            },
            {
              name: 'conveyorCompany',
              label: 'Emp. Transportadora',
              align: 'left',
              field: 'conveyorCompany',
              sortable: true,
              visible: true,
            },
            {
              name: 'originNetWeight',
              label: 'Peso Neto Despacho',
              align: 'left',
              field: 'originNetWeight',
              sortable: true,
              visible: true,
            },
            {
              name: 'destinyNetWeight',
              label: 'Peso Neto Recepción',
              align: 'left',
              field: 'destinyNetWeight',
              sortable: true,
              visible: true,
            },
            {
              name: 'freightSettlementUnitValue',
              label: 'Valor Unitario Flete',
              align: 'left',
              field: 'freightSettlementUnitValue',
              sortable: true,
              visible: true,
            },
            {
              name: 'freightSettlementNetValue',
              label: 'Valor Flete',
              align: 'left',
              field: 'freightSettlementNetValue',
              sortable: true,
              visible: true,
            },
            {
              name: 'settlementConsecutive',
              label: 'Consecutivo Liquidación',
              align: 'left',
              field: 'settlementConsecutive',
              sortable: true,
              visible: true,
            },
            {
              name: 'movementId',
              label: 'Movimiento',
              align: 'left',
              field: 'movementId',
              sortable: true,
              visible: true,
            },
            {
              name: 'movementDate',
              label: 'Fecha Movimiento',
              align: 'left',
              field: 'movementDate',
              sortable: true,
              visible: true,
            },
          ];
          break;

        default:
          data = [];
          break;
      }
      return data;
    },
  },
  methods: {
    ...mapActions(reportTypes.PATH, {
      getMovements: reportTypes.actions.GET_MOVEMENTS,
      getYardStock: reportTypes.actions.GET_YARD_STOCK,
      getProduction: reportTypes.actions.GET_PRODUCTION,
      getCompleteTransfers: reportTypes.actions.GET_COMPLETE_TRANSFERS,
      getUncompleteTransfers: reportTypes.actions.GET_UNCOMPLETE_TRANSFERS,
      getUnbilledPurchases: reportTypes.actions.GET_UNBILLED_PURCHASES,
      getUnbilledSales: reportTypes.actions.GET_UNBILLED_SALES,
      getUnbilledFreights: reportTypes.actions.GET_UNBILLED_FREIGHTS,
      generatePrintDocument: reportTypes.actions.GENERATE_PRINT_DOCUMENT,
    }),
    ...mapActions(yardTypes.PATH, {
      listYards: yardTypes.actions.LIST_YARDS,
    }),
    ...mapActions(productionTypes.PATH, {
      listProductions: productionTypes.actions.LIST_PRODUCTIONS,
    }),
    ...mapActions(thirdTypes.PATH, {
      listThirds: thirdTypes.actions.LIST_THIRDS,
    }),
    ...mapActions(materialTypes.PATH, {
      listMaterials: materialTypes.actions.LIST_MATERIALS,
    }),
    showNotification(messages, status, align, timeout) {
      showNotifications(messages, status, align, timeout);
    },
    setDefaultDates() {
      const today = moment().format('YYYY-MM-DD'); // Obtiene la fecha de hoy con moment.js
      this.filter.startDate = this.formatDate(today);
      this.filter.finalDate = this.formatDate(today);
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY'); // Formatea cualquier fecha a 'DD/MM/YYYY' con moment.js
    },
    async onFilterSubmit() {
      showLoading('Cargando Reporte ...', 'Por favor, espere', true);
      if (this.report === 'movements') {
        const data = await this.setDataToSave(this.report);
        console.log('datamovenvio', data);
        await this.getMovements(data);
        if (this.status === true) {
          this.data = [...this.reports];
          console.log('dataMOVresponse', this.data);
        } else {
          this.data = [];
          showNotifications(this.responseMessages, this.status, 'top-right', 5000);
        }
      } else if (this.report === 'yardStock') {
        const data = await this.setDataToSave(this.report);
        await this.getYardStock(data);
        if (this.status === true) {
          this.data = [...this.reports];
        } else {
          this.data = [];
          showNotifications(this.responseMessages, this.status, 'top-right', 5000);
        }
      } else if (this.report === 'productions') {
        const data = await this.setDataToSave(this.report);
        await this.getProduction(data);
        if (this.status === true) {
          this.data = [...this.reports];
        } else {
          this.data = [];
          showNotifications(this.responseMessages, this.status, 'top-right', 5000);
        }
      } else if (this.report === 'completeTransfers') {
        const data = await this.setDataToSave(this.report);
        await this.getCompleteTransfers(data);
        if (this.status === true) {
          this.data = [...this.reports];
        } else {
          this.data = [];
          showNotifications(this.responseMessages, this.status, 'top-right', 5000);
        }
      } else if (this.report === 'uncompleteTransfers') {
        const data = await this.setDataToSave(this.report);
        await this.getUncompleteTransfers(data);
        if (this.status === true) {
          this.data = [...this.reports];
        } else {
          this.data = [];
          showNotifications(this.responseMessages, this.status, 'top-right', 5000);
        }
      } else if (this.report === 'unbilledPurchases') {
        const data = await this.setDataToSave(this.report);
        await this.getUnbilledPurchases(data);
        if (this.status === true) {
          this.data = [...this.reports];
        } else {
          this.data = [];
          showNotifications(this.responseMessages, this.status, 'top-right', 5000);
        }
      } else if (this.report === 'unbilledSales') {
        const data = await this.setDataToSave(this.report);
        await this.getUnbilledSales(data);
        if (this.status === true) {
          this.data = [...this.reports];
        } else {
          this.data = [];
          showNotifications(this.responseMessages, this.status, 'top-right', 5000);
        }
      } else if (this.report === 'unbilledFreights') {
        const data = await this.setDataToSave(this.report);
        await this.getUnbilledFreights(data);
        if (this.status === true) {
          this.data = [...this.reports];
        } else {
          this.data = [];
          showNotifications(this.responseMessages, this.status, 'top-right', 5000);
        }
      }
      this.$q.loading.hide();
    },
    filterOriginYard(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionOriginYards = this.yards.filter((yard) => (yard.id !== this.filter.destinyYard && removeAccents(yard.name).toLowerCase().indexOf(needle) > -1));
      });
    },
    filterDestinyYard(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionDestinyYards = this.yards.filter((yard) => (yard.id !== this.filter.originYard && removeAccents(yard.name).toLowerCase().indexOf(needle) > -1));
      });
    },
    filterSupplier(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionSupplier = this.thirds.filter((option) => (removeAccents(option.name).toLowerCase().indexOf(needle) > -1 && option.associated === 1));
      });
    },
    filterCustomer(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionCustomer = this.thirds.filter((option) => (removeAccents(option.name).toLowerCase().indexOf(needle) > -1 && option.customer === 1));
      });
    },
    filterMaterial(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionMaterial = this.materials.filter((option) => (removeAccents(option.name).toLowerCase().indexOf(needle) > -1));
      });
    },
    filterConveyorCompany(val, update) {
      update(() => {
        const needle = val ? removeAccents(val.trim().toLowerCase()) : '';
        this.optionConveyorCompany = this.thirds.filter((option) => (removeAccents(option.name).toLowerCase().indexOf(needle) > -1 && option.contractor === 1));
      });
    },
    async validateLogin() {
      if (parseInt(localStorage.getItem('listYardsMC'), 10) === 1) {
        // alert('Puede Listar todos los registros');
        showNotifications('Puede Listar todos los registros', true, 'top-right', 5000);
        this.showListYards = true;
      } else {
        // alert('Solo listara los registros asociados a su usuario');
        showNotifications('Solo listara los registros asociados a su usuario', true, 'top-right', 5000);
        console.log('user', localStorage.getItem('userMC'));
      }
      if (localStorage.getItem('tokenMC')) {
        showLoading('Cargando Formulario ...', 'Por favor, espere', true);
        await Promise.all([
          this.listYards({ id: 0, displayAll: 0 }),
          this.listThirds({
            displayAll: 0,
            type: '%20',
            third: '0',
            origin: '%20',
            startDate: '%20',
            finalDate: '%20',
          }),
          this.listMaterials({ displayAll: 0, id: 0 }),
        ]);
        if (this.yardStatus === false) {
          showNotifications(this.yardResponseMessages, this.yardStatus, 'top-right', 5000);
        }
        if (this.thirdStatus === false) {
          showNotifications(this.thirdResponseMessages, this.thirdStatus, 'top-right', 5000);
        }
        if (this.materialStatus === false) {
          showNotifications(this.materialResponseMessages, this.materialStatus, 'top-right', 5000);
        }
        this.$q.loading.hide();
      } else {
        this.$router.push('/');
      }
    },
    async setDataToSave(report) {
      let values = {};
      if (report === 'movements') {
        values = {
          movement: this.filter.movement || '%20',
          startDate: formatDateToSave(this.filter.startDate),
          finalDate: formatDateToSave(this.filter.finalDate),
          material: this.filter.material || 0,
          originYard: this.filter.movement === 'T' || this.filter.movement === 'V' ? (this.filter.originYard || 0) : (this.filter.supplier || 0),
          destinyYard: this.filter.movement === 'T' || this.filter.movement === 'C' ? (this.filter.destinyYard || 0) : (this.filter.customer || 0),
          user: parseInt(localStorage.getItem('userMC'), 10),
        };
      } else if (report === 'productions') {
        values = {
          startDate: formatDateToSave(this.filter.startDate),
          finalDate: formatDateToSave(this.filter.finalDate),
          material: this.filter.material || 0,
        };
      } else if (report === 'yardStock') {
        values = {
          date: formatDateToSave(this.filter.finalDate),
        };
      } else if (report === 'completeTransfers') {
        values = {
          startDate: formatDateToSave(this.filter.startDate),
          finalDate: formatDateToSave(this.filter.finalDate),
          originYard: this.filter.originYard || 0,
          destinyYard: this.filter.destinyYard || 0,
        };
      } else if (report === 'uncompleteTransfers') {
        values = {
          startDate: formatDateToSave(this.filter.startDate),
          finalDate: formatDateToSave(this.filter.finalDate),
          originYard: this.filter.originYard || 0,
          destinyYard: this.filter.destinyYard || 0,
        };
      } else if (report === 'unbilledPurchases') {
        values = {
          startDate: formatDateToSave(this.filter.startDate),
          finalDate: formatDateToSave(this.filter.finalDate),
          supplier: this.filter.supplier || 0,
          material: this.filter.material || 0,
        };
      } else if (report === 'unbilledSales') {
        values = {
          startDate: formatDateToSave(this.filter.startDate),
          finalDate: formatDateToSave(this.filter.finalDate),
          customer: this.filter.customer || 0,
          material: this.filter.material || 0,
        };
      } else if (report === 'unbilledFreights') {
        values = {
          startDate: formatDateToSave(this.filter.startDate),
          finalDate: formatDateToSave(this.filter.finalDate),
          conveyorCompany: this.filter.conveyorCompany || 0,
          material: this.filter.material || 0,
        };
      }
      return values;
    },
    print() {
      const indexReport = this.allowedReports.findIndex((e) => e.value === this.report);
      const dateTime = getDateTime();
      const { date } = dateTime;
      const dataColumns = [...this.columns];
      const objectColumns = {};
      dataColumns.forEach((e) => {
        objectColumns[e.field] = e.label;
      });
      const printObject = [];
      this.data.forEach((e) => {
        const keys = Object.keys(e);
        const objectToPush = {};
        keys.forEach((el) => {
          objectToPush[objectColumns[el]] = e[el] || '';
        });
        printObject.push(objectToPush);
      });
      this.generatePrintDocument({ data: printObject, fileName: `${this.allowedReports[indexReport].text}-${date}` });
    },
    resetOriginDestiny() {
      this.filter.originYard = null;
      this.filter.destinyYard = null;
      this.filter.supplier = null;
      this.filter.customer = null;
    },
    resetForm() {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
      this.data = [];
      this.filter = {
        startDate: formattedDate,
        finalDate: formattedDate,
        movement: null,
        customer: null,
        supplier: null,
        originYard: null,
        destinyYard: null,
        material: null,
        conveyorCompany: null,
      };
    },
  },
  components: {},
};
</script>

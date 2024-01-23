<template>
  <div class="q-pa-md" justify-center items-center>
    <div class="row justify-center q-mt-sm">
      <q-card class="my-card" flat bordered>
        <q-item>
          <q-item-section>
            <q-item-label>{{ title }}</q-item-label>
            <q-item-label caption>
              {{ subhead }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-card-section>
          <q-card-section class="col-4">
            <q-table
              :data="rows"
              row-key="name"
              :grid="$q.screen.lt.md"
            />
          </q-card-section>
        </q-card-section>

        <q-separator />

        <!-- <q-card-actions>
          <q-btn flat round icon="event" />
          <q-btn flat>
            7:30PM
          </q-btn>
          <q-btn flat color="primary">
            Reserve
          </q-btn>
        </q-card-actions> -->
      </q-card>
    </div>
  </div>
</template>
<script>

export default {
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    subhead: {
      type: String,
      default: '',
    },
    rows: {
      type: Array,
    },
    icon: {
      type: String,
      default: '',
    },
  },
  computed: {
  },
  mounted() {
  },
  methods: {
  },
};
</script>

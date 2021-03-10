<template>
  <v-img
    :aspect-ratio="aspectRatio"
    :height="height"
    :weight="weight"
    :src="srcWrapper"
    @error="onError"
    style="cover"
  >
    <template v-slot:placeholder>
      <v-row class="fill-height ma-0" align="center" justify="center">
        <v-progress-circular
          indeterminate
          color="grey lighten-5"
        ></v-progress-circular>
      </v-row>
    </template>

    <slot></slot>
  </v-img>
</template>

<script>
export default {
  name: 'PlaceholderImage',
  props: ['height', 'aspectRatio', 'src', 'weight', 'errorSrc'],
  data: () => ({
    isError: false
  }),
  watch: {
    src() {
      this.clear()
    }
  },
  computed: {
    srcWrapper() {
      if (!this.src || this.isError) {
        return this.errorSrc || ''
      }
      return this.src
    }
  },
  methods: {
    onError() {
      this.isError = true
      this.$emit('error')
    },
    clear() {
      this.isError = false
    }
  }
}
</script>

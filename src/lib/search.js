import Vue from 'vue'
import axios from 'axios'

export default new Vue({
  data: () => ({
    resultList: [],
    keyword: '',
    lng: null,
    lat: null,
    price_level: 0,
    rating: 0,
    start_from: 0,
    sort_by: null,
    items_per_page: 20,
    mapLng: null,
    mapLat: null
  }),
  methods: {
    search(args) {
      let url = `${window.APIBASE}/search?keyword=${args.keyword}`
      if (this.mapLat && this.mapLng) {
        url += `&lat=${this.mapLat}&lng=${this.mapLng}`
      }
      if ('price_level' in args) {
        url += `&price_level=${args.price_level}`
      }
      if ('rating' in args) {
        url += `&rating=${args.rating}`
      }
      if ('sort_by' in args) {
        url += `&sort_by=${args.sort_by}`
      }
      if ('items_per_page' in args) {
        url += `&items_per_page=${args.items_per_page}`
      } else {
        url += `&items_per_page=${this.items_per_page}`
      }
      if ('start_from' in args) {
        url += `&start_from=${args.start_from}`
      } else {
        url += `&start_from=${this.start_from}`
      }
      axios.get(url).then((res) => {
        let data = res.data
        if (data.error) {
          console.error(data)
          return
        }
        Vue.set(this, 'resultList', data.data)
        this.keyword = args.keyword
        this.lat = args.lat || null
        this.lng = args.lng || null
        this.price_level = args.price_level || 0
        this.rating = args.rating || 0
        this.sort_by = args.sort_by
        this.start_from = data.start_from
        this.items_per_page = data.items_per_page
      })
    },
    searchNearby(args) {
      let url = `${window.APIBASE}/search?lat=${args.lat}&lng=${args.lng}`
      if ('price_level' in args) {
        url += `&price_level=${args.price_level}`
      }
      if ('rating' in args) {
        url += `&rating=${args.rating}`
      }
      if ('sort_by' in args) {
        url += `&sort_by=${args.sort_by}`
      }
      if ('items_per_page' in args) {
        url += `&items_per_page=${args.items_per_page}`
      } else {
        url += `&items_per_page=${this.items_per_page}`
      }
      if ('start_from' in args) {
        url += `&start_from=${args.start_from}`
      } else {
        url += `&start_from=${this.start_from}`
      }
      axios.get(url).then((res) => {
        let data = res.data
        if (data.error) {
          console.error(data)
          return
        }
        Vue.set(this, 'resultList', data.data)

        this.keyword = ''
        this.lat = args.lat || null
        this.lng = args.lng || null
        this.price_level = args.price_level || 0
        this.rating = args.rating || 0
        this.sort_by = args.sort_by
        this.start_from = data.start_from
        this.items_per_page = data.items_per_page
      })
    },
    nextPage() {
      let url =
        `${window.APIBASE}/search?` +
        `start_from=${this.start_from + this.items_per_page}` +
        `&items_per_page=${this.items_per_page}`

      if (this.keyword) {
        url += `&keyword=${this.keyword}`
      }
      if (this.lat && this.lng) {
        url += `&lat=${this.lat}`
        url += `&lng=${this.lng}`
      }
      if (this.price_level) {
        url += `&price_level=${this.price_level}`
      }
      if (this.rating) {
        url += `&rating=${this.rating}`
      }

      axios.get(url).then((res) => {
        let data = res.data
        if (data.error) {
          console.error(data)
          return
        }
        this.resultList.concat(data.data)
        this.start_from = data.start_from
        this.items_per_page = data.items_per_page
      })
    },
    clear() {
      Vue.set(this, 'resultList', [])
    }
  }
})

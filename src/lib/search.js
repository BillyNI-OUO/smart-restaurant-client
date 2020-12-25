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
    startFrom: 0,
    itemsPerPage: 10,
    mapLng: null,
    mapLat: null
  }),
  methods: {
    search(args) {
      let url = `${window.APIBASE}/search?keyword=${args.keyword}`
      if ('price_level' in args) {
        url += `&price_level=${args['price_level']}`
      }
      if ('rating' in args) {
        url += `&rating=${args['rating']}`
      }
      if ('sort_by' in args) {
        url += `&sort_by=${args['sort_by']}`
      }
      axios.get(url).then((res) => {
        let data = res.data
        Vue.set(this, 'resultList', data.data)
        this.keyword = args.keyword
        this.lat = args.lat || null
        this.lng = args.lng || null
        this.price_level = args.price_level || 0
        this.rating = args.rating || 0
        this.startFrom = data.start_from
        this.itemsPerPage = data.items_per_page
      })
    },
    searchNearby(args) {
      let url = `${window.APIBASE}/search?lat=${args.lat}&lng=${args.lng}`
      if ('price_level' in args) {
        url += `&price_level=${args['price_level']}`
      }
      if ('rating' in args) {
        url += `&rating=${args['rating']}`
      }
      if ('sort_by' in args) {
        url += `&sort_by=${args['sort_by']}`
      }
      axios.get(url).then((res) => {
        let data = res.data
        Vue.set(this, 'resultList', data.data)

        this.keyword = ''
        this.lat = args.lat || null
        this.lng = args.lng || null
        this.price_level = args.price_level || 0
        this.rating = args.rating || 0
        this.startFrom = data.start_from
        this.itemsPerPage = data.items_per_page
      })
    },
    nextPage() {
      let url =
        `${window.APIBASE}/search?` +
        `start_from=${this.startFrom + this.itemsPerPage}` +
        `&items_per_page=${this.itemsPerPage}`

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
        this.resultList.concat(data.data)
        this.startFrom = data.start_from
        this.itemsPerPage = data.items_per_page
      })
    },
    clear() {
      Vue.set(this, 'resultList', [])
    }
  }
})

import Vue from 'vue'
import axios from 'axios'
import { APIBASE } from '../constant'

/*
navigator.geolocation.getCurrentPosition(
  (res) => {
    console.log(res)
    let lat = res.coords.latitude + 0
    let lng = res.coords.longitude - 0.008755
    this.searchNearby(lat, lng)
  },
  (err) => {
    console.error(err)
    alert('請開啟您的定位功能！')
  }
)
*/

export default new Vue({
  data: () => ({
    // ready: false,

    resultList: [],
    keyword: '',
    lng: null,
    lat: null,
    price_level: 0,
    rating: 0,
    start_from: 0,
    sort_by: null,
    items_per_page: 40,

    mapLng: null,
    mapLat: null
  }),
  methods: {
    search(args) {
      console.log(args)
      let url = `${APIBASE}/search?keyword=${args.keyword}`
      if (this.mapLat && this.mapLng) {
        url += `&lat=${this.mapLat}&lng=${this.mapLng}`
      }
      if ('price_level' in args) {
        url += `&price_level=${args.price_level}`
      }
      if ('filter_by' in args) {
        url += `&filter_by=${args.filter_by}`
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

        this.$ga.event({
          eventCategory: 'search',
          eventAction: 'searchDirect',
          eventLabel: 'direct',
          eventValue: data
        })
      })
    },
    searchNearby(args) {
      let url = `${APIBASE}/search?lat=${args.lat}&lng=${args.lng}`
      if ('price_level' in args) {
        url += `&price_level=${args.price_level}`
      }
      if ('rating' in args && args['rating']) {
        url += `&rating=${args.rating}`
      }
      if ('filter_by' in args && args['filter_by']) {
        url += `&filter_by=${args.filter_by}`
      }
      if ('sort_by' in args && args['sort_by']) {
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

        this.$ga.event({
          eventCategory: 'search',
          eventAction: 'searchNearby',
          eventLabel: 'nearby',
          eventValue: data
        })
      })
    },
    nextPage() {
      let url =
        `${APIBASE}/search?` +
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
    },
    geoPermissionQuery() {
      new Promise((resolve, reject) => {
        navigator.permissions.query({ name: 'geolocation' }).then((res) => {
          if (res.state === 'granted') {
            this.geoPermissionGranted = true
            resolve(true)
          } else {
            this.geoPermissionGranted = false
            reject()
          }
        })
      })
    },
    getUserPosition() {
      new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (res) => {
            let lat = res.coords.latitude + 0
            let lng = res.coords.longitude - 0.008755
            this.searchNearby(lat, lng)
            resolve({ lat, lng })
          },
          (err) => {
            console.error(err)
            alert('請開啟您的定位功能！')
            reject(err)
          }
        )
      })
    },

    isReady() {
      this.ready = true
      this.$emit('ready')
    },
    wait() {
      return new Promise((resolve) => {
        if (this.ready === true) {
          resolve()
        } else {
          this.$once('ready', () => resolve())
        }
      })
    }
  },
  created() {
    /*
    this.geoPermissionQuery()
      .then(this.getUserPosition())
      .then(() => {})
      .catch(() => { })
    */
  }
})

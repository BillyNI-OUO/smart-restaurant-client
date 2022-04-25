<template>
  <div>
    <div id="map"></div>
    <!-- point 1 -->
    <template v-if="!!this.google && !!this.map">
      <!-- point 2 -->
      <map-provider :google="google" :map="map">
        <slot />
      </map-provider>
    </template>
  </div>
</template>

<script>
import GoogleMapsApiLoader from 'google-maps-api-loader'
import MapProvider from './MapProvider'
import SearchEngine from '../lib/search'

export default {
  props: {
    mapConfig: Object,
    apiKey: String,
    markers: Array
  },
  components: {
    MapProvider
  },
  watch: {
    markers(newVal) {
      this.removeAllMarkers()

      for (let val of newVal) {
        this.addMarker(val)
      }

      if (newVal.length > 0) {
        let lats = newVal.map((v) => v.position.lat + this.adjustLat)
        let lngs = newVal.map((v) => v.position.lng + this.adjustLng)
        let bound = {
          south: Math.min(...lats),
          west: Math.min(...lngs),
          north: Math.max(...lats),
          east: Math.max(...lngs)
        }
        this.fitBounds(bound)
      }
    }
  },
  data() {
    return {
      google: null,
      map: null,
      markersInst: [],
      markersIds: [],
      adjustLat: 0,
      adjustLng: 0.008755,
      curlat: 25.0,
      curlng: 120.0
    }
  },
  mounted() {
    GoogleMapsApiLoader({
      apiKey: this.apiKey
    }).then((google) => {
      this.google = google
      this.getLocalCord()
      this.initializeMap()

      for (let val of this.markers) {
        this.addMarker(val)
      }
    })
  },
  methods: {
    getLocalCord() {
      /*navigator.geolocation.getCurrentPosition(
        position => {
          this.mapConfig.center.lat = position.coords.latitude
          //console.log(this.mapConfig)
          this.mapConfig.center.lng = position.coords.longitude
          this.mapConfig.zoom = 16
        },
        error => {
          console.log(error.message)
        },
      )*/
    },
    initializeMap() {
      const mapContainer = this.$el.querySelector('#map')
      const { Map } = this.google.maps
      
      this.map = new Map(mapContainer, this.mapConfig)

      this.map.addListener('zoom_changed', () => {
        this.$emit('zoom-changed', this.map.getZoom())
      })

      let center = this.map.getCenter()
      let adjustedCenter = {
        lat: center.lat() - this.adjustLat,
        lng: center.lng() - this.adjustLng
      }
      SearchEngine.mapLat = adjustedCenter.lat
      SearchEngine.mapLng = adjustedCenter.lng

      this.map.addListener('center_changed', () => {
        let center = this.map.getCenter()
        let adjustedCenter = {
          lat: center.lat() - this.adjustLat,
          lng: center.lng() - this.adjustLng
        }
        this.$emit('center-changed', adjustedCenter)
        SearchEngine.mapLat = adjustedCenter.lat
        SearchEngine.mapLng = adjustedCenter.lng
      })

      SearchEngine.$emit('map-ready')
    },

    removeAllMarkers() {
      for (let inst of this.markersInst) {
        inst.setMap(null)
      }
      this.markersInst.splice(0)

      for (let id of this.markersIds) {
        SearchEngine.$off(`marker-highlight-${id}`)
      }
    },

    addMarker(args) {
      const { Marker } = this.google.maps
      let adjustedPosition = {
        lat: args.position.lat + this.adjustLat,
        lng: args.position.lng + this.adjustLng
      }

      let marker = new Marker({
        position: adjustedPosition,
        map: this.map,
        title: args.title || 'Child marker!!',
        id: args.id
      })
      this.markersInst.push(marker)

      let labelMarker1 = new Marker({
        map: this.map,
        position: adjustedPosition,
        label: {
          // fontWeight: 'bold',
          color: 'black',
          fontSize: '16px',
          text: args.title.slice(0, 30),
          className: 'marker-label'
        },
        icon: {
          url: 'https://maps.google.com/mapfiles/kml/shapes/library_maps.png',
          scaledSize: new this.google.maps.Size(0, 0),
          origin: new this.google.maps.Point(0, 0),
          anchor: new this.google.maps.Point(0, 0),
          labelOrigin: new this.google.maps.Point(25, -30)
        }
      })
      this.markersInst.push(labelMarker1)

      if (args.aspectDescription) {
        let labelMarker2 = new Marker({
          map: this.map,
          position: adjustedPosition,
          label: {
            // fontWeight: 'bold',
            color: '#000000',
            fontSize: '12px',
            text: args.aspectDescription,
            className: 'marker-label'
          },
          icon: {
            url: 'https://maps.google.com/mapfiles/kml/shapes/library_maps.png',
            scaledSize: new this.google.maps.Size(0, 0),
            origin: new this.google.maps.Point(0, 0),
            anchor: new this.google.maps.Point(0, 0),
            labelOrigin: new this.google.maps.Point(25, -12)
          }
        })
        this.markersInst.push(labelMarker2)
      }

      marker.addListener('click', () => {
        this.$emit('marker-click', args.id)
        
        this.setZoom(18)
        this.setCenter(adjustedPosition)
        marker.setAnimation(this.google.maps.Animation.BOUNCE)
        setTimeout(()=> {marker.setAnimation(null)}, 1500)
        this.$router.push(`/detail/${args.id}`)
        // this.setCenter(args.position)
      })

      SearchEngine.$on(`marker-highlight-${args.id}`, () => {
        
        this.setZoom(18)
        this.setCenter(adjustedPosition)
        marker.setAnimation(this.google.maps.Animation.BOUNCE)
        setTimeout(()=> {marker.setAnimation(null)}, 1500)
          
        
      })


      this.markersIds.push(args.id)
    },

    setCenter(position) {
      this.map.setCenter(position)
      SearchEngine.mapLat = position.lat + this.adjustLat
      SearchEngine.mapLng = position.lng + this.adjustLng
    },

    fitBounds(bound) {
      this.map.fitBounds(bound, {
        left: this.$vuetify.breakpoint.mobile ? 20 : 450,
        bottom: 20,
        right: 20,
        top: 20
      })
    },

    setZoom(zoom) {
      this.map.setZoom(zoom)
    }
  }
}
</script>

<style>
#map {
  height: 100vh;
  width: 100%;
}

.marker-label {
  font-weight: bold;
  max-width: 10px;
  width: 10px;
  word-wrap: break-word;
  text-shadow: -1px -1px 0 #fff, -0.7px -0.7px 0 #fff, 1px -1px 0 #fff,
    0.7px -0.7px 0 #fff, -1px 1px 0 #fff, -0.7px 0.7px 0 #fff, 1px 1px 0 #fff,
    0.7px 0.7px 0 #fff;
}
</style>

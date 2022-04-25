// 'http://localhost'
import i18n from './plugins/vue-i18n'
export const APIBASE = 'https://smart-restaurant.duckdns.org'

export const NAME = i18n.t('CONSTANT.Name')

export const ASPECTS = [
  { key: 'food', title: i18n.t('ASPECT.Food') },
  { key: 'service', title: i18n.t('ASPECT.Service') },
  { key: 'atmosphere', title: i18n.t('ASPECT.Atmosphere') },
  { key: 'cleanliness', title: i18n.t('ASPECT.Cleanliness') },
  { key: 'value', title: i18n.t('ASPECT.Value') }
]

export const QUICK_DIRECT = [
  { key: 'nearby', text: i18n.t('QUICKDIRECT.Nearby'), searchText: i18n.t('QUICKDIRECT.NearbyText') },
  { key: 'food',text: i18n.t('QUICKDIRECT.Food'), searchText: i18n.t('QUICKDIRECT.FoodText') },
  { key: 'value',text: i18n.t('QUICKDIRECT.Value'), searchText: i18n.t('QUICKDIRECT.ValueText') },
  { key: 'atmosphere',text: i18n.t('QUICKDIRECT.Atmosphere'), searchText: i18n.t('QUICKDIRECT.AtmosphereText') },
  { key: 'service',text: i18n.t('QUICKDIRECT.Service'), searchText: i18n.t('QUICKDIRECT.ServiceText') }
]

export const GOOGLE_MAP_APIKEY = 'AIzaSyCraYyX2-6pxunceWYaHgr5l-bQyrfEnxM'
export const GOOGLE_MAP_MAPID = '7d0ee5dd5bfa9ee0'

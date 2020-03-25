import {CRUD} from '@/js/addons/api.js';

class HelpItemApi extends CRUD {

  get $controller() {
    return 'helps';
  }

  getRoot(params={}) {
    return this.request('list', {data: params}).then(r => r.data.content[0]);
  }
  getRootsTree(params={}) {
    return this.request('roots/tree', {data: params}).then(r => r.data.content);
  }
  getContent(itemKey) {
    return this.request('get/content', {options: {params: {helpItemKey: itemKey }}}).then(r => r.data);
  }
  setContent(itemKey, helpItemWithContent) {
    return this.request('edit/content', {options: {params: {helpItemKey: itemKey }}, data: helpItemWithContent}).then(r => r.data);
  }
  deleteHelpContent (itemKey) {
    return this.request('delete/content', {options: {params: {helpItemKey: itemKey }}}).then(r => r.data);
  }
  importZip (file) {
    return this.request('import/zip', {data: file, options: {headers: { 'Content-Type': 'multipart/form-data'}}}).then(r => r.data);

  }

}

export default HelpItemApi;

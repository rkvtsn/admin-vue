export default class Showable {
  constructor(value = null) {
    this.value = value;
    this.currentComponentName = '';
  }

  get isShow() {
    return this.currentComponentName !== null && this.currentComponentName !== '';
  }

  get component() {
    return this.currentComponentName;
  }

  show(componentName) {
    this.currentComponentName = componentName;
  }

  hide() {
    this.currentComponentName = '';
  }

  toggle(componentName) {
    if (!this.isShow)
      this.show(componentName);
    else
      this.hide();
  }
}

import NicWindow from './window/NicWindow';
import NicCombobox from './form/combobox';
import NicButton from './form/NicButton';

export default {
  install(Vue) {
    Vue.component (NicCombobox.name, NicCombobox);

    Vue.use (NicButton);
    Vue.use (NicWindow);
  },
};

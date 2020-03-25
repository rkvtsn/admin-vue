/**
 * Usage: 
 * 
 * <nic-progressbar :total="totalValue" :progress="currentValue" :extend-display-mode="noExtendDisplayMode"></nic-progressbar>
 * 
 * totalValue - итого
 * currentValue - текущее значение, текущая позиция
 * extendDisplayMode = показывать или нет расширенную информацию, текущее значение из возможных (3 из 12)
 * 
 * @author vvolovikov
 */
var u = window.u;

var NicProgressbar = {
    name: 'nic-progressbar',
    props: {
        progress: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            default: 100
        },
        extendDisplayMode: {
            type: Boolean,
            default: false
        }
    },
    updated: function(){
        this.progressBarWidth = this.$el.offsetWidth;
    },
    computed: {
        complete: function() {
            if (this.total == 0) {
                return 0;
            } else {
                return ((this.progress*100)/this.total).toFixed(1);
            }            
        },
        currentProgressWidth: function() {
            return ((this.progressBarWidth*this.complete)/100).toFixed(1);
        }
    },
    data: function() {
        return {
            progressBarWidth: 0
        };
    },
    methods: {
        
    },  
    template: '<div class="progressbar"><span class="progress" :style="{width:currentProgressWidth + \'px\'}"></span><span class="text">{{complete}}%<div v-if="extendDisplayMode"> ({{progress}} из {{total}})</div></span></div></div>'
};
var NicWellPlugin = {
    install: function install (Vue) {
        Vue.component(NicProgressbar.name, NicProgressbar);
    }
};
if (typeof module !== 'undefined') {
    module.exports = NicWellPlugin;
} else if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(NicWellPlugin);
}

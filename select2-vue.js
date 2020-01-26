Vue.component('v-select', {
    template: '<div>' +
        '<select class="form-control" :id="id" :name="name" :placeholder="placeholder" :disabled="disabled" :required="required"></select>' +
        '</div>',
    data() {
        return {
            select2: null
        };
    },
    model: {
        event: 'change',
        prop: 'value'
    },
    props: {
        id: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        options: {
            type: Array,
            default: () => []
        },
        disabled: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: false
        },
        settings: {
            type: Object,
            default: () => { }
        },
        value: null
    },
    watch: {
        options(val) {
            this.setOption(val);
        },
        value(val) {
            this.setValue(val);
        }
    },
    methods: {
        setOption(val = []) {
            this.select2.empty();
            this.select2.select2({
                ...this.settings,
                data: val
            });
            this.setValue(this.value);
        },
        setValue(val) {
            if (val instanceof Array) {
                this.select2.val([...val]);
            } else {
                this.select2.val([val]);
            }
            this.select2.trigger('change');
        },
        ajaxCall(inSelect2Params,inSuccessCallback,inFailCallback){
            var tmpPage=inSelect2Params.data.page||1;
            var tmpFilter=inSelect2Params.data.term||'';

            this.$emit('filterchanged', tmpFilter, tmpPage, inSuccessCallback ,inFailCallback);
        }
    },
    mounted() {
        var self=this;
        this.select2 = $(this.$el)
            .find('select')
            .select2({
                ...this.settings,
                data: this.options,
                ajax: {
                    transport: function (params, success, failure) {
                        self.ajaxCall(params, success, failure);
                    }
                  }
            })
            .on('select2:select select2:unselect', ev => {
                this.$emit('change', this.select2.val());
                this.$emit('select', ev['params']['data']);
            });
        this.setValue(this.value);
    },
    beforeDestroy() {
        this.select2.select2('destroy');
    }
});

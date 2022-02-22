<template>
    <div>
        <b-modal v-model="isAddMenuToDownload" :width="1000" scroll="keep">
            <header class="modal-card-head">
                <p class="modal-card-title">建立目錄樹狀結構</p>
                <button
                    class="delete"
                    aria-label="close"
                    @click="isAddMenuToDownload = false"
                ></button>
            </header>
            <section class="modal-card-body">
                <div class="tile is-ancestor">
                    <div class="tile is-7 is-parent">
                        <div class="tile is-child in-modal box">
                            <p class="title">目錄</p>
                            <treeselect
                                v-model="tempSelectMenu"
                                :multiple="true"
                                :options="treeShowMenu"
                                :sort-value-by="sortValueBy"
                                :value-consists-of="valueConsistsOf"
                                :limit="0"
                                :always-open="true"
                                :default-expand-level="1"
                                :max-height="400"
                                noChildrenText="無子目錄"
                            />
                        </div>
                    </div>
                    <div class="tile is-vertical is-parent">
                        <div class="tile is-child box">
                            <div class="content"><h5>簡介</h5></div>
                            <div class="content" style="max-height:30em; overflow:auto;">
                                <p v-text="wikiContentSnippet"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success" @click="addSelectedMenuItem">
                    保存結果
                </button>
                <button class="button" @click="cancelBookSelect">
                    取消
                </button>
            </footer>
        </b-modal>
        <div class="box">
            <div class="container">
                <nav class="level">
                    <div class="level-item has-text-centered" style="flex-shrink: 1;">
                        <h4 class="title is-4" :class="selectChapLen == 0 ? '' : 'purple' ">{{ link }}</h4>
                    </div>
                    <div class="level-right">
                        <b-button class="button is-primary is-medium" @click="getMenuOfContent">
                            <b-icon v-if="selectChapLen === 0 || selectChapLen === undefined" icon="search" pack="fas"></b-icon>
                            <div v-if="selectChapLen != 0">{{ selectChapLen }}</div>
                        </b-button>
                    </div>
                </nav>
            </div>
        </div>

        
        <!-- <section class="is-large">
            <VJstree 
                :data="ㄈ"
                show-checkbox
                multiple
                allow-batch
                whole-row
                draggable
                text-field-name="label"
                ref="tree"
                klass="tree-control"
            />
        </section> -->
    </div>
</template>

<script>
import {
    getSnippet,
    getWikisourceJson
} from './../tool';
import Treeselect from '@riophae/vue-treeselect';
// import VJstree from 'vue-jstree';
export default {
    name: 'GetTableContent',
    components: {
        Treeselect,
        // VJstree
    },
    data: function() {
        return {
            isAddMenuToDownload: false,
            tempSelectMenu: [],
            treeShowMenu: [],
            sortValueBy: 'INDEX',
            wikiContentSnippet: '',
            extendedLinks: [],
            valueConsistsOf: 'ALL',
            data: [
                {
                    'label': 'Same but with checkboxesSame but with checkboxesSame but with checkboxesSame but with checkboxesSame but with checkboxesSame but with checkboxesSame but with checkboxesSame but with checkboxesSame but with checkboxesSame but with checkboxesSame but with checkboxesSame but with checkboxes',
                    'id': 'wowowSame but with checkboxes',
                    'value': 'WOWOWOWOWO',
                    'children': [{
                        'label': 'initially selected',
                        'id': 'wowowinitially selected',
                        'selected': true
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'initially open',
                        'id': 'wowowinitially open',
                        'icon': 'fa fa-folder icon-state-default',
                        'opened': true,
                        'children': [{
                            'label': 'Another node',
                            'id': 'wowowAnother node'
                        }]
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-warning'
                    },
                    {
                        'label': 'disabled node',
                        'id': 'wowowdisabled node',
                        'icon': 'fa fa-check icon-state-success',
                        'disabled': true
                    }
                    ]
                },
                {
                    'label': 'Same but with checkboxes',
                    'id': 'wowowSame but with checkboxes',
                    'opened': true,
                    'children': [{
                        'label': 'initially selected',
                        'id': 'wowowinitially selected',
                        'selected': true
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-danger'
                    },
                    {
                        'label': 'initially open',
                        'id': 'wowowinitially open',
                        'icon': 'fa fa-folder icon-state-default',
                        'opened': true,
                        'children': [{
                            'label': 'Another node',
                            'id': 'wowowAnother node'
                        }]
                    },
                    {
                        'label': 'custom icon',
                        'id': 'wowowcustom icon',
                        'icon': 'fa fa-warning icon-state-warning'
                    },
                    {
                        'label': 'disabled node',
                        'id': 'wowowdisabled node',
                        'icon': 'fa fa-check icon-state-success',
                        'disabled': true
                    }
                    ]
                },
                {
                    'label': 'And wholerow selection',
                    'id': 'wowowAnd wholerow selection'
                },
                {
                    'label': 'drag disabled',
                    'id': 'wowowdrag disabled',
                    'icon': 'fa fa-warning icon-state-danger',
                    'dragDisabled': true
                },
                {
                    'label': 'drop disabled',
                    'id': 'wowowdrop disabled',
                    'icon': 'fa fa-warning icon-state-danger',
                    'dropDisabled': true
                }
            ],
            saveTemp: []
        };
    },
    props: ['link', 'index', 'saved'],
    computed: {
        selectChapLen() {
            return this.saved === undefined ? 0 : this.saved.menu.length;
        }
    },
    watch: {
        tempSelectMenu() {
            if( this.saved !== undefined ){
                this.tempSelectMenu = this.saved.menu;
            }
        }
    },
    methods: {
        getMenuOfContent: async function () {
            try {
                this.wikiContentSnippet = await getSnippet(this.link);
                this.treeShowMenu = await getWikisourceJson(
                    this.link,
                    0,
                    {
                    },
                    []
                );
                this.isAddMenuToDownload = true;
            } catch (error) {
                console.log('獲取失敗。');
            }
        },
        addSelectedMenuItem: function() {
            this.$emit('contentTableAdd', {
                index: this.index,
                searchName: this.link,
                menu: this.tempSelectMenu,
            });
            this.saveTemp = this.tempSelectMenu;
            this.isAddMenuToDownload = false;
        },
        cancelBookSelect: function() {
            this.tempSelectMenu = this.saveTemp;
            this.isAddMenuToDownload = false;
        }
    }
};
</script>


<style scoped>
.vue-treeselect__list-item {
  padding-left: 10px;
}


.vue-treeselect__control {
    display: none;
}

.in-modal {
    height:35em; 
    overflow:auto;
 }


.modal-card-body {
  height: 600px;
  overflow: auto;
}

.tree-control {
    white-space: pre-wrap;
    overflow: scroll;
}

.purple {
    color: purple;
}

@media screen and (max-width: 768px) {
    .modal-card-body {
        height: 30em;
        overflow: auto;
    }
}
</style>

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
                        <b-field grouped>
                            <p class="control">
                                <b-button class="button is-primary is-small" @click="addSelectedMenuItem(1)">
                                    內文全選
                                </b-button>
                            </p>
                            <p class="control">
                                <b-button class="button is-primary is-small" @click="getMenuOfContent">
                                    <span v-if="selectChapLen === 0 || selectChapLen === undefined">目錄檢選</span>
                                    <div v-if="selectChapLen != 0">{{ selectChapLen }}</div>
                                </b-button>
                            </p>
                        </b-field>
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
            saveTemp: []
        };
    },
    props: ['link', 'index', 'saved'],
    computed: {
        selectChapLen() {
            return this.tempSelectMenu.length;
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
                if( this.saved !== undefined ){
                    this.tempSelectMenu = this.saved.menu.slice();
                }
                this.isAddMenuToDownload = true;
            } catch (error) {
                console.log('獲取失敗。');
            }
        },
        addSelectedMenuItem: async function(flag = 0) {
            if(flag == 1) {
                await this.getMenuOfContent();
                if(this.treeShowMenu[0].children.length > 0) {
                    this.tempSelectMenu = this.treeShowMenu[0].children.map(x=>x.id);
                } else {
                    this.tempSelectMenu = this.treeShowMenu.map(x=>x.id);
                }
                this.isAddMenuToDownload = false;
            }
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

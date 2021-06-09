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
                    <div class="tile is-parent">
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
                    <div class="tile is-5 is-vertical is-parent">
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
                <button class="button" @click="isAddMenuToDownload = false">
                    取消
                </button>
            </footer>
        </b-modal>

        <div class="box">
            <b-field grouped>
                <b-button expanded type="is-static is-medium">{{ link }}</b-button>
                <p class="control">
                    <b-button class="button is-primary is-medium" @click="getMenuOfContent">
                        <span class="icon"><i class="fas fa-search"></i></span>
                    </b-button>
                </p>
            </b-field>
        </div>
    </div>
</template>

<script>
import {
    getSnippet,
    getWikisourceJson
} from './../tool';
import Treeselect from '@riophae/vue-treeselect';
export default {
    name: 'GetTableContent',
    components: {
        Treeselect
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
        };
    },
    props: ['link', 'index'],
    methods: {
        getMenuOfContent: async function () {
            this.wikiContentSnippet = await getSnippet(this.link);
            this.treeShowMenu = await getWikisourceJson(
                this.link,
                0,
                {
                },
                []
            );
            this.isAddMenuToDownload = true;
        },
        addSelectedMenuItem: function() {
            this.$emit('contentTableAdd', {
                index: this.index,
                searchName: this.link,
                menu: this.tempSelectMenu,
            });
            this.isAddMenuToDownload = false;
        },
    }
};
</script>


<style scoped>
.vue-treeselect__list-item {
  padding-left: 10px;
}

.vue-treeselect__menu {
    height: 450px;
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
</style>

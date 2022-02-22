<template>
    <div>
        <div class="content">
            <b-field>
                <b-button style="height:auto" :class=" isViewed ? 'is-success' : 'is-primary' " class="is-medium book-child" outlined expanded @click="isOpenBook = true">
                    {{ wikiBook }}
                </b-button>
                <p class="control">
                    <b-button style="height:auto" class="button is-medium is-danger" outlined @click="deleteBook"><b-icon icon="delete"></b-icon></b-button>
                </p>
            </b-field>
        </div>
        <!-- <b-modal v-model="isOpenBook" :width="1000" scroll="keep">
            <div class="card">
                <div class="card-content">
                    <div class="media">
                        <div class="media-content">
                            <label class="label is-large">獲取的WikiSource文本內容 </label>
                            <div class="block">
                                <nav class="level">
                                    <div class="level-left">
                                        <div class="level-item"><b-radio
                                            name="name"
                                            native-value="1"
                                            v-model.number="paragraphCutWay"
                                            @change="getViewArray"
                                        >
                                            以此卷作為一件
                                        </b-radio></div>
                                        <div class="level-item"><b-radio
                                            name="name"
                                            native-value="2"
                                            v-model.number="paragraphCutWay"
                                            @change="getViewArray"
                                        >
                                            以段落切開作為一件
                                        </b-radio></div>
                                        <div class="level-item"><b-radio
                                            name="name"
                                            native-value="3"
                                            v-model.number="paragraphCutWay"
                                            @change="getViewArray"
                                        >
                                            以自由分段作為分件（以####作為語法輸入）
                                        </b-radio></div>
                                        <div class="level-item"><b-button
                                            type="is-success is-small"
                                            @click="getViewArray(1)"
                                            outlined
                                        >
                                            檢視分段結果
                                        </b-button></div>
                                    </div>
                                </nav>
                                
                                
                                
                            </div>
                        </div>
                    </div>

                    <div v-if="!isPreview">
                        <textarea
                            class="textarea"
                            placeholder="10 lines of textarea"
                            v-model.lazy="pureText"
                            rows="20"
                        ></textarea>
                    </div>
                    <div class="content" v-if="isPreview">
                        <div v-for="(content, index) in viewContents" :key="index">
                            <textarea
                                class="textarea"
                                placeholder="10 lines of textarea"
                                v-text="content"
                                rows="5"
                                readonly
                            ></textarea>
                            <div class="is-divider"></div>
                        </div>
                    </div>
                </div>
                <footer class="modal-card-foot">
                    <section>
                        <b-field>
                            <b-checkbox v-model="isUrlAllow">
                                保存超連結
                            </b-checkbox>
                            <b-button type="is-success" outlined @click="sendWikiCutObj">確認分件方式</b-button>
                        </b-field>
                    </section>
                </footer>
            </div>
        </b-modal> -->

        <b-modal v-model="isOpenBook" :width="1000" scroll="keep">
            <header class="modal-card-head">
                <p class="modal-card-title">獲取的WikiSource文本內容</p>
                <b-checkbox v-model="isUrlAllow">
                    保存超連結
                </b-checkbox>
            </header>
            <section class="modal-card-body" height="30rem">
                <div class="tile is-ancestor">
                    <div class="tile is-7 is-parent">
                        <div class="tile is-child in-modal box">
                            <div class="card-content">
                                <div class="block">
                                    <nav class="level">
                                        <div class="level-left">
                                            <div class="level-item"><b-radio
                                                name="name"
                                                native-value="1"
                                                v-model.number="paragraphCutWay"
                                                @change="getViewArray"
                                            >
                                                以此卷作為一件
                                            </b-radio></div>
                                            <div class="level-item"><b-radio
                                                name="name"
                                                native-value="2"
                                                v-model.number="paragraphCutWay"
                                                @change="getViewArray"
                                            >
                                                以段落切開作為一件
                                            </b-radio></div>
                                                    
                                            
                                        </div>
                                    </nav>
                                    <nav class="level">
                                        <div class="level-left">
                                            <div class="level-item"><b-radio
                                                name="name"
                                                native-value="3"
                                                v-model.number="paragraphCutWay"
                                                @change="getViewArray"
                                            >
                                                自訂分段作為分件（以####作為語法輸入）
                                            </b-radio></div>
                                        </div>
                                    </nav>
                                
                                
                                
                                </div>

                                <textarea
                                    class="textarea"
                                    placeholder="10 lines of textarea"
                                    v-model.lazy="pureText"
                                    rows="17"
                                    @change="getViewArray"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="tile is-vertical is-parent">
                        <div class="tile is-child box">
                            <p class="title">分件結果檢視</p>
                            <div class="content" style="max-height:37em; overflow:auto;">
                                <div v-for="(content, index) in viewContents" :key="index">
                                    <textarea
                                        class="textarea"
                                        placeholder="10 lines of textarea"
                                        v-text="content"
                                        rows="5"
                                        readonly
                                    ></textarea>
                                    <div class="is-divider"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer class="modal-card-foot">
                <section>
                    <b-field>
                        <b-button type="is-success" outlined @click="sendWikiCutObj">確認分件方式</b-button>
                    </b-field>
                </section>
            </footer>
        </b-modal>
    </div>
</template>

<script>
import {
    parseHtmlText, getWikiPage, splitAriaConvert 
} from '../tool.js';

export default {
    name: 'BookChildContent',
    data: function () {
        return {
            isOpenBook: false,
            paragraphCutWay: 1,
            wikiObj: {
            },
            wikiText: {
                paragraphs: '',
                hyperlinks: '',
            },
            isUrlAllow: false,
            isViewed: false,
            viewContents: [],
            isPreview: false,

            //sidebar
            sideFullheight: true,
            sideFullwidth: false,
            sideRight: true,
            sideOpen: false
        };
    },
    props: ['wikiBook', 'order', 'bookOrder'],
    methods: {
        sendWikiCutObj: function () {
            this.$emit('handle-wiki', {
                title: this.wikiBook,
                order: this.order,
                paragraphCutWay: this.paragraphCutWay,
                isUrlAllow: this.isUrlAllow,
                wikiText: {
                    paragraphs: this.pureText,
                    hyperlinks: this.wikiText.hyperlinks,
                },
            });
            this.isOpenBook = false;
            this.isViewed = true;
        },
        getViewArray: function (param = 0) {
            this.viewContents = [];
            let useContent =
                this.isUrlAllow === true ? this.wikiText.hyperlinks : this.pureText;
            let re = '';
            if (this.paragraphCutWay === 2) {
                re = /\n/;
            } else if (this.paragraphCutWay === 3) {
                re = '####';
            }
            let cutParas =
            re === '' ? [useContent] : useContent.split(re).filter((text) => {
                //eslint-disable-next-line
                const testEmpty = new RegExp('^[\n \r]*$', 'sg');
                return !testEmpty.test(text);
                // return text;
            });
            this.$nextTick(function () {
                this.viewContents = cutParas;
            });
            if (param === 1) this.isPreview = !this.isPreview;
        },
        deleteBook: function () {
            this.$emit('delete-book', {
                bookOrder: this.bookOrder,
                chapOrder: this.order
            });
        }
    },
    computed: {
        pureText: {
            get: function () {
                return this.wikiText.hyperlinks.replace(
                    /\n{0,1}<Udef_wiki[^>]*>\n*([^<]*)\n*<\/Udef_wiki>\n{0,1}/gm,
                    '$1'
                );
            },
            set: function (val) {
                this.wikiText.hyperlinks = splitAriaConvert(
                    val,
                    this.wikiText.hyperlinks
                );
            },
        },
    },
    created: async function () {
        this.wikiObj = await getWikiPage(this.wikiBook);
        this.wikiText = parseHtmlText(this.wikiObj.text['*']);
        this.viewContents.push(this.wikiText.hyperlinks.replace(
            /\n{0,1}<Udef_wiki[^<]*>\n*([^<]*)\n*<\/Udef_wiki>\n{0,1}/gm,
            '$1'));
    },
    watch: {
        paragraphCutWay() {
            this.getViewArray();
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.book-child {
    white-space: pre-wrap;
    flex-wrap: wrap;
    overflow: auto;
}

.modal-card-body {
  max-height: 40em;
  overflow: auto;
}

@media screen and (max-width: 768px) {
    .modal-card-body {
        height: 30em;
        overflow: auto;
    }
}
</style>

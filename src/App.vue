<template>
    <div id="app">
        <nav class="navbar" role="navigation" aria-label="main navigation">
            <div class="navbar-end">
                <a
                    class="navbar-item"
                    target="_blank"
                    href="../../../index2_20181204.html"
                >
                    首頁
                </a>
                <a class="navbar-item" target="_blank" href="../../userMain/">
                    我的資料庫
                </a>
                <a
                    class="navbar-item"
                    target="_blank"
                    href="https://imgur.com/a/or62eEO"
                >
                    教學（暫）
                </a>
                <a
                    role="button"
                    class="navbar-burger"
                    aria-label="menu"
                    aria-expanded="false"
                >
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                    <span aria-hidden="true"></span>
                </a>
            </div>
        </nav>
        <b-modal v-model="isAddExtendedLinks" :width="1000" scroll="keep">
            <header class="modal-card-head">
                <p class="modal-card-title">選擇需要的關鍵字</p>
                <button
                    class="delete"
                    aria-label="close"
                    @click="confirmAdd(0)"
                ></button>
            </header>
            <section class="modal-card-body">
                <div v-for="(link, index) in refLinks" :key="index">
                    <label class="checkbox">
                        <input
                            type="checkbox"
                            :value="link"
                            v-model="selectRefLinks"
                        />{{ link }}
                    </label>
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success" @click="confirmAdd(1)">
                    保存結果
                </button>
                <button class="button" @click="confirmAdd(0)">取消</button>
            </footer>
        </b-modal>

        <b-modal v-model="isCheckBook" :width="1000" scroll="keep">
            <header class="modal-card-head">
                <p class="modal-card-title">目前已選書籍｜點擊可刪除書籍</p>
                <button
                    class="delete"
                    aria-label="close"
                    @click="isCheckBook = false"
                ></button>
            </header>
            <section class="modal-card-body">
                <div class="content">
                    <ul
                        v-for="(book, count) in selectedBookMenuPool"
                        :key="count"
                    >
                        <li>第{{ count + 1 }}本</li>
                        <ul v-for="(chap, ind) in book.menu" :key="ind">
                            <li>
                                <a
                                    href="#"
                                    @click="deleteChapter(count, ind)"
                                >{{ chap }}</a>
                            </li>
                        </ul>
                    </ul>
                </div>
            </section>
            <footer class="modal-card-foot">
                <button
                    class="button is-success"
                    @click="isCheckBook = false"
                >
                    返回
                </button>
            </footer>
        </b-modal>
        <div class="modal" :class="{ 'is-active': isAddMenuToDownload }">
            <div class="modal-background"></div>
            <div class="modal-card" style="min-width: 1000px">
                <header class="modal-card-head">
                    <p class="modal-card-title">選擇需要的關鍵字</p>
                    <button
                        class="delete"
                        aria-label="close"
                        @click="isAddMenuToDownload = false"
                    ></button>
                </header>
                <section class="modal-card-body is-large">
                    <div class="modal-box">
                        <div class="modal-box-select-content">
                            <treeselect
                                v-model="tempSelectMenu"
                                :multiple="true"
                                :options="treeShowMenu"
                                :sort-value-by="sortValueBy"
                                :value-consists-of="valueConsistsOf"
                                :auto-select-descendants="true"
                                :limit="10"
                                :always-open="true"
                                :default-expand-level="1"
                                :max-height="530"
                            />
                        </div>
                        <div class="modal-box-snippet">
                            <div class="content">
                                <h4>簡介</h4>
                                <p v-text="wikiContentSnippet"></p>
                            </div>
                        </div>
                        <hr />
                        <div class="modal-box-extend-link">
                            <div class="content">
                                <h4>可參考延伸資料</h4>
                            </div>
                            <div
                                v-for="(refLink, index) in refLinks"
                                :key="index"
                            >
                                <label class="checkbox">
                                    <input
                                        type="checkbox"
                                        :value="refLink"
                                        v-model="selectRefLinks"
                                    />
                                    {{ refLink }}
                                </label>
                            </div>
                        </div>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button
                        class="button is-success"
                        @click="addSelectedMenuItem"
                    >
                        保存結果
                    </button>
                    <button class="button" @click="isAddMenuToDownload = false">
                        取消
                    </button>
                </footer>
            </div>
        </div>

        <section class="hero is-info">
            <div class="hero-body">
                <div class="container">
                    <h1 class="title">Wiki2DocuXML</h1>
                    <h2 class="subtitle">DocuSky-維基文庫轉DocuXML</h2>
                </div>
            </div>
        </section>

        <div class="section">
            <div class="container">
                <label class="label is-large" title="不需完整標題">文本關鍵字搜索
                </label>
                <div class="field has-addons">
                    <div class="control">
                        <input
                            v-model="sourceWord"
                            class="input"
                            type="text"
                            placeholder="鄭氏紀事"
                            @keypress.enter="getQueryResult"
                        />
                    </div>
                    <div class="control">
                        <a class="button is-link" @click="getQueryResult">
                            搜尋
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <div class="section" v-if="isInputDataValid">
            <div class="container">
                <label class="label is-large">搜索關鍵字結果</label>
                <div class="is-divider"></div>
                <div class="field">
                    <div class="control">
                        <div class="columns is-multiline">
                            <div
                                class="column is-half"
                                v-for="(extendedLink, index) in extendedLinks"
                                :key="index"
                            >
                                <div
                                    class="columns"
                                    style="
                                        box-shadow: 2px 2px 2px 1px
                                            rgba(0, 0, 0, 0.2);
                                    "
                                >
                                    <div class="column">
                                        <div
                                            class="content"
                                            style="
                                                padding-top: 15px;
                                                padding-left: 10px;
                                            "
                                        >
                                            <h4>{{ extendedLink }}</h4>
                                        </div>
                                    </div>
                                    <div class="column" style="margin-top: 7px">
                                        <b-button
                                            type="is-primary"
                                            outlined
                                            @click="getMenuOfContent(index)"
                                        >
                                            我需要這本書</b-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="section">
            <div class="container">
                <label class="label is-large">目前已下載卷數檢視 & 分件｜
                    <b-button
                        class="is-primary"
                        @click="openSelectBookList"
                        outlined
                    >
                        察看目前已選章節
                    </b-button>
                </label>
                <div class="is-divider"></div>
                <div
                    class="columns is-multiline"
                    v-for="(book, index) in selectedBookMenuPool"
                    :key="index"
                >
                    <div
                        class="column is-one-quarter"
                        v-for="(chap, chapCount) in book.menu"
                        :key="chapCount"
                    >
                        <BookChildContent
                            @handle-wiki="handleWikiCutObj"
                            ref="contentTable"
                            :wiki-book.sync="chap"
                            :order="chapCount"
                        ></BookChildContent>
                    </div>
                </div>
                <b-button type="is-success" @click="openEditTable" outlined>確認分段</b-button>
                <div class="is-divider"></div>
            </div>
        </div>
        <!-- <div class="section">
            <div class="container">
                <label class="label is-large">分段完成｜檢視分件檔</label>
                <div class="is-divider"></div>
                <div class="columns is-multiline">
                    <div
                        class="column is-one-quarter"
                        v-for="(document, order) in splitCompleteWikiContents"
                        :key="order"
                    >
                        <SplitCompleteContent
                            :title="document.title"
                            :document="document.doc_content"
                            :index="order"
                        >
                        </SplitCompleteContent>
                    </div>
                </div>
            </div>
        </div> -->

        <b-modal v-model="isEditMetaTable" :width="1000" scroll="keep">
            <header class="modal-card-head">
                <label class="label">選擇需要的metadata欄位</label>
            </header>
            <section class="modal-card-body">
                <b-field label="檔案名稱前綴（EX：輸入X則會顯示為X_01.txt）">
                    <b-input v-model="fileNameMeta"></b-input>
                </b-field>
                <b-field label="文獻集名稱取名">
                    <b-input v-model="corpusNameMeta"></b-input>
                </b-field>
                <multiselect
                    v-model="selectedMetaDataColumns"
                    :options="selectMetaDataColumns"
                    :multiple="true"
                    :close-on-select="false"
                    :clear-on-select="false"
                    :preserve-search="true"
                    placeholder="Pick some"
                    label="headerName"
                    track-by="headerName"
                    :preselect-first="true"
                    :max-height="400"
                    ref="multiselect" 
                >
                    <template
                        slot="selection"
                        slot-scope="{ values, search, isOpen }"
                    >
                        <span
                            class="multiselect__single"
                            v-if="values.length &amp;&amp; !isOpen"
                        >
                            {{ values.length }} options selected
                        </span>
                    </template>
                </multiselect>
            </section>
            <footer class="modal-card-foot">
                <b-tooltip
                    label="下一步編輯Metadata與Tag！"
                    position="is-right"
                    :animated="false"
                    size="is-small"
                >
                    <b-button
                        class="is-primary"
                        @click="splitWikiContents"
                        outlined
                    >確認輸出
                    </b-button>
                </b-tooltip>
            </footer>
        </b-modal>                

        <div class="section dataHandsonTable" v-if="isEditMetadata">
            <div class="container">
                <div class="field">
                    <label class="label is-large">編輯metadata區域</label>
                    <div class="is-divider"></div>
                    <hot-table
                        :data.sync="splitCompleteWikiContents"
                        :rowHeaders="true"
                        :licenseKey="licenseKey"
                        width="100%"
                        height="600"
                        :autoRowSize="true"
                        :colHeaders="colHeaders"
                        :manualRowResize="true"
                        :manualColumnResize="[200, 250]"
                        :wordWrap="false"
                        :autoWrapCol="false"
                        ref="hotTableComponent"
                    >
                    </hot-table>
                </div>
                <b-button
                    class="is-primary"
                    @click="isCheckTag=true"
                    outlined
                >編輯完成
                </b-button>
            </div>
        </div>

        <div class="section" v-if="isCheckTag">
            <div class="container">
                <label class="label is-large">點擊檢視文本 & 編輯Tag</label>
                <div class="is-divider"></div>
                <div class="columns is-multiline">
                    <div
                        class="column is-one-quarter"
                        v-for="(document, order) in splitCompleteWikiContents"
                        :key="order"
                    >
                        <TagEdit
                            :fileName="document.title"
                            :content="document.doc_content"
                            :index="order"
                        >
                        </TagEdit>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {
    columnDefinition, colHeader, columns 
} from './data';
// import SplitCompleteContent from './components/SplitCompleteContent.vue';
import BookChildContent from './components/BookChildContent.vue';
import Treeselect from '@riophae/vue-treeselect';
import TagEdit from './components/TagEdit';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import {
    HotTable 
} from '@handsontable/vue';
import 'handsontable/dist/handsontable.full.css';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import {
    dt,
    $,
    getDeeperLink,
    searchWord,
    convertAlltoDocuments,
    convertAlltoParagraphs,
    convertParagraphToDocuments,
    getWikisourceJson,
    getSnippet,
    splitAndUrlHandler,
    createMetadataRows,
} from './tool.js';

export default {
    name: 'App',
    components: {
        // SplitCompleteContent,
        BookChildContent,
        Treeselect,
        HotTable,
        Multiselect,
        TagEdit
    },
    data: function () {
        return {
            isInputDataValid: true,
            isMetadataComplete: true,
            isKeepFormat: 'Yes',
            isAddHyperlink: true,
            urlFieldHint: '',
            isInputEmpty: false,
            wikiUrls: '',
            wikiContents: '',
            filename: '',
            isSeperateByParagraph: 'default',
            isAddExtendedLinks: false,
            isAddMenuToDownload: false,
            extendedLinks: [],
            confirmLinks: [],
            sourceWord: '',
            corpusName: '',
            corpusDefault: '文獻集名稱：預設「我的資料集」',
            tableOfContents: [],
            tempMenuList: [],
            treeShowMenu: [],
            sortValueBy: 'INDEX',
            valueConsistsOf: 'ALL',
            tempSelectMenu: [],
            selectedBookMenuPool: [],
            menuIndexCount: 0,
            refLinks: [],
            selectRefLinks: [],
            wikiContentSnippet: '',
            isCheckBook: false,
            kidsWord: '',
            testModal: true,
            isImageModalActive: false,
            wikiContentWaitCut: [],
            splitCompleteWikiContents: [],
            testSelCut: 1,
            selectMetaDataColumns: columnDefinition,
            selectedMetaDataColumns: [],
            licenseKey: 'non-commercial-and-evaluation',
            isEditMetadata: false,
            getSplitSheet: [],
            colHeaders: colHeader,
            columns: columns,
            isEditMetaTable: false,
            fileNameMeta: 'file',
            corpusNameMeta: '我的文獻集',
            isCheckTag: false,
            dataSchema: {
                title: '',
                corpus: '',
                author: '',
                doc_source: '',
                doc_topic_l1: '',
                doc_topic_l2: '',
                doc_topic_l3: '',
                geo_level1: '',
                geo_level2: '',
                geo_level3: '',
                geo_longitude: '',
                geo_latitude: '',
                doc_category_l1: '',
                doc_category_l2: '',
                doc_category_l3: '',
                docclass: '',
                docclass_aux: '',
                doctype: '',
                doctype_aux: '',
                book_code: '',
                time_orig_str: '',
                time_varchar: '',
                time_norm_year: '',
                era: '',
                time_norm_kmark: '',
                year_for_grouping: '',
                time_dynasty: '',
                doc_seq_number: '',
                timeseq_not_before: '',
                timeseq_not_after: '',
                doc_attachment: '',
                doc_att_caption: '',
                doc_content: '',
            },
        };
    },
    methods: {
        cleanUrlField: function () {
            this.wikiUrls = '';
            this.urlFieldHint = '';
            this.isInputEmpty = false;
            this.wikiDocuments = [];
        },
        getQueryResult: async function () {
            if (this.sourceWord == '') return;
            this.refLinks = [];
            this.selectRefLinks = [];
            this.confirmLinks = [];
            this.tableOfContents = [];
            this.refLinks = await searchWord(this.sourceWord);
            this.isAddExtendedLinks = true;
        },
        getMenuOfContent: async function (index) {
            this.wikiContentSnippet = await getSnippet(
                this.extendedLinks[index]
            );
            let targetFindExistedMenu = this.tableOfContents.find(
                (x) => x.index === index
            );
            this.menuIndexCount = index;
            if (targetFindExistedMenu != undefined) {
                this.treeShowMenu = targetFindExistedMenu.menu;
                this.isAddMenuToDownload = true;
            } else {
                this.tempMenuList = await getWikisourceJson(
                    this.extendedLinks[index],
                    0,
                    {
                    },
                    []
                );
                this.tableOfContents.push({
                    index: index,
                    searchName: this.extendedLinks[index],
                    menu: this.tempMenuList,
                });
                this.treeShowMenu = this.tempMenuList;
                this.isAddMenuToDownload = true;
            }
            this.tempMenuList = [];
            this.tempSelectMenu = [];
        },
        addSelectedMenuItem: function () {
            this.selectedBookMenuPool.push({
                menu: this.tempSelectMenu,
                bookName: this.treeShowMenu[0].id,
                index: this.menuIndexCount,
            });
            this.tempSelectMenu = [];
            this.confirmAdd(1);
            this.isAddMenuToDownload = false;
        },
        getRefLink: async function (index) {
            this.refLinks = [];
            let links = await getDeeperLink(this.extendedLinks[index]);
            this.refLinks.concat(links);
        },
        openSelectBookList: function () {
            this.selectedBookMenuPool.sort((x, y) => x.index - y.index);
            this.isCheckBook = true;
        },
        deleteChapter: function (count, ind) {
            this.selectedBookMenuPool[count].menu.splice(ind, 1);
        },
        openEditTable: function() {
            this.isEditMetaTable = true;
            this.$nextTick(function () {
                this.$refs.multiselect.activate();
            });
        },
        handleWikiCutObj: function (param) {
            this.wikiContentWaitCut.push(param);
        },
        splitWikiContents: function () {
            this.$refs.contentTable.forEach((element) => {
                if (!element.isViewed) element.sendWikiCutObj();
            });
            this.wikiContentWaitCut.sort(function (a, b) {
                return a.order > b.order ? 1 : -1;
            });
            this.splitCompleteWikiContents = splitAndUrlHandler(
                this.wikiContentWaitCut
            );
            this.splitCompleteWikiContents = createMetadataRows(
                this.splitCompleteWikiContents, 
                this.selectedMetaDataColumns,
                this.fileNameMeta,
                this.corpusNameMeta
            );
            this.$nextTick(function () {
                this.$refs.hotTableComponent.hotInstance.loadData(this.splitCompleteWikiContents);
            });
            this.colHeaders = ['文件標題', '文本內容', '檔案名稱', '文獻集名稱'];
            this.colHeaders = this.colHeaders.concat(this.selectedMetaDataColumns.map(x=>x.headerName));
            this.isEditMetadata = true;
            this.isEditMetaTable = false;
        },
        checkForm: function () {
            if (!this.wikiUrls) {
                this.urlFieldHint = 'is-danger';
                this.isInputEmpty = true;
                return 0;
            }
            return 1;
        },
        confirmAdd: function (flag) {
            if (flag)
                this.extendedLinks = this.extendedLinks.concat(
                    this.selectRefLinks
                );
            this.selectRefLinks = [];
            this.isAddExtendedLinks = false;
        },
        checkContentValue: function (obj) {
            obj.isFixContent = !obj.isFixContent;
            obj.isContentOpen = !obj.isContentOpen;
        },
        deleteContentValue: function (index) {
            this.wikiDocuments.splice(index, 1);
        },
        download: function () {
            let element = document.createElement('a');
            let filename =
                this.filename == ''
                    ? `${dt.getFullYear()}_${dt.getMonth()}_${dt.getDate()}.xml`
                    : this.filename;
            element.setAttribute(
                'href',
                'data:text/xml;charset=utf-8,' +
                    encodeURIComponent(this.wikiContents)
            );
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        },
        copyTestingCode() {
            let testingCodeToCopy = $('#wikiContents').select(function () {
                try {
                    alert('Testing code was copied ');
                } catch (err) {
                    alert('Oops, unable to copy');
                }
                /* unselect the range */
            });
            testingCodeToCopy.setAttribute('type', 'hidden');
            window.getSelection().removeAllRanges();
        },
        onCopy: function () {
            alert('Copying Success!!');
        },
        compressToParagraph: function () {
            this.wikiDocuments = this.wikiDocuments.sort(function (a, b) {
                return a.order > b.order ? 1 : -1;
            });
            for (let wikiDocument of this.wikiDocuments) {
                wikiDocument.isImport.corpus =
                    this.corpusName === '' ? '我的資料集' : this.corpusName;
            }
            let answer = '';
            if (this.isSeperateByParagraph == 'default') {
                answer = convertAlltoDocuments(
                    this.wikiDocuments,
                    this.isAddHyperlink
                );
            } else if (this.isSeperateByParagraph == 'seperateEachParagraph') {
                answer = convertParagraphToDocuments(
                    this.wikiDocuments,
                    this.isAddHyperlink
                );
            } else {
                answer = convertAlltoParagraphs(
                    this.wikiDocuments,
                    this.isAddHyperlink
                );
            }
            this.wikiContents = answer;
        },
        selectAllExtendLinks: function () {
            this.extendedLinks.forEach((ele) => {
                this.confirmLinks.push(ele);
            });
        },
        // reset: function () {
        //     this.newDocument = new WikiXmlMetadata();
        //     this.wikiDocuments = [];
        //     this.isInputDataValid = true;
        //     this.isMetadataComplete = true;
        //     this.isKeepFormat = "Yes";
        //     this.isAddHyperlink = true;
        //     this.urlFieldHint = "";
        //     this.isInputEmpty = false;
        //     this.wikiUrls = "";
        //     this.wikiContents = "";
        //     this.filename = "";
        //     this.isSeperateByParagraph = "default";
        //     this.isAddExtendedLinks = false;
        //     this.extendedLinks = [];
        //     this.confirmLinks = [];
        //     this.sourceWord = "";
        //     this.corpusName = "";
        //     this.corpusDefault = "文獻集名稱：預設「我的資料集」";
        // },
    },
};
</script>

<style scoped>
[v-cloak] {
    display: none;
}

.modal-card-body {
    min-height: 500px;
    overflow: auto;
}

.extend-link {
    max-height: 400px;
    overflow: auto;
}

.wiki-snippet {
    display: inherit;
    max-height: 200px;
    overflow: auto;
}

.table {
    min-width: 100%;
}

.vue-treeselect__list-item {
    padding-left: 10px;
}

.modal-box {
    display: flex;
    align-content: space-around;
    justify-content: space-around;
    flex-direction: column;
    flex-wrap: wrap;
    width: 960px;
    height: 580px;
}

.modal-box-select-content {
    width: 55%;
    height: 95%;
    overflow: auto;
    border-right: 2px ridge black;
    padding-right: 20px;
}

.modal-box-snippet {
    width: 41%;
    height: 30%;
    overflow: auto;
}

.modal-box-extend-link {
    width: 41%;
    height: 66%;
    overflow: auto;
}

hr {
    background-color: black;
    border: none;
    display: flex;
    height: 2px;
    margin: 6px 23px 1px -19px;
    width: 41%;
}

.dataHandsonTable {
    position: relative;
    z-index: 0;
}
</style>

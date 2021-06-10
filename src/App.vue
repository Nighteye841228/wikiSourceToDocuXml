<template>
    <div id="app">
        <section class="hero is-primary is-small">
            <!-- Hero head: will stick at the top -->
            <div class="hero-head">
                <nav class="navbar">
                    <div class="container">
                        <div class="navbar-menu">
                            <div class="navbar-start">
                                <div class="navbar-item">
                                    <h4 class="title is-4">Wiki2DocuXml</h4>
                                </div>
                            </div>
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
                        
                        </div>
                    </div>
                </nav>
            </div>
        </section>
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
                    <b-checkbox size="is-medium" :native-value="link" v-model="selectRefLinks">{{
                        link
                    }}</b-checkbox>
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success" @click="confirmAdd(1)">
                    保存結果
                </button>
                <button class="button" @click="confirmAdd(0)">取消</button>
            </footer>
        </b-modal>
        <b-modal v-model="isCheckBook" scroll="keep">
            <header class="modal-card-head">
                <p class="modal-card-title">目前已選書籍｜點擊可刪除書籍</p>
            </header>
            <section class="modal-card-body">
                <div class="content">
                    <ul v-for="(book, count) in selectedBookMenuPool" :key="count">
                        <li>第{{ count + 1 }}本</li>
                        <ul v-for="(chap, ind) in book.menu" :key="ind">
                            <li>
                                <a href="#" @click="deleteChapter(count, ind)">{{ chap }}</a>
                            </li>
                        </ul>
                    </ul>
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success" @click="isCheckBook = false">
                    返回
                </button>
            </footer>
        </b-modal>
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
                    @close="closeEventHandler"
                    ref="multiselect"
                >
                    <template slot="selection" slot-scope="{ values, search, isOpen }">
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
                    <b-button class="is-primary" @click="splitWikiContents" outlined>確認輸出
                    </b-button>
                </b-tooltip>
            </footer>
        </b-modal>

        


        
        <section class="section">
            <div class="container is-max-widescreen">
                <b-steps
                    v-model="activeStep"
                    :animated="isAnimated"
                    :rounded="isRounded"
                    :has-navigation="hasNavigation"
                    :icon-prev="prevIcon"
                    :icon-next="nextIcon"
                    :label-position="labelPosition"
                    :mobile-mode="mobileMode"
                    position="is-right"
                    :class="stepClass"
                    vertical
                >
                    <b-step-item step="1" label="關鍵字搜索" :clickable="isStepsClickable">
                        <section class="section wow">
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
                                    <a class="button is-link" @click="getQueryResult"> 搜尋 </a>
                                </div>
                            </div>
                        </section>              
                    </b-step-item>

                    <b-step-item step="2" label="選擇文本" :clickable="isStepsClickable" :type="{'is-success': isProfileSuccess}">
                        <section class="section wow" v-if="isInputDataValid">
                            <nav class="level">
                                <div class="level-left">
                                    <div class="level-item">
                                        <label class="label is-large">書本目錄檢視與選取</label>
                                    </div>
                                </div>
                                <div class="level-right">
                                    <div class="level-item">
                                        <b-button type="is-success" @click="activeStep = 2" outlined>選完了</b-button>
                                    </div>
                                </div>
                            </nav>
                            <div class="is-divider"></div> 
                            <div class="columns is-multiline">
                                <div v-for="(extendedLink, index) in extendedLinks"
                                     :key="index" class="column is-half"
                                >
                                    <GetTableContent 
                                        :link="extendedLink" 
                                        :index="index" 
                                        @contentTableAdd="addSelectedMenuItem" 
                                    />
                                </div>
                            </div>
                        </section>
                    </b-step-item>

                    <b-step-item step="3" label="選擇分件方式" :clickable="isStepsClickable" :type="{'is-success': isProfileSuccess}">
                        <section class="section wow">
                            <nav class="level">
                                <div class="level-left">
                                    <div class="level-item">
                                        <label class="label is-large">
                                            目前已下載卷數檢視 & 分件｜
                                        </label>
                                    </div>
                                    <div class="level-item">
                                        <p>
                                            未點擊文件：
                                        </p>
                                    </div>
                                    <div class="level-item">
                                        <b-checkbox v-model="isKeepHyperLink">
                                            保留超連結
                                        </b-checkbox>
                                    </div>
                                    <div class="level-item">
                                        <b-checkbox v-model="isCutFileByPara">
                                            以段分件
                                        </b-checkbox>
                                    </div>
                                </div>
                                <div class="level-right">
                                    <div class="level-item">
                                        <b-button type="is-success" @click="openEditTable" outlined>
                                            確認分件完成
                                        </b-button>
                                    </div>
                                </div>
                            </nav>
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
                                        @delete-book="deleteBook"
                                        ref="contentTable"
                                        :wiki-book.sync="chap"
                                        :bookOrder="index"
                                        :order="chapCount"
                                    ></BookChildContent>
                                </div>
                            </div>
                        </section>
                    </b-step-item>

                    <b-step-item step="4" label="編輯Metadata" :clickable="isStepsClickable" :type="{'is-success': isProfileSuccess}">
                        <section class="dataHandsonTable wow">
                            <nav class="level">
                                <div class="level-left">
                                    <div class="level-item">
                                        <label class="label is-large">編輯metadata區域｜</label>
                                        <div class="buttons">
                                            <b-button type="is-primary" @click="undoHot" outlined>
                                                <b-icon icon="undo" icon-pack="fas"></b-icon>
                                            </b-button>
                                            <b-button type="is-primary" @click="redoHot" outlined>
                                                <b-icon icon="redo" icon-pack="fas"></b-icon>
                                            </b-button>
                                        </div>
                                    </div>
                                </div>
                                <div class="level-right">
                                    <div class="level-it">
                                        <b-button class="is-success" @click="activeStep = 4" outlined>完成輸出｜編輯TAG
                                        </b-button>
                                    </div>
                                </div>
                            </nav>
                            
                            <div v-show="isEditMetadata">
                                <hot-table
                                    :data.sync="splitCompleteWikiContents"
                                    :rowHeaders="true"
                                    :licenseKey="licenseKey"
                                    height="480"
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
                        </section>
                    </b-step-item>

                    <b-step-item step="5" label="編輯Tag" :clickable="isStepsClickable" :type="{'is-success': isProfileSuccess}">
                        <section class="section wow">
                            <nav class="level">
                                <div class="level-left">
                                    <div class="level-item">
                                        <label class="label is-large">點擊檢視文本 & 編輯Tag｜</label>
                                    </div>
                                </div>
                                <div class="level-right">
                                    <div class="level-item">
                                        <b-button type="is-success" outlined @click="generateXml">輸出XML</b-button>
                                    </div>
                                </div>
                            </nav>
                            <b-field>
                                <multiselect 
                                    v-model="wikiTags" 
                                    tag-placeholder="新增自訂tag" 
                                    placeholder="選擇需要的tag或輸入自訂的tag名稱(請用英文)" 
                                    label="tagLabel" 
                                    track-by="tagName" 
                                    :close-on-select="false"
                                    :clear-on-select="false"
                                    :options="wikiTagOptions" 
                                    :multiple="true" 
                                    :taggable="true" 
                                    @remove="deleteAllTag"
                                    @tag="addContentTag"
                                >
                                </multiselect>
                            </b-field>
                            <div class="columns is-multiline">
                                <div
                                    class="column is-one-quarter"
                                    v-for="(document, order) in splitCompleteWikiContents"
                                    :key="order"
                                >
                                    <TagEdit
                                        :fileName="document.title + '/' + document.fileName"
                                        :content="document.doc_content"
                                        :index="order"
                                        :tagOptions="wikiTags"
                                        @handle-tag="handleWikiTag"
                                        ref="editTag"
                                    >
                                    </TagEdit>
                                </div>
                            </div>
                        </section>
                    </b-step-item>

                    <b-step-item step="6" label="輸出資料" :clickable="isStepsClickable" :type="{'is-success': isProfileSuccess}">
                        <section class="section wow">
                            <div class="buttons">
                                <b-button class="is-medium is-success" outlined>複製DocuXML到剪貼簿</b-button>
                                <b-button class="is-medium is-success" outlined>下載XML檔案進一步編輯</b-button>
                                <b-button class="is-medium is-success" outlined>直接上傳到DocuSky建庫</b-button>
                            </div>
                            <div class="content">
                                <ssh-pre language="xml" reactive>
                                    {{  xml }}
                                </ssh-pre>
                            </div>
                        </section>
                    </b-step-item>


                    <template
                        v-if="customNavigation"
                        #navigation="{previous, next}"
                    >
                        <b-button
                            outlined
                            type="is-danger"
                            icon-pack="fas"
                            icon-left="backward"
                            :disabled="previous.disabled"
                            @click.prevent="previous.action"
                        >
                            Previous
                        </b-button>
                        <b-button
                            outlined
                            type="is-success"
                            icon-pack="fas"
                            icon-right="forward"
                            :disabled="next.disabled"
                            @click.prevent="next.action"
                        >
                            Next
                        </b-button>
                    </template>
                </b-steps>
            </div>
        </section>
    </div>
</template>

<script>
import {
    columnDefinition, colHeader, columns 
} from './data';
// import SplitCompleteContent from './components/SplitCompleteContent.vue';
import BookChildContent from './components/BookChildContent.vue';
import TagEdit from './components/TagEdit';
import GetTableContent from './components/GetTableContent';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import SshPre from 'simple-syntax-highlighter';
import 'simple-syntax-highlighter/dist/sshpre.css';
import {
    HotTable 
} from '@handsontable/vue';
import 'handsontable/dist/handsontable.full.css';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import vkbeautify from 'vkbeautify';
import {
    dt,
    $,
    getDeeperLink,
    searchWord,
    splitAndUrlHandler,
    createMetadataRows,
} from './tool.js';
import {
    composeDocuXmlFile
} from './docuXml';
export default {
    name: 'App',
    components: {
        BookChildContent,
        HotTable,
        Multiselect,
        TagEdit,
        GetTableContent,
        SshPre
    },
    computed: {
        xml: function () {
            return vkbeautify.xml(this.showXmlString.replace(/\n/g, ''));
        }
    },
    data() {
        return {
            activeStep: 0,

            showSocial: false,
            isAnimated: true,
            isRounded: true,
            isStepsClickable: false,

            hasNavigation: true,
            customNavigation: false,
            isProfileSuccess: false,

            prevIcon: 'chevron-left',
            nextIcon: 'chevron-right',
            labelPosition: 'left',
            mobileMode: 'minimalist',
            stepClass: 'step-class',
            //above are step variable

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
            wikiTags: [],
            wikiTagOptions: [
                {
                    tagLabel: 'PersonName',
                    tagName: 'PersonName'
                },
                {
                    tagLabel: 'LocName',
                    tagName: 'LocName'
                },
                {
                    tagLabel: 'Date',
                    tagName: 'Date'
                },
                {
                    tagLabel: 'Office',
                    tagName: 'Office'
                },
            ],
            showXmlString: '',
            isKeepHyperLink: false,
            isCutFileByPara: false
        };
    },
    methods: {
        undoHot: function () {
            console.log('in');
            this.$refs.hotTableComponent.hotInstance.undo();
        },
        redoHot: function () {
            this.$refs.hotTableComponent.hotInstance.redo();
        },
        deleteBook: function (val) {
            let bookOrder = val.bookOrder;
            let chapOrder = val.chapOrder;
            if(this.selectedBookMenuPool.length){
                this.selectedBookMenuPool[bookOrder].menu.splice(chapOrder, 1);
            }
        },
        deleteAllTag: function (tag) {
            this.splitCompleteWikiContents.forEach((element) => {
                element.doc_content = element.doc_content
                    .replace(new RegExp(String.raw`<mark tag="${tag.tagName}">([^<]*)</mark>`, 'g'), '$1');
                console.log(element.doc_content);
            });
        },
        addContentTag: function (newTag) {
            const tag = {
                tagLabel: newTag,
                tagName: `Udef_${newTag}`
            };
            this.wikiTagOptions.push(tag);
            this.wikiTags.push(tag);
        },
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
            this.selectedBookMenuPool = [];
            this.refLinks = await searchWord(this.sourceWord);
            this.isAddExtendedLinks = true;
        },
        addSelectedMenuItem: function (val) {
            this.selectedBookMenuPool.push(val);
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
        openEditTable: function () {
            this.isEditMetaTable = true;
            this.$nextTick(function () {
                this.$refs.multiselect.activate();
            });
        },
        handleWikiCutObj: function (param) {
            this.wikiContentWaitCut.push(param);
            if(param.isUrlAllow && !this.wikiTagOptions.find(ele=>ele.tagLabel==='Wiki_url')) {
                this.wikiTagOptions.push({
                    tagLabel: 'Wiki_url',
                    tagName: 'Udef_wiki'
                });
                this.wikiTags.push({
                    tagLabel: 'Wiki_url',
                    tagName: 'Udef_wiki'
                });
            }
        },
        handleWikiTag: function (param) {
            console.log(param);
            this.splitCompleteWikiContents[param.index].doc_content = param.newContent;
        },
        splitWikiContents: function () {
            this.$refs.contentTable.forEach((element) => {
                if (!element.isViewed) {
                    if(this.isCutFileByPara) element.paragraphCutWay = 2;
                    if(this.isKeepHyperLink) element.isUrlAllow = true;
                    element.sendWikiCutObj();
                }
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
            this.isEditMetadata = true;
            this.$nextTick(function () {
                this.$refs.hotTableComponent.hotInstance.loadData(
                    this.splitCompleteWikiContents
                );
            });
            this.colHeaders = ['文件標題', '文本內容', '檔案名稱', '文獻集名稱'];
            this.colHeaders = this.colHeaders.concat(
                this.selectedMetaDataColumns.map((x) => x.headerName)
            );
            this.isEditMetaTable = false;
            this.activeStep = 3;
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
            if (flag) {
                this.extendedLinks = this.extendedLinks.concat(this.selectRefLinks);
                this.activeStep = 1;
            }
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
                'data:text/xml;charset=utf-8,' + encodeURIComponent(this.wikiContents)
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
        selectAllExtendLinks: function () {
            this.extendedLinks.forEach((ele) => {
                this.confirmLinks.push(ele);
            });
        },
        closeEventHandler: function () {
            this.$refs.multiselect.isOpen = true;
        },
        generateXml: function () {
            this.showXmlString = composeDocuXmlFile(
                this.splitCompleteWikiContents, 
                this.selectedMetaDataColumns,
                this.wikiTags,
                this.corpusNameMeta
            );
            this.activeStep = 5;  
        }
    },
};
</script>

<style scoped>
[v-cloak] {
  display: none;
}


.table {
  min-width: 100%;
}

.in-modal {
    max-height:50em; 
    overflow:auto;
 }


.modal-card-body {
  height: 600px;
  overflow: auto;
}



.wow {
    max-width: 59rem;
    height: 35rem;
    overflow: auto;
    padding-top: inherit;
}

.handsontable.htRowHeaders.htColumnHeaders {
  box-shadow: 10px 5px 7px grey;
}
</style>
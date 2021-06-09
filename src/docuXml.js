export function composeDocuXmlFile(wikiDocuments, metaData, tags, corpusName) {
    metaData = metaData.unshift([{
        field: 'title',
        headerName: '文件標題',
    },
    {
        field: 'doc_content',
        headerName: '文本內容',
    },
    {
        field: 'fileName',
        headerName: '檔案名稱',
    },
    {
        field: 'corpus',
        headerName: '文獻集名稱',
    }]);
    let finalXml = '';
    finalXml += composeDocuXmlHead(metaData, tags, corpusName);
    finalXml += composeDocuXmlDocument(wikiDocuments);
    finalXml = bindXmlVal('ThdlPrototypeExport', finalXml, false, [1, 1]);
    finalXml = '<?xml version="1.0"?>\n' + finalXml.replace(/\n\n/g, '\n');
    return finalXml;
}

function composeDocuXmlHead(metaData, tags, corpusName) {
    let corpusMetaString = '';
    let corpusTagString = '';
    let corpusXml = '';
    metaData.forEach((ele) => {
        let string = bindXmlVal(ele.field, ele.headerName, false, [0, 1]);
        string = addAttr('show_spotlight', 'Y', string, false);
        string = addAttr('display_order', '999', string, false);
        corpusMetaString += string;
    });
    corpusMetaString = bindXmlVal('metadata_field_settings', corpusMetaString, false, [1, 1]);
    tags.forEach((ele) => {
        let string = `<spotlight category="${ele.tagName}" sub_category="-" display_order="1" title="${ele.tagLabel}"/>\n`;
        string += `<tag type="contentTagging" name="${ele.tagName}" default_category="${ele.tagName}" default_sub_category="-"/>\n`;
        corpusTagString += string;
    });
    corpusTagString = bindXmlVal('feature_analysis', corpusTagString, false, [1, 1]);
    corpusXml = corpusMetaString + corpusTagString;
    corpusXml = bindXmlVal('corpus', corpusXml, false, [1, 1]);
    corpusXml = addAttr('name', corpusName, corpusXml, false);
    return corpusXml;
}

function composeDocuXmlDocument(wikiDocuments) {
    let combineDocument = wikiDocuments.map((wikiDocument) => {
        let documentString = '';
        let docContentTemp = '';
        let fileName = '';
        for (const [key, value] of Object.entries(wikiDocument)) {
            if (key !== 'doc_content' && key !== 'fileName') {
                documentString += bindXmlVal(key, value, false, [0, 1]);
            } else if (key === 'doc_content') {
                docContentTemp = value;
            } else if (key === 'fileName'){
                fileName = value;
            }            
        }
        docContentTemp = addPara(transMarkToTag(docContentTemp));
        documentString += bindXmlVal('doc_content', docContentTemp, false, [1, 1]);
        documentString = bindXmlVal('document', documentString, false, [1, 1]);
        documentString = addAttr('fileName', fileName, documentString, false);
        return documentString;
    }).join('');
    return bindXmlVal('documents', combineDocument, false, [1, 1]);
}

function addPara(string) {
    let str = string;
    let paraText = str.split('\n').map(ele => {
        return bindXmlVal('Paragraph', ele, false, [1, 1]);
    }).join('');
    return paraText;
}

function bindXmlVal(xmlName = '', word = '', isCap = false, isNewLine = [0, 0]) {
    let val = isCap ? wordCapitalize(xmlName) : xmlName ;
    let nl = ['', '\n'];
    return `<${val}>${nl[isNewLine[0]]}${word}${nl[isNewLine[0]]}</${val}>${nl[isNewLine[1]]}`;
}


function wordCapitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function addAttr(attrName = '', attrVal = '', destXml = '', isCap = false) {
    let head = destXml.match(/^<[^/\s>]*/);
    if (!head) return;
    let val = isCap ? wordCapitalize(attrName) : attrName;
    let countXmlNameLen = head[0].length;
    return `${head[0]} ${val}="${attrVal}"${destXml.slice(countXmlNameLen)}`;
}

function transMarkToTag (string) {
    let str = string;
    function transformMark(sentence, tag, target, text) {
        return `<${wordCapitalize(target)}${text}</${wordCapitalize(target)}>`;
    }

    function Cap(sen, target) {
        return `${wordCapitalize(target)}="`;
    }

    str = str
        .replace(/(<mark tag=)"([^"]*)"([^>]*>[^<]*)(<\/mark>)/g, transformMark)
        .replace(/(\w+)="/g, Cap)
        .replace(/(<((?!Term)[^>])*)>([^<]*)(<\/[^>]*>)/g, '$1 Term="$3">$3$4');
    return str;
}


let x = [
    {
        'title': '史記/卷001',
        'doc_content': '三家註版参阅<mark tag="Udef_wiki" term="维基百科" url="https://zh.wikipedia.org/wiki/%E7%BB%B4%E5%9F%BA%E7%99%BE%E7%A7%91">维基百科</mark>中的：三皇五帝、<mark tag="LocName">黄帝</mark>、颛顼、嚳、尧、舜 閲文言<mark tag="Udef_wiki" term="維基大典" url="https://zh.wikipedia.org/wiki/zh-classical:%E7%B6%AD%E5%9F%BA%E5%A4%A7%E5%85%B8">維基大典</mark>文：三皇五帝、黃帝、帝顓頊、帝嚳、帝堯、帝舜掃描版<mark tag="LocName">本這</mark>是此文本的<mark tag="Udef_wiki" term="武英殿本" url="https://zh.wikisource.org/wiki/Index:Records_of_the_Grand_Historian_-_Wu_Yingdian_Edition_-_volume_1.djvu">武英殿本</mark>的扫描图像。由於通常古籍版本衆多，而某些正文又經過校勘，故其中的文字\n僅供參考。黃帝者，少典之子，姓公孫，名曰軒轅。生而神靈，弱而能言，幼而徇齊[1]，<mark tag="PersonName">長而敦敏</mark>，成而聰明。',
        'fileName': 'file_01.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '軒轅之時，神農氏世衰。諸侯相侵伐，暴虐百姓，而神農氏弗能征。於是軒轅乃習用干戈，以征不享，諸侯咸來賓從。而蚩尤最爲暴，莫能伐。炎帝欲侵陵諸侯，諸侯咸歸軒轅。軒轅乃修德振兵，治五氣，蓺五種，撫萬民，度四方，教熊羆貔貅貙虎，以與炎帝戰於阪泉之野。三戰，然後得其志。蚩尤作亂，不用帝命。於是黃帝乃徵師諸侯，與蚩尤戰於涿鹿之野，遂禽殺蚩尤。而諸侯咸尊軒轅爲天子，代神農氏，是爲黃帝。天下有不順者，黃帝從而征之，平者去之，披山通道，未嘗寧居。',
        'fileName': 'file_02.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '東至于海，登丸山，及岱宗。西至于空桐，登雞頭。南至于江，登熊、湘。北逐葷粥，合符釜山，而邑于涿鹿之阿。遷徙往來無常處，以師兵爲營衞。官名皆以雲命，爲雲師。置左右大監，監于萬國。萬國和，而鬼神山川封禪與爲多焉。獲寶鼎，迎日推筴。舉風后、力牧、常先、大鴻以治民。順天地之紀、幽明之占、死生之說、存亡之難。時播百穀草木，淳化鳥獸蟲蛾，旁羅日月星辰水波土石金玉，勞勤心力耳目，節用水火材物。有土德之瑞，故號黃帝。',
        'fileName': 'file_03.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '黃帝二十五子，其得姓者十四人。',
        'fileName': 'file_04.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '黃帝居軒轅之丘，而娶於西陵之女，是爲嫘祖。嫘祖爲黃帝正妃，生二子，其後皆有天下：其一曰玄囂，是爲青陽，青陽降居江水；其二曰昌意，降居若水。昌意娶蜀山氏女，曰昌僕，生高陽，高陽有聖惪焉。黃帝崩，葬橋山。其孫昌意之子高陽立，是爲帝顓頊也。',
        'fileName': 'file_05.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '帝顓頊高陽者，黃帝之孫而昌意之子也。靜淵以有謀，疏通而知事；養材以任地，載時以象天，依鬼神以制義，治氣以教化，絜誠以祭祀。北至于幽陵，南至于交阯，西至于流沙，東至于蟠木。動靜之物，大小之神，日月所照，莫不砥屬。',
        'fileName': 'file_06.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '帝顓頊生子曰窮蟬。顓頊崩，而玄囂之孫高辛立，是爲帝嚳。',
        'fileName': 'file_07.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '帝嚳高辛者，黃帝之曾孫也。高辛父曰蟜極，蟜極父曰玄囂，玄囂父曰黃帝。自玄囂與蟜極皆不得在位，至高辛即帝位。高辛於顓頊爲族子。',
        'fileName': 'file_08.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '高辛生而神靈，自言其名。普施利物，不於其身。聰以知遠，明以察微。順天之義，知民之急。仁而威，惠而信，脩身而天下服。取地之財而節用之，撫教萬民而利誨之，曆日月而迎送之，明鬼神而敬事之。其色郁郁，其德嶷嶷。其動也時，其服也士。帝嚳溉執中而徧天下，日月所照，風雨所至，莫不從服。',
        'fileName': 'file_09.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '帝嚳娶陳鋒氏女，生放勳。娶娵訾氏女，生摯。帝嚳崩，而摯代立。帝摯立，不善，崩[2]。而弟放勳立，是爲帝堯。',
        'fileName': 'file_10.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '帝堯者，放勳。其仁如天，其知如神。就之如日，望之如雲。富而不驕，貴而不舒。黃收純衣，彤車乘白馬。能明馴德，以親九族。九族既睦，便章百姓。百姓昭明，合和萬國。',
        'fileName': 'file_11.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '乃命羲、和，敬順昊天，數法日月星辰，敬授民時。分命羲仲，居郁夷，曰暘谷。敬道日出，便程東作。日中，星鳥，以殷中春。其民析，鳥獸字微。申命羲叔，居南交。便程南爲，敬致。日永，星火，以正中夏。其民因，鳥獸希革。申命和仲，居西土，曰昧谷。敬道日入，便程西成。夜中，星虛，以正中秋。其民夷易，鳥獸毛毨。申命和叔，居北方，曰幽都。便在伏物。日短，星昴，以正中冬。其民燠，鳥獸氄毛。歲三百六十六日，以閏月正四時。信飭百官，衆功皆興。',
        'fileName': 'file_12.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '堯曰：「誰可順此事？」放齊曰：「嗣子丹朱開明。」堯曰：「吁！頑凶，不用。」堯又曰：「誰可者？」讙兜曰：「共工旁聚布功，可用。」堯曰：「共工善言，其用僻，似恭漫天，不可。」堯又曰：「嗟！四嶽：湯湯洪水滔天，浩浩懷山襄陵，下民其憂，有能使治者？」皆曰鯀可。堯曰：「鯀負命毀族，不可。」嶽曰：「异哉，試不可用而已。」堯於是聽嶽用鯀。九載，功用不成。',
        'fileName': 'file_13.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '堯曰：「嗟！四嶽：朕在位七十載，汝能庸命，踐朕位？」嶽應曰：「鄙惪忝帝位。」堯曰：「悉舉貴戚及疏遠隱匿者。」衆皆言於堯曰：「有矜在民閒，曰虞舜。」堯曰：「然，朕聞之。其何如？」嶽曰：「盲者子。父頑，母嚚，弟傲，能和以孝，烝烝治，不至姦。」堯曰：「吾其試哉。」於是堯妻之二女，觀其德於二女。舜飭下二女於嬀汭，如婦禮。堯善之，乃使舜慎和五典，五典能從。乃徧入百官，百官時序。賓於四門，四門穆穆，諸侯遠方賓客皆敬。堯使舜入山林川澤，暴風雷雨，舜行不迷。堯以爲聖，召舜曰：「女謀事至而言可績，三年矣。女登帝位。」舜讓於德，不懌。正月上日，舜受終於文祖。文祖者，堯大祖也。',
        'fileName': 'file_14.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '於是帝堯老，命舜攝行天子之政，以觀天命。舜乃在璿璣玉衡，以齊七政。遂類于上帝，禋于六宗，望于山川，辯于羣神。揖五瑞，擇吉月日，見四嶽諸牧，班瑞。歲二月，東巡狩，至於岱宗，祡，望秩於山川。遂見東方君長，合時月正日，同律度量衡，脩五禮五玉三帛二生一死爲摯，如五器，卒乃復。五月，南巡狩；八月，西巡狩；十一月，北巡狩：皆如初。歸，至于祖禰廟，用特牛禮。五歲一巡狩，羣后四朝。徧告以言，明試以功，車服以庸。肇十有二州，決川。象以典刑，流宥五刑，鞭作官刑，扑作教刑，金作贖刑。眚烖過，赦；怙終賊，刑。欽哉，欽哉，惟刑之靜哉！',
        'fileName': 'file_15.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '讙兜進言共工，堯曰不可，而試之工師，共工果淫辟。四嶽舉鯀治鴻水，堯以爲不可，嶽彊請試之，試之而無功，故百姓不便。三苗在江淮、荆州數爲亂。於是舜歸而言於帝，請流共工於幽陵，以變北狄；放驩兜於崇山，以變南蠻；遷三苗於三危，以變西戎；殛鯀於羽山，以變東夷：四辠而天下咸服。',
        'fileName': 'file_16.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '堯立七十年得舜，二十年而老，令舜攝行天子之政，薦之於天。堯辟位凡二十八年而崩。百姓悲哀，如喪父母。三年，四方莫舉樂，以思堯。堯知子丹朱之不肖，不足授天下，於是乃權授舜。授舜，則天下得其利而丹朱病；授丹朱，則天下病而丹朱得其利。堯曰「終不以天下之病而利一人」，而卒授舜以天下。堯崩，三年之喪畢，舜讓辟丹朱於南河之南。諸侯朝覲者不之丹朱而之舜，獄訟者不之丹朱而之舜，謳歌者不謳歌丹朱而謳歌舜。舜曰：「天也夫！」而後之中國踐天子位焉，是爲帝舜。',
        'fileName': 'file_17.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '虞舜者，名曰重華。重華父曰瞽叟，瞽叟父曰橋牛，橋牛父曰句望，句望父曰敬康，敬康父曰窮蟬，窮蟬父曰帝顓頊，顓頊父曰昌意：以至舜七世矣。自從窮蟬以至帝舜，皆微爲庶人。',
        'fileName': 'file_18.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '舜父瞽叟盲，而舜母死，瞽叟更娶妻而生象，象傲。瞽叟愛後妻子，常欲殺舜，舜避逃；及有小過，則受罪。順事父及後母與弟，日以篤謹，匪有懈。',
        'fileName': 'file_19.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '舜，冀州之人也。舜耕歷山，漁雷澤，陶河濱，作什器於壽丘，就時於負夏。舜父瞽叟頑，母嚚，弟象傲，皆欲殺舜。舜順適不失子道，兄弟孝慈。欲殺，不可得；即求，嘗在側。',
        'fileName': 'file_20.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '舜年二十以孝聞。三十而帝堯問可用者，四嶽咸薦虞舜，曰可。於是堯乃以二女妻舜以觀其內，使九男與處以觀其外。舜居嬀汭，內行彌謹。堯二女不敢以貴驕事舜親戚，甚有婦道。堯九男皆益篤。舜耕歷山，歷山之人皆讓畔；漁雷澤，雷澤上人皆讓居；陶河濱，河濱器皆不苦窳。一年而所居成聚，二年成邑，三年成都。堯乃賜舜絺衣與琴，爲筑倉廩，予牛羊。瞽叟尚復欲殺之，使舜上塗廩，瞽叟從下縱火焚廩。舜乃以兩笠自扞而下，去，得不死。後瞽叟又使舜穿井，舜穿井爲匿空旁出。舜既入深，瞽叟與象共下土實井，舜從匿空出，去。瞽叟、象喜，以舜爲已死。象曰：「本謀者象。」象與其父母分，於是曰：「舜妻堯二女與琴，象取之；牛羊倉廩，予父母。」象乃止舜宮居，鼓其琴。舜往見之。象鄂不懌，曰：「我思舜正鬱陶！」舜曰：「然，爾其庶矣！」舜復事瞽叟，愛弟彌謹。於是堯乃試舜五典百官，皆治。',
        'fileName': 'file_21.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '昔高陽氏有才子八人，世得其利，謂之「八愷」。高辛氏有才子八人，世謂之「八元」。此十六族者，世濟其美，不隕其名。至於堯，堯未能舉。舜舉八愷，使主后土，以揆百事，莫不時序。舉八元，使布五教于四方，父義，母慈，兄友，弟恭，子孝，內平外成。',
        'fileName': 'file_22.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '昔帝鴻氏有不才子，掩義隱賊，好行凶慝，天下謂之渾沌。少暤氏有不才子，毀信惡忠，崇飾惡言，天下謂之窮奇。顓頊氏有不才子，不可教訓，不知話言，天下謂之檮杌。此三族世憂之。至于堯，堯未能去。縉雲氏有不才子，貪于飲食，冒于貨賄，天下謂之饕餮。天下惡之，比之三凶。舜賓於四門，乃流四凶族，遷于四裔，以御螭魅，於是四門辟，言毋凶人也。',
        'fileName': 'file_23.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '舜入于大麓，烈風雷雨不迷，堯乃知舜之足授天下。堯老，使舜攝行天子政，巡狩。舜得舉，用事二十年，而堯使攝政。攝政八年而堯崩。三年喪畢，讓丹朱，天下歸舜。而禹、皋陶、契、后稷、伯夷、夔、龍、倕、益、彭祖自堯時而皆舉用，未有分職。於是舜乃至於文祖，謀于四嶽，辟四門，明通四方耳目，命十二牧論帝德，行厚德，遠佞人，則蠻夷率服。舜謂四嶽曰：「有能奮庸美堯之事者，使居官相事？」皆曰：「伯禹爲司空，可美帝功。」舜曰：「嗟，然！禹，汝平水土，維是勉哉。」禹拜稽首，讓於稷、契與皋陶。舜曰：「然，往矣。」舜曰：「弃，黎民始飢，汝后稷，播時百穀。」舜曰：「契，百姓不親，五品不馴，汝爲司徒，而敬敷五教，在寬。」舜曰：「皋陶，蠻夷猾夏，寇賊姦軌，汝作士，五刑有服，五服三就；五流有度，五度三居：維明能信。」舜曰：「誰能馴予工？」皆曰垂可。於是以垂爲共工。舜曰：「誰能馴予上下草木鳥獸？」皆曰益可。於是以益爲朕虞。益拜稽首，讓于諸臣朱虎、熊羆。舜曰：「往矣，汝諧。」遂以朱虎、熊羆爲佐。舜曰：「嗟！四嶽，有能典朕三禮？」皆曰伯夷可。舜曰：「嗟！伯夷，以汝爲秩宗，夙夜維敬，直哉維靜絜。」伯夷讓夔、龍。舜曰：「然。以夔爲典樂，教稺子，直而溫，寬而栗，剛而毋虐，簡而毋傲；詩言意，歌長言，聲依永，律和聲，八音能諧，毋相奪倫，神人以和。」夔曰：「於！予擊石拊石，百獸率舞。」舜曰：「龍，朕畏忌讒說殄僞，振驚朕衆，命汝爲納言，夙夜出入朕命，惟信。」舜曰：「嗟！女二十有二人，敬哉，惟時相天事。」三歲一考功，三考絀陟，遠近衆功咸興。分北三苗。',
        'fileName': 'file_24.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '此二十二人咸成厥功：皋陶爲大理，平，民各伏得其實；伯夷主禮，上下咸讓；垂主工師，百工致功；益主虞，山澤辟；弃主稷，百穀時茂；契主司徒，百姓親和；龍主賓客，遠人至；十二牧行而九州莫敢辟違；唯禹之功爲大，披九山，通九澤，決九河，定九州，各以其職來貢，不失厥宜。方五千里，至于荒服。南撫交阯、北發，西戎、析枝、渠廋、氐、羌，北山戎、發、息慎，東長、鳥夷，四海之內咸戴帝舜之功。於是禹乃興九招之樂，致異物，鳳皇來翔。天下明德皆自虞帝始。',
        'fileName': 'file_25.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '舜年二十以孝聞，年三十堯舉之，年五十攝行天子事，年五十八堯崩，年六十一代堯踐帝位。踐帝位三十九年，南巡狩，崩於蒼梧之野。葬於江南九疑，是爲零陵。舜之踐帝位，載天子旗，往朝父瞽叟，夔夔唯謹，如子道。封弟象爲諸侯。舜子商均亦不肖，舜乃豫薦禹於天。十七年而崩。三年喪畢，禹亦乃讓舜子，如舜讓堯子。諸侯歸之，然後禹踐天子位。堯子丹朱，舜子商均，皆有疆土，以奉先祀。服其服，禮樂如之。以客見天子，天子弗臣，示不敢專也。',
        'fileName': 'file_26.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '自黃帝至舜、禹，皆同姓而異其國號，以章明德。故黃帝爲有熊，帝顓頊爲高陽，帝嚳爲高辛，帝堯爲陶唐，帝舜爲有虞。帝禹爲夏后而別氏，姓姒氏。契爲商，姓子氏。弃爲周，姓姬氏。',
        'fileName': 'file_27.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    },
    {
        'title': '史記/卷001',
        'doc_content': '太史公曰：學者多稱五帝，尚矣。然尚書獨載堯以來；而百家言黃帝，其文不雅馴，薦紳先生難言之。孔子所傳宰予問五帝德及帝繫姓，儒者或不傳。余嘗西至空桐，北過涿鹿，東漸於海，南浮江淮矣，至長老皆各往往稱黃帝、堯、舜之處，風教固殊焉，總之不離古文者近是。予觀春秋、國語，其發明五帝德、帝繫姓章矣，顧弟弗深考，其所表見皆不虛。書缺有閒矣，其軼乃時時見於他說。非好學深思，心知其意，固難爲淺見寡聞道也。余并論次，擇其言尤雅者，故著爲本紀書首。',
        'fileName': 'file_28.txt',
        'corpus': '我的文獻集',
        'author': '',
        'doc_topic_l1': '',
        'doc_topic_l2': '',
        'geo_level1': '',
        'geo_level3': ''
    }
];

let y = [
    {
        field: 'title',
        headerName: '文件標題',
    },
    {
        field: 'doc_content',
        headerName: '文本內容',
    },
    {
        field: 'fileName',
        headerName: '檔案名稱',
    },
    {
        field: 'corpus',
        headerName: '文獻集名稱',
    },
    //記得上述這四者要記得selectedMetaColumn加回去
    {
        field: 'author', 
        headerName: '文件作者',
    },
    {
        field: 'doc_topic_l1', 
        headerName: '文件主題階層一',
    },
    {
        field: 'doc_topic_l2', 
        headerName: '文件主題階層二',
    },
    {
        field: 'geo_level1', 
        headerName: '文件地域階層一',
    },
    {
        field: 'geo_level3', 
        headerName: '文件地域階層三',
    },
];

let z = [
    {
        tagName: 'Udef_wiki',
        tagLabel: 'Wiki'
    },
    {
        tagName: 'LocName',
        tagLabel: 'LocName'
    },
    {
        tagName: 'PersonName',
        tagLabel: 'PersonName'
    },
];

let w = '我的文獻集';

console.log(composeDocuXmlFile(x, y, z, w));
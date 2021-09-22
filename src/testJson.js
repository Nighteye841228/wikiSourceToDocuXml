import axios from 'axios';
async function getWikisourceJson(
    title,
    saveContent,
    tableContentsTemp
) {
    let anythingFuck = [];
    try {
        let apiBackJson = await axios.get(
            'https://zh.wikisource.org/w/api.php?format=json&action=query&prop=revisions&rvprop=content&utf8',
            {
                params: {
                    titles: title,
                    origin: '*',
                },
            }
        );
        apiBackJson = apiBackJson.data;
        let wikiDocNum = getWikiNum(apiBackJson.query.pages);
        let dirtyText = apiBackJson.query.pages[wikiDocNum].revisions[0]['*'];
        let wikiTitle = apiBackJson.query.pages[wikiDocNum].title;
        let cleanText = dirtyText.match(/.*\[\[(\/*.*)\|*.*\]\]/gm);
        cleanText = cleanText.join('\n').replace(/^\n/gm, '').replace(/^\n/gm, '');
        cleanText = cleanText.match(/^[*#!].*\[\[(.*)\|*.*\]\]/gm);
        if (cleanText) {
            cleanText = cleanText.join('\n');

            cleanText = cleanText
                .replace(/.*\[\[(.*\/*.*)\|*.*\]\]/gm, '$1')
                .replace(/\|.*/gm, '');
            let wikiArrayCut = cleanText.split('\n').filter(x=>x);
            saveContent.numOfDir += wikiArrayCut.length;
            for (let i = 0; i < wikiArrayCut.length; i++) {
                saveContent.numOfDir--;
                if (/^\/.*/.test(wikiArrayCut[i])) {
                    wikiArrayCut[i] = wikiTitle + wikiArrayCut[i];
                }
                if (
                    tableContentsTemp.indexOf(wikiArrayCut[i]) == -1 && !/.*全覽.*/.test(wikiArrayCut[i])
                ) {
                    tableContentsTemp.push({
                        index: i,
                        value: wikiArrayCut[i],
                    });
                    getWikisourceJson(
                        wikiArrayCut[i],
                        saveContent,
                        tableContentsTemp
                    );
                }
            }
            console.log(`目前的count來到：${saveContent.numOfDir}`);
            if (saveContent.numOfDir === 0) {
                anythingFuck = tableTreeGenerate(tableContentsTemp);
                console.log(anythingFuck);
            }
        } else if (!cleanText && saveContent.numOfDir == 0) {
            tableContentsTemp.push({
                index: 0,
                value: title,
            });
            anythingFuck = tableTreeGenerate(tableContentsTemp);
        }
    } catch (error) {
        console.log('抓取:', error);
    }
}

function tableTreeGenerate(wikis) {
    let result = [];
    let count = 1;

    function treeIndexSort(resultTree, path = '') {
        for (
            let iterTreeCount = 0;
            iterTreeCount < resultTree.length;
            iterTreeCount++
        ) {
            resultTree[iterTreeCount].index = count;
            resultTree[iterTreeCount].id = `${path}/${resultTree[iterTreeCount].label}`.replace(/^\//, '');
            count++;
            if (resultTree[iterTreeCount].children.length !== 0) {
                treeIndexSort(
                    resultTree[iterTreeCount].children,
                    resultTree[iterTreeCount].id,
                );
            } else {
                resultTree[iterTreeCount].isLeaf = true;
            }
        }
    }

    wikis.forEach(function (path) {
        let logArray = path.value.split('/');
        logArray.reduce(function (level, key, index) {
            let temp = level.find(({ id }) => key === id);
            let isLeaf = true;
            if (!temp) {
                isLeaf = index === logArray.length ? true : false;
                temp = {
                    id: key,
                    label: key,
                    index: path.index,
                    value: '',
                    isLeaf: isLeaf,
                    children: [],
                };
                level.push(temp);
            }
            return temp.children;
        }, result);
    });
    treeIndexSort(result);
    return result;
}

function getWikiNum(json) {
    let target = '';
    for (const key in json) {
        if (/\d+/.test(key)) {
            target = key;
        }
    }
    return target;
}

(async function () { 
    let y = getWikisourceJson(this.link, {
        numOfDir: 0 
    }, []);
    console.log(y);
})(10);
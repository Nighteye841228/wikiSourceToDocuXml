const _ = require('ramda');
const $ = require('lodash');
// const { getWikisourceJson } = require('./tool');

function tableTreeGenerate(wikis, log) {
    let result = $.cloneDeep(log);
    let cutLen = wikis.split('/').length - 1;
    let child = (level, key, index) => {
        let element = undefined;
        if (!(level.find(({ id }) => key === id))) {
            element = {
                id: key,
                isLeaf: index ===  cutLen ? true : false,
                children: [],
            };
            if (element.isLeaf) delete element['children'];
            level.push(element);
        }
        return element.children;
    }; 
    wikis.split('/').reduce(child, result);
    
    return result;
}

let inObj = _.curry((ele, obj) => {
    return (ele in obj);
}); 

let injectObj = _.curry((ele, obj) => {
    if (!(ele in obj)) {
        return {
            ele: undefined 
        };
    } else return; 
});

let wordArray = ((words, obj) => {
    let child = words[0];
    if (!('text' in obj)) {
        obj.text = child;
        obj.child = [{
        }];
        wordArray(words, obj);
    }
    if (obj.text !== child) {
        obj.child.push({
            text: child,
            child: [{
            }] 
        });
    } 
    if (words.slice(1).length !== 0) {
        obj.child.forEach(ele => {
            wordArray(words.slice(1), ele);
        });
    }
});


// wordArray(['this', 'is', 'a', 'book'], x);
// console.log(JSON.stringify(tableTreeGenerate(
//     'this/is/not/book',
// )));

let clone = ((x) => {
    return $.cloneDeep(x);
});

let obj = Object.freeze({
    'id': 'this', 
    'isLeaf': false, 
    'children': [{
        'id': 'is', 
        'isLeaf': false, 
        'children': [{
            'id': 'a', 
            'isLeaf': false, 
            'children': [{
                'id': 'book', 
                'isLeaf': true
            }]
        }]
    }]
});

function hasChildren(node) {
    return (typeof node === 'object')
        && (typeof node.children !== 'undefined')
        && (node.children.length > 0);
}
const Tree = {
    reduce: _.curry(function reduce(reducerFn, init, node) {
        const acc = reducerFn(init, node);
        if (!hasChildren(node)) {
            return acc;
        }
        return node.children.reduce(Tree.reduce(reducerFn), acc);
    }),
    map: _.curry(function map(mapFn, node) {
        const newNode = mapFn(node);
        if (hasChildren(node)) {
            return newNode;
        }
        newNode.children = node.children.map(Tree.map(mapFn));
        return newNode;
    })
};
function sumLinks(total, item) {
    return total + ((item.type === 'link') ? 1 : 0);
}
function addChildCount(node) {
    const countstr = (hasChildren(node)) ? ` (${node.children.length})` : '';
    return {
        ...node,
        text: node.text + countstr,
    };
}



const menu = {
    type: 'title',
    text: 'Menu',
    children: [
        {
            type: 'title',
            text: 'Works of George Macdonald',
        },
        {
            type: 'link',
            href: '/books',
            text: 'Books',
            children: [
                {
                    type: 'link',
                    href: '/books/sir-gibbie',
                    text: 'Sir Gibbie',
                },
                {
                    type: 'link',
                    href: '/books/at-the-back-of-the-north-wind',
                    text: 'At the Back of the North Wind',
                },
                {
                    type: 'link',
                    href: '/books/the-princess-and-the-goblin',
                    text: 'The Princess and the Goblin',
                },
            ]
        },
        {
            type: 'link',
            href: '/poetry',
            text: 'Poems',
        },
        {
            type: 'link',
            href: '/essays',
            text: 'Essays',
            children: [
                {
                    type: 'link',
                    href: '/essays/the-fantastic-imagination',
                    text: 'The Fantastic Imagination',
                },
                {
                    type: 'link',
                    href: '/essays/the-new-name',
                    text: 'The New Name',
                },
            ]
        },
        {
            type: 'title',
            text: 'Our Community',
        },
        {
            type: 'link',
            href: '/about',
            text: 'About us',
            children: [
                {
                    type: 'link',
                    href: '/about/membership',
                    text: 'Community membership',
                },
                {
                    type: 'link',
                    href: '/about/sponsorship',
                    text: 'Community sponsorship',
                    children: [
                        {
                            type: 'link',
                            href: '/about/sponsorship/patreon',
                            text: 'Our Patreon',
                        },
                        {
                            type: 'link',
                            href: '/about/sponsorship/endowments',
                            text: 'Endowments',
                        },
                    ]
                },
            ]
        },
        {
            type: 'link',
            href: '/forum',
            text: 'Forum',
        },
        {
            type: 'link',
            href: 'https://www.facebook.com/groups/GeorgeMacDonaldCommunity/',
            text: 'Facebook Group',
        },
    ]
};
// console.log(Tree.reduce(sumLinks, 0, menu));
let x = Tree.map(addChildCount, menu);
console.log(x);

const map = _.curry((mapFn, items) => {
    return items.map(mapFn);
}); 
const reduce = _.curry((reduceFn, init, items) => {
    return items.reduce(reduceFn, init);
});
const cutString = _.curry((cut, string) => {
    return string.split(cut);
});

const construct = _.curry((node, tasks) => {
    let result = node;
    tasks.reduce((parent, kid, ind) => {
        let momNode = result.find(({ text, layer }) => {
            return text === parent && layer === ind - 1;
        });
        let currNode = result.find(({ text, layer }) => {
            return text === kid && layer === ind;
        });
        
        if (momNode) {
            momNode.children.push(kid);
            momNode.children = [...new Set(momNode.children)];
        }
        
        if (!currNode) {
            result.push({
                text: kid,
                mom: parent,
                layer: ind,
                children: []
            });
        }
        
        return kid;
    }, '');
    return result;
});

const reduceTree = _.curry((fn, items) => {
    let result = [];
    items.reduce(fn, result);
    return result;
});

const deMap = _.curry((fn, items) => {
    return items.map(fn);
});

const splitString = _.curry((cut, string) => {
    return string.split(cut);
});

let tar = ['a/b/c', 'a', 'a/b/d', 'a/b/c/e'];
let yyy = _.compose(reduceTree(construct), deMap(splitString('/')));
// console.log(reduceTree(deMap(tar, splitString), construct));
// console.log(yyy(tar));

let y = (() => {
    const arr = [1, 2, 3, 4, 5];
    const asyncWorker = async (num) => {
        await setTimeout(() => {
            num = num + 1;
        }, 1000);
        return num;
    };

    let jobs = arr.map(async (num) => {
        return await asyncWorker(num);
    });

    // 當所有工作完成後，顯示執行內容
    Promise.all(jobs).then((results) => {
        console.log(results);
    });
});

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));
const u = async (z) => {
    await sleep(1000);
    console.log(z + 1);
};

// (async ()=>{
//     let t = async (num) => {
//         let u = async (x) => {
//             await setTimeout(async () => {
//                 --x;
//                 console.log('a', x);
//                 return x;
//             }, 1000);
//         };
//         return await u(num);
//     };
//     try {
//         let r = await t(10);
//         console.log(r);
//     } catch (error) {
//         console.log(error);
//     }
// })();

const g = (x) => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (x < 6) {
                resolve([x + 1, x + 2, x + 3]);
            } else {
                resolve([]);
            }
        }, 200);
    });
};

const spread = (x) => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (x < 6) {
                resolve([x + 1, x + 2, x + 3]);
            } else {
                resolve([]);
            }
        }, 200);
    });
};

const getMenu = async (num) => {
    let line = [];
    let frag = await spread(num);
    if (!frag.length) return frag;
    line = frag.map(async (number) => {
        return await getMenu(number);
    });
    let result = await Promise.all(line);
    result.map(x => {
        frag = frag.concat(x);
    });
    return frag;
};

(async () => {
    let t = await getMenu(0);
    console.log(t);
})();

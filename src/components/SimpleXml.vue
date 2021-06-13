<template>
    <div class="simp-container">
        <div id="simpleXml">
        </div>
    </div>
</template>

<script>
import * as $ from 'jquery';

$.fn.simpleXML = function (options) {

    // This is the easiest way to have default options.
    var settings = $.extend({
        // These are the defaults.
        collapsedText: '...',
    }, options);

    if (settings.xml == undefined && settings.xmlString == undefined)
        throw 'No XML to be displayed was supplied';

    if (settings.xml != undefined && settings.xmlString != undefined)
        throw 'Only one of xml and xmlString may be supplied';

    var xml = settings.xml;
    if (xml == undefined)
        xml = $.parseXML(settings.xmlString);

    return this.each(function () {
        var wrapperNode = document.createElement('span');
        $(wrapperNode).addClass('simpleXML');

        showNode(wrapperNode, xml, settings);

        this.appendChild(wrapperNode);

        $(wrapperNode).find('.simpleXML-expanderHeader').click(function () {

            var expanderHeader = $(this).closest('.simpleXML-expanderHeader');

            var expander = expanderHeader.find('.simpleXML-expander');

            var content = expanderHeader.parent().find('.simpleXML-content').first();
            var collapsedText = expanderHeader.parent().children('.simpleXML-collapsedText').first();
            var closeExpander = expanderHeader.parent().children('.simpleXML-expanderClose').first();
                
            if (expander.hasClass('simpleXML-expander-expanded')) {
                // Already Expanded, therefore collapse time...
                expander.removeClass('simpleXML-expander-expanded').addClass('simpleXML-expander-collapsed');

                collapsedText.attr('style', 'display: inline;');
                content.attr('style', 'display: none;');
                closeExpander.attr('style', 'display: none');
            }
            else {
                // Time to expand..
                expander.addClass('simpleXML-expander-expanded').removeClass('simpleXML-expander-collapsed');
                collapsedText.attr('style', 'display: none;');
                content.attr('style', '');
                closeExpander.attr('style', '');
            }
        });
    });

};
function showNode(parent, xml, settings) {
    if(!xml) return;
    if (xml.nodeType == 9) {
        for (var i = 0 ; i < xml.childNodes.length ; i++)
            showNode(parent, xml.childNodes[i], settings);

        return;
    }

    switch (xml.nodeType) {
    case 1: // Simple element
        {
            var hasChildNodes = xml.childNodes.length > 0;
            var expandingNode = hasChildNodes && (xml.childNodes.length > 1 || xml.childNodes[0].nodeType != 3);

            var expanderHeader = expandingNode ? makeSpan('', 'simpleXML-expanderHeader') : parent;

            var expanderSpan = makeSpan('', 'simpleXML-expander');
            if (expandingNode)
                $(expanderSpan).addClass('simpleXML-expander-expanded');
            expanderHeader.appendChild(expanderSpan);

            expanderHeader.appendChild(makeSpan('<', 'simpleXML-tagHeader'));
            expanderHeader.appendChild(makeSpan(xml.nodeName, 'simpleXML-tagValue'));

            if( expandingNode)
                parent.appendChild(expanderHeader);

            // Handle attributes
            var attributes = xml.attributes;
            for( var attrIdx = 0 ; attrIdx < attributes.length ; attrIdx++ ) {
                expanderHeader.appendChild( makeSpan( ' '));
                expanderHeader.appendChild( makeSpan( attributes [attrIdx].name, 'simpleXML-attrName'));
                expanderHeader.appendChild( makeSpan( '="' ));
                expanderHeader.appendChild( makeSpan( attributes [attrIdx].value, 'simpleXML-attrValue' ));
                expanderHeader.appendChild( makeSpan( '"' ));
            }
					
            // Handle child nodes
            if (hasChildNodes) {

                parent.appendChild(makeSpan('>', 'simpleXML-tagHeader'));

                if (expandingNode) {
                    var ulElement = document.createElement('ul');
                    for (var ii = 0 ; ii < xml.childNodes.length ; ii++) {
                        var liElement = document.createElement('li');
                        showNode(liElement, xml.childNodes[ii], settings);
                        ulElement.appendChild(liElement);
                    }

                    var collapsedTextSpan = makeSpan(settings.collapsedText, 'simpleXML-collapsedText');
                    collapsedTextSpan.setAttribute('style', 'display: none;');
                    ulElement.setAttribute('class', 'simpleXML-content');
                    parent.appendChild(collapsedTextSpan);
                    parent.appendChild(ulElement);

                    parent.appendChild(makeSpan('', 'simpleXML-expanderClose'));
                }
                else {
                    parent.appendChild(makeSpan(xml.childNodes[0].nodeValue));
                }

                // Closing tag
                parent.appendChild(makeSpan('</', 'simpleXML-tagHeader'));
                parent.appendChild(makeSpan(xml.nodeName, 'simpleXML-tagValue'));
                parent.appendChild(makeSpan('>', 'simpleXML-tagHeader'));
            } else {
                var closingSpan = document.createElement('span');
                closingSpan.innerText = '/>';
                parent.appendChild(closingSpan);
            }
        }
        break;

    case 3: // text
        {
            if( xml.nodeValue.trim() !== '' ) {
                parent.appendChild(makeSpan('', 'simpleXML-expander'));
                parent.appendChild(makeSpan(xml.nodeValue));
            }
        }
        break;

    case 4: // cdata
        {
            parent.appendChild(makeSpan('', 'simpleXML-expander'));
            parent.appendChild(makeSpan('<![CDATA[', 'simpleXML-tagHeader'));
            parent.appendChild(makeSpan(xml.nodeValue, 'simpleXML-cdata'));
            parent.appendChild(makeSpan(']]>', 'simpleXML-tagHeader'));
        }
        break;

    case 8: // comment
        {
            parent.appendChild(makeSpan('', 'simpleXML-expander'));
            parent.appendChild(makeSpan('<!--' + xml.nodeValue + '-->', 'simpleXML-comment'));
        }
        break;

    default:
        {
            var item = document.createElement('span');
            item.innerText = '' + xml.nodeType + ' - ' + xml.name;
            parent.appendChild(item);
        }
        break;
    }


    function makeSpan(innerText, classes = undefined) {
        var span = document.createElement('span');
        span.innerText = innerText;

        if (classes != undefined)
            span.setAttribute('class', classes);

        return span;
    }
}
export default {
    name: 'SimpleXml',
    props: ['step', 'xml'],
    watch: {
        step: function (val) {
            if(val === 5) {
                $('#simpleXml').simpleXML({
                    xmlString: this.xml
                });
            }
        }
    }
};


</script>


<style>
.simpleXML ul
{
    list-style: none;
    margin: 0px;
    padding-left: 32px;
}

.simpleXML
{
    font-family: 'Courier New';
}

.simpleXML-comment
{
    color: green;
}

.simpleXML-tagHeader
{
    color: blue;
}

.simpleXML-cdata
{
    color: gray;
}

.simpleXML-tagValue
{
    color: darkred;
}

.simpleXML-collapsedText
{
    color: lightgray;
}

.simpleXML-attrName {
	color: red;
}

.simpleXML-attrValue {
	color: blue;
}

.simpleXML span.simpleXML-expander, .simpleXML span.simpleXML-expanderClose
{
    height: 12px;
    width: 12px;
    display: inline-block;
}

.simpleXML span.simpleXML-expanderHeader
{
    cursor: pointer;
}

.simpleXML span.simpleXML-expander-expanded
{
    background-image: url( "../assets/simpleXML-images.png" );
}

.simpleXML span.simpleXML-expander-collapsed
{
    background-image: url( "../assets/simpleXML-images.png" );
    background-position-x: -12px;
}

.simp-container {
    box-shadow: 7px 7px 20px #8e8e8e;
}
</style>

/*

if (window.esprima) {
    ...
    const syntaxArray = esprima.tokenize(code);
}

*/






/*

Basc usage:
<pre><code>
<!––
    your code here in a single block comment
––>
</code></pre>

With line numbers starting at 1
<pre data-lineNumbers><code>
<!––
    your code here in a single block comment
––>
</code></pre>

With line numbers starting at 21
<pre data-lineNumbers=21><code>
<!––
    your code here in a single block comment
––>
</code></pre>

With syntax highlighting
<pre data-syntax="html"><code>
<!––
    your code here in a single block comment
––>
</code></pre>

With copy code button added
<pre data-copyable><code>
<!––
    your code here in a single block comment
––>
</code></pre>

NOTE:
If you have to show HTML comments <!–– and ––>,
use n-dashes (–); otherwise they will be interpreted
as actual comments. However, if you also need to
copy to clipboard, then the n-dashes will copy and
the comment will not work in the user's code. For
that reason, n-dashes will be converted to regular
hyphens in the copy to clipboard function if HTML
comments are detected.

*/

function renderCode(tagSelector = "pre code"){
	window.document.querySelectorAll(tagSelector).forEach(setup);
}

function setup(tag){
	var originalTag = tag,
        originalCode = tag.childNodes[1].textContent.trim(),
        bracketedCode = originalCode
				.replace(/&/g, "&amp;")
				.replace(/</g, "&lt;")
				.replace(/>/g, "&gt;"),
        code = "<div style='min-height:1.15em;'>" + bracketedCode
                .split(/[\r\n]/)
                .join("</div><div style='min-height:1.15em;'>") + "</div>",
        addLineNumbers = tag.parentElement.hasAttribute("data-lineNumbers"),
		addSyntax = tag.parentElement.hasAttribute("data-syntax"),
		addCopyable = tag.parentElement.hasAttribute("data-copyable");

    /* LINE NUMBERS */
	if (addLineNumbers){
        var numLines = originalCode.split(/[\r\n]/).length,
            lineNumbers = (function(){
                let dataLineNum = +tag.parentElement.getAttribute("data-lineNumbers"),
					startingNum = dataLineNum || 1,
                    html = `<section style="float:left;padding-right:5px;border-right:1px solid black;margin-right:10px;text-align:right;user-select:none;">`;
                for (let i=startingNum; i<startingNum+numLines; i++){
                    html += "<div style='min-height:1.15em;'>" + i + "</div>";
                }
                html += "</section><section></section>";
                return html;
            })();
        tag.innerHTML = lineNumbers;
        tag = tag.querySelector("section:last-child");
    }

    /* SYNTAX HIGHLIGHTING */
    if (addSyntax){
		let syntax = originalTag.parentElement.getAttribute("data-syntax").trim().toLowerCase();
		if (syntax.includes("html")) code = highlightHtml(code); //HTML, and embedded CSS and JS
		else if (syntax.includes("css")) code = highlightCss(code);
		else if (syntax.includes("js")) code = highlightJs(originalCode, code);
	}

    //insert formatted code
    tag.innerHTML = code;

    /* COPY CODE TO CLIPBOARD BUTTON */
	if (addCopyable){
		originalTag.parentElement.outerHTML += "<button id='copyCodeToClipboardButton'>Copy to Clipboard</button>";
		let button = window.document.querySelector("#copyCodeToClipboardButton");
		button.removeAttribute("id");
		button.addEventListener("click", copyCodeToClipboard);
	}
}

function copyCodeToClipboard(e){
	let textarea = window.document.createElement("textarea"),
        codeEl = e.target.previousElementSibling.querySelector("section:last-child") ||
                 e.target.previousElementSibling,
        html = codeEl.innerHTML.replace(/<\/div>/g, "</div>\n"),
        div = window.document.createElement("div");
    div.innerHTML = html;
    let text = div.textContent;
    text = text.replace(/<!––/g, "<!--").replace(/––>/g, "-->");
	textarea.value = text;
	window.document.body.appendChild(textarea);
	textarea.select();
	try {
		if (window.document.execCommand("copy")) e.target.textContent = "Copied!";
		else e.target.textContent = "Copy Failed";
	}
	catch (err){
		e.target.textContent = "Copy Failed";
	}
	window.document.body.removeChild(textarea);
	//return button text to normal after five seconds
	setTimeout(() => {
		e.target.textContent = "Copy to Clipboard";
	}, 5000);
}

/*********** HTML HIGHLIGHTING *************/
function highlightHtml(code){
	// let color = highlightSettings.html,
	let inStyle = false,
		inScript = false;

	//tags (non-greedy matching)
    code = code.replace(/&lt;(.*?)&gt;/g, htmlSegment);
	//comments (looking for n-dashes, see notes above)
	code = code.replace(/&lt;!––(.+)––&gt;/g, "<span data-code-comment>&lt;!--$1--&gt;</span>");
	//css
	code = code.replace(/(style.*<\/span><span data-code-tagBracket>&gt;<\/span>)(.*)(<span data-code-tagBracket>&lt;<\/span><span data-code-tagBracket>\/<\/span><span data-code-tagName>style)/gi, (match, capture1, capture2, capture3, index) => capture1 + highlightCss(capture2) + capture3);
	//javascript
	code = code.replace(/(script.*<\/span><span data-code-tagBracket>&gt;<\/span>)(.*)(<span data-code-tagBracket>&lt;<\/span><span data-code-tagBracket>\/<\/span><span data-code-tagName>script)/gi, (match, capture1, capture2, capture3, index) => capture1 + highlightJs(capture2) + capture3);

	function htmlSegment(match, capture, index){
		let originalInStyle = inStyle,
			originalInScript = inScript,
			replaced = "<span data-code-tagBracket>&lt;</span>";
		replaced += htmlTag(capture);
		replaced += "<span data-code-tagBracket>&gt;</span>";
		//if we've only just entered <style> or <script>
		//be sure to include the actual <style> or <script> tag first,
		//otherwise ignore any matches not actually in html
		if (inStyle && originalInStyle) return match;
		if (inScript && originalInScript) return match;
		return replaced;
	}
	function htmlTag(tag){
		let originalTag = tag,
			replaced = "";
		//slash
		if (tag[0] === "/"){
			replaced += "<span data-code-tagBracket>/</span>";
			tag = tag.slice(1);
		}
		//tag name
		let tagName;
		if (tag.includes(" ")){
			tagName = tag.slice(0, tag.indexOf(" "));
			tag = tag.slice(tag.indexOf(" "));
		}
		else {
			tagName = tag;
			tag = "";
		}
		replaced += "<span data-code-tagName>" + tagName + "</span>";
		if (tagName.toLowerCase() === "style") inStyle = !inStyle;
		if (tagName.toLowerCase() === "script") inScript = !inScript;
		return replaced + htmlAttributes(tag);
	}
	function htmlAttributes(attributes){
		if (!attributes.trim().length) return "";
		let replaced = "<span data-code-attributeName>";
        replaced += attributes.replace(/(=.*)/g, htmlAttributeValue);
        replaced += "</span>";
		return replaced;
	}
    function htmlAttributeValue(match, value){
        return "<span data-code-attributeEqual>=</span><span data-code-attributeValue>" + value.slice(1) + "</span>";
    }

	// for (let prop in color){
	// 	let regex = new RegExp("data\-" + prop, "gi");
	// 	code = code.replace(regex, "style=color:" + color[prop] + ";");
	// }

	return code;
}

/*********** CSS HIGHLIGHTING *************/
function highlightCss(code){
	console.log(code);
	//rulesets
	code = code.replace(/([^{}]*){([^{}]*)}/g, cssRuleSet);
	//default (for @ lines)
	code = "<span data-code-atLine>" + code + "</span>";
	//@word (@media, @keyframes, @import, etc.)
	code = code.replace(/(@\w+)/gi, "<span data-code-atWord>$1</span>");

	function cssRuleSet(match, capture1, capture2, index){
		return cssSelector(capture1) + "<span data-code-ruleSetCurlyBrace>{</span>" + cssRules(capture2) + "<span data-code-ruleSetCurlyBrace>}</span>";
	}

	function cssSelector(selector){
		selector = selector.replace(/(\s[^\w\d]\s)/g, "<span data-code-selectorSyntax>$1</span>");
		selector = selector.replace(/(#[\w\d-]+)/g, "<span data-code-selectorId>$1</span>");
		selector = selector.replace(/(\.[\w\d-]+)/g, "<span data-code-selectorClass>$1</span>");
		selector = selector.replace(/(:[\w\d]+)/g, "<span data-code-selectorPseudoClass>$1</span>");
		selector = selector.replace(/\[(.*)\]/g, "<span data-code-selectorSquareBracket>[</span><span data-code-selectorAttribute>$1</span><span data-code-selectorSquareBracket>]</span>");
		return "<span data-code-selectorDefault>" + selector + "</span>";
	}

	function cssRules(rules){
		rules = rules.replace(/(.+):(.+)/g, "<span data-code-ruleName>$1</span><span data-code-ruleSyntax>:</span><span data-code-ruleValueDefault>$2</span>");
		rules = rules.replace(/(\-?\d+\.?\d*\w*%?)/g, "<span data-code-ruleValueNumber>$1</span>");
		rules = rules.replace(/([\(\),;])/g, "<span data-code-ruleSyntax>$1</span>");
		rules = rules.replace(/!important/gi, "<span data-code-ruleImportant>!important</span>");
		return rules;
	}

	// for (let prop in color){
	// 	let regex = new RegExp("data\-" + prop, "gi");
	// 	code = code.replace(regex, "style=color:" + color[prop] + ";");
	// }

	return code;
}

/*********** JAVASCRIPT HIGHLIGHTING *************/
/*********** unfinished *************/
function highlightJs(code, formattedCode){

    if (window.esprima) {
        // console.log(code);
        const syntaxArray = esprima.tokenize(code);
        // console.log(syntaxArray);
    }

	return formattedCode;
}


export { renderCode };

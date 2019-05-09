
function isType(type){
    return function(val){
        return Object.prototype.toString.call(val) == `[object ${type}]`
    }
}
let isArray = isType('Array');
let isObject = isType('Object');
let isBoolean = isType('Boolean');
let isNumber = isType('Number');
let isString = isType('String');
let isNull = isType('Null');


let css = `
    body{background:#f5f5f5;font-family:Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,Arial,sans-serif;}
    
    p{margin:5px auto;padding:5px;}
    .json-start{padding-left:0;}
    .json-start,.array-start{cursor: pointer;}
    .line{border:1px solid #e8e8e8;}
    span[data-boolean]{color:rgb(230, 162, 60)}
    span[data-number]{color:#597af9}
    span[data-string]{color:#2ab583}
    span[data-null]{color:rgb(228, 231, 237)}
`

let style = document.createElement('style');
style.innerHTML = css;
document.head.append(style);


if(document.contentType == 'application/json'){
    let jsonData = JSON.parse(document.querySelector('pre').innerHTML);
    let level = 1;
    console.log(jsonData)
    if(jsonData){
        document.body.innerHTML = (formatJSON(jsonData,level));
    }
}

function formatJSON(json,level){
    if(JSON.stringify(json) == '{}') return '{}';
    let html = '';
    html += `<p class="json-start json-start-${level}">{</p>`
    html += `<div style="padding-left:${40}px;border-left:1px dashed #dcdcdc">`;
    for(key in json){
        let line;
        if(isObject(json[key])){
            line = `${key} : ${formatJSON(json[key],level+1)}`;
        }
        else if(isArray(json[key])){
            line = `<p class="array-start array-start-${level}">${key} :[</p>
                    ${formatArray(json[key],level+1)}
                <p class="array-end array-end-${level}">],</p>`;
        }
        else{
            let value = json[key];
            line = `<p class="line">${key} : ${formatValue(value)},</p>`
        }
        html+=line;
    }
    html+=`</div>`;
    html+=`<p class="json-end json-end-${level}">}${level == 1 ? '' : ','}</p>`
    return html;
}
function formatArray(arr,level){
    if(isObject(arr[0]) || isArray(arr[0])){
        let html = '';
        html += `<div style="padding-left:${40}px;border-left:1px dashed #dcdcdc">`;
        for(let i=0; i<arr.length; i++){
            if(isObject(arr[i])){
                html += `${formatJSON(arr[i],level)}`;
            }
            else if(isArray(arr[i])){
                html += `${formatArray(arr[i],level)}`;
            }
            else{
                html += `${formatValue(arr[i])},`
            }
        }

        html+='</div>';
        return html;
    }
    else{
        let html = '';
        for(let i = 0; i<arr.length; i++){
            let value = arr[i];
            html += formatValue(value) + ',';
        }
        return html.slice(0,-1);
    }
}

function formatValue(value){
    if(isString(value)){
        return warpString('"'+ value +'"');
    }
    else{
        if(isBoolean(value)){
            return warpBoolean(value);
        }
        if(isNumber(value)){
            return warpNumber(value);
        }
        if(isNull(value)){
            return warpNull(value);
        }
    }
}

function warpBoolean(value){
    return `<span data-boolean>${value}</span>`
}
function warpString(value){
    return `<span data-string>${value}</span>`
}
function warpNumber(value){
    return `<span data-number>${value}</span>`
}
function warpNull(value){
    return `<span data-null>${value}</span>`
}

window.onload = function(){
    document.addEventListener('click',function(event){
        let target = event.target;
        // 折叠JSON
        if(target.className.indexOf('json-start') >= 0){
            if(!target.__content){
                let nextElement = target.nextElementSibling;
                if(nextElement.nodeName == 'DIV'){
                    target.__content = target.parentNode.removeChild(nextElement);
                }
            }
            else{
                let nextElement = target.nextElementSibling;
                if(nextElement.className.indexOf('json-end') >= 0){
                    target.parentNode.insertBefore(target.__content,nextElement);
                    target.__content = null;
                }
            }
        }
        // 折叠数组
        else if(target.className.indexOf('array-start') >= 0){
            if(!target.__content){
                let nextElement = target.nextElementSibling;
                if(nextElement.nodeName == 'DIV'){
                    target.__content = target.parentNode.removeChild(nextElement);
                }
            }
            else{
                let nextElement = target.nextElementSibling;
                if(nextElement.className.indexOf('array-end') >= 0){
                    target.parentNode.insertBefore(target.__content,nextElement);
                    target.__content = null;
                }
            }
        }
    })
}


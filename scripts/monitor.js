let monitorWindow;

function LaunchTimers() {
    const electron = require('electron');
    const remote = electron.remote;
    const BrowserWindow = remote.BrowserWindow;


    if(!isMonitorDisplaying){
        monitorWindow = new BrowserWindow({
            width: electron.screen.getPrimaryDisplay().size.width/3,
            height: (electron.screen.getPrimaryDisplay().size.height/3)*2,
            alwaysOnTop: true,
            frame:false,
            closable:true,
            transparent:true
        });
        monitorWindow.webContents.on('did-finish-load', ()=>{
            monitorWindow.show();
            monitorWindow.focus();
        });
        monitorWindow.on('closed',function(){
            isMonitorDisplaying = false;
        });
        monitorWindow.loadURL(__dirname + '/monitor.html');
        isMonitorDisplaying = true;
    }
}

let activeTimerIndex = 0;

function AddTimer(spell,target,duration,type){
    let formData = getFormData();
    let alpha = formData.display_alpha/255;
    let startDiv = `<div class="pure-u-1-${formData.display_columns}">`;
    let closeDiv = "</div>";
    let timerID = activeTimerIndex++;
    let meterBG = '';
    if(type==="good"){
        meterBG = formData.spells_good_bg;
    } else {
        meterBG = formData.spells_bad_bg;
    }
    meterBG = hexToRgbA(meterBG).split(',');
    meterBG[3] = alpha + ")";
    meterBG =  meterBG.join(',');
    let fillBGC = '';
    if(type==="good"){
        fillBGC = formData.spells_good_fill;
    } else {
        fillBGC = formData.spells_bad_fill;
    }
    fillBGC = hexToRgbA(fillBGC).split(',');
    fillBGC[3] = (alpha < 0.05 ? 0.05 : alpha ) + ")";
    fillBGC = fillBGC.join(',');
    let textColor = '';
    if(type==="good"){
        textColor = formData.spells_good_text_color;
    } else {
        textColor = formData.spells_bad_text_color;
    }    
    textColor = hexToRgbA(textColor).split(',');
    textColor[3] = (alpha < 0.2 ? 0.2 : alpha) + ")";
    textColor = textColor.join(',');
    let timerHTML = `<div class="meter" style="background-color:${meterBG}" id="${timerID}"><img style="opacity:${(alpha< 0.15 ? 0.15 : alpha)};" src="./img/spellgem2.png"/><span class="txt" style="color:${textColor};">${spell}:${target}</span><span class="fill" style="width:82%;background-color:${fillBGC};"></span></div>`;
    let combined = startDiv + timerHTML + closeDiv;
    let animateCode = `$('#${timerID} .fill').animate({width:"0%"},${duration*1000},(ele)=>{$('#${timerID}').parent().remove();});`;
    monitorWindow.webContents.executeJavaScript(`$('#timercontainer').append('${combined}');`,()=>{
        monitorWindow.webContents.executeJavaScript(animateCode);
    });
}

function hexToRgbA(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',1)';
    }
    throw new Error('Bad Hex');
}

function convertToAlpha(val,formData){
    val = hexToRgbA(val).split(',');
    val[3] = formData.display_alpha/255 + ")";
    return val.join(',');
}

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
console.log('Configuration.js fired.');

const fs = require('fs');
let isMonitorDisplaying = false;

function getFormData() {
    let formData = {};
    formData.character_name = $("#character_name").val();
    formData.character_class = $("#character_class").val();
    formData.env_logpath = $("#log_path").val();
    formData.spells_good_fill = $("#spells_good_fill").val();
    formData.spells_bad_fill = $("#spells_bad_fill").val();
    formData.spells_good_bg = $("#spells_good_bg").val();
    formData.spells_bad_bg = $("#spells_bad_bg").val();
    formData.spells_good_text_color = $("#spells_good_text_color").val();
    formData.spells_bad_text_color = $("#spells_bad_text_color").val();
    formData.display_columns = $("#display_columns").val();
    formData.display_alpha = $("#display_alpha").val();
    formData.display_alpha_value = $("#display_alpha_value").text();
    return formData;
}

function SaveConfig() {
    fs.writeFile("./config.config", JSON.stringify(getFormData()), (err) => {
        alert("Configuration saved!");
    });
}

function LoadConfig() {
    fs.exists("./config.config", (err) => {
        fs.readFile("./config.config", {
            encoding: "utf-8"
        }, (err, data) => {
            let formData = JSON.parse(data);
            $("#character_name").val(formData.character_name);
            $("#character_class").val(formData.character_class);
            $("#log_path").val(formData.env_logpath);
            $("#spells_good_fill").val(formData.spells_good_fill);
            $("#spells_bad_fill").val(formData.spells_bad_fill);
            $("#spells_good_bg").val(formData.spells_good_bg);
            $("#spells_bad_bg").val(formData.spells_bad_bg);
            $("#spells_good_text_color").val(formData.spells_good_text_color);
            $("#spells_bad_text_color").val(formData.spells_bad_text_color);
            $("#display_columns").val(formData.display_columns);
            $("#display_alpha").val(formData.display_alpha);
            $("#display_alpha_value").text(formData.display_alpha_value);
            UpdateExamples();
        });
    });
}

LoadConfig();

function UpdateExamples() {
    let backgroundAlpha = ($("#display_alpha").val() / 255);
    let goodColorRGBA = hexToRgbA($('#spells_good_fill').val());
    $('.meter img').css('opacity', (backgroundAlpha<0.15?0.15:backgroundAlpha));
    goodColorRGBA = goodColorRGBA.split(',');
    goodColorRGBA[3] = (backgroundAlpha < 0.05 ? 0.05 : backgroundAlpha) + ")";
    goodColorRGBA = goodColorRGBA.join(',');
    $('#example_good .fill').css("background-color", goodColorRGBA);
    let badColorRGBA = hexToRgbA($('#spells_bad_fill').val());
    badColorRGBA = badColorRGBA.split(',');
    badColorRGBA[3] = (backgroundAlpha < 0.05 ? 0.05 : backgroundAlpha) + ")";
    badColorRGBA = badColorRGBA.join(',');
    $('#example_bad .fill').css("background-color", badColorRGBA);
    let goodTextRGBA = hexToRgbA($("#spells_good_text_color").val());
    goodTextRGBA = goodTextRGBA.split(',');
    goodTextRGBA[3] = (backgroundAlpha < 0.20 ? 0.20 : backgroundAlpha) + ")";
    goodTextRGBA = goodTextRGBA.join(',');
    $('#example_good .txt').css("color", goodTextRGBA);
    let badTextRGBA = hexToRgbA($("#spells_bad_text_color").val());
    badTextRGBA = badTextRGBA.split(',');
    badTextRGBA[3] = (backgroundAlpha < 0.20 ? 0.20 : backgroundAlpha) + ")";
    badTextRGBA = badTextRGBA.join(',');
    $('#example_bad .txt').css("color", badTextRGBA);
    let goodBgRGBA = hexToRgbA($("#spells_good_bg").val());
    goodBgRGBA = goodBgRGBA.split(',');
    goodBgRGBA[3] = backgroundAlpha + ")";
    goodBgRGBA = goodBgRGBA.join(',');
    $('#example_good').css("background-color", goodBgRGBA);
    let badBgRGBA = hexToRgbA($("#spells_bad_bg").val());
    badBgRGBA = badBgRGBA.split(',');
    badBgRGBA[3] = backgroundAlpha + ")";
    badBgRGBA = badBgRGBA.join(',');
    $('#example_bad').css("background-color", badBgRGBA);
}

$("#display_alpha").on("change", () => {
    let backgroundAlpha = ($("#display_alpha").val() / 255);
    $("#display_alpha_value").text(backgroundAlpha * 100);
    $("#display_alpha_value").text($("#display_alpha_value").text().substring(0, 4));
    UpdateExamples();
});

$('#spells_good_fill').on("change", function(){UpdateExamples();});
$('#spells_bad_fill').on("change", function(){UpdateExamples();});
$('#spells_good_text_color').on("change", function(){UpdateExamples();});
$('#spells_bad_text_color').on("change", function(){UpdateExamples();});
$('#spells_good_bg').on("change", function(){UpdateExamples();});
$('#spells_bad_bg').on("change", function(){UpdateExamples();});

//From https://stackoverflow.com/a/21648508/1510725
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
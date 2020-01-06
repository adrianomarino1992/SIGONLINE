$(`<button id="openTerminal">
<img src="img/terminal.png" style="width: 30px;position: relative; margin-top: -2px;">
    </button>
    <div id="divTerminal">
        <div id="consultaTerminalResult">

        </div>
        <input type="text" id="consultaTerminal" placeholder="Digite seu comando ...">
    </div>`).appendTo(document.body);


$(document).on('click', '#openTerminal', (event) => {
    var btn = event.currentTarget;
    if ($(document.querySelector('#divTerminal')).css('display') == 'none') {
        $(btn).css('border','1px solid #51fa02');
        $(document.querySelector('#divTerminal')).fadeIn();
    } else {
        $(document.querySelector('#divTerminal')).fadeOut();
        $(btn).css('border','2px solid #3b3b3bad');
    }
})

var text = "";
$(document).on('keyup', '#consultaTerminal', (event) => {

    if (event.keyCode == 13) {

        if ($('#consultaTerminal').val().trim() == ".csv") {
            $('#consultaTerminalResult').append(`<p>.csv</p>`);
            $('#consultaTerminal').val("");
            let link = document.createElement('a');
            link.setAttribute('download', `tabela.txt`);
            link.href = makeTextFile(text);
            document.body.appendChild(link);

            window.requestAnimationFrame(function () {
                let event = new MouseEvent('click');
                link.dispatchEvent(event);
                document.body.removeChild(link);
            });
        } else {

            var linha = $('#consultaTerminal').val();

            var url = `${host}/terminal/query?linha=${linha}`;
            $('#consultaTerminal').val("");
            console.log(encodeURI(url));
            var abort;
            $('#consultaTerminalResult').append(`<p>${linha}</p>`);
            var query = $.getJSON(encodeURI(url), (data) => {
                if (data.erro) {

                    $('#consultaTerminalResult').append(`<p>${data.erro.originalError.info.message}</p>`);

                } else {
                    var colunas = [];
                    var registros = "";
                    var htmlColunas = `<table class="terminalTable"><tr>`;


                    $.each(data[0], function (key, value) {
                        colunas.push(key);

                    });


                    for (var i of colunas) {

                        htmlColunas += `<th>${i}</th>`;
                        text += `${i};`

                    }
                    htmlColunas += `</tr>`;
                    text += `\r\n`;

                    for (var i of data) {
                        registros += `<tr>`;
                        for (var j of colunas) {
                            // console.log(j);

                            registros += `<td>${i[j]}</td>`
                            text += `${i[j]};`
                        }
                        registros += `</tr>`;
                        text += `\r\n`;

                    }
                    console.log(text);

                    var tabela = htmlColunas + registros + "</table>";
                    //console.log(tabela);
                    $('#consultaTerminalResult').append(tabela);
                }
                clearTimeout(abort);
            })
            abort = setTimeout(function () { query.abort(); alert('Tempo de conecção expirou !'); }, 10000);

        }
    }
})



var btnAdmin = document.createElement('button');
btnAdmin.appendChild(newImg('./img/admin.png'));
var customAdmin = newCustomControl('custom_Admin', [btnAdmin]);

map.addControl(customAdmin);


$(btnAdmin).on('click', () => {

    if (adminMOde == true) {
        $(btnAdmin).css("border", "none");
        adminMOde = false;
    } else {
        $(btnAdmin).css("border", "1px solid rgb(143, 252, 0)");
        adminMOde = true;
    }

})



$('#updateAttrsAsAdmin').on('click',()=>{
    updateAttrsAsAdmin();
})

function updateAttrsAsAdmin() {
    var gid;
    var tb;

    //  console.log(editarAttrFeature);
    if (editarAttrFeature.N.arquivo) {
        gid = editarAttrFeature.N.id;
        tb = editarAttrFeature.N.arquivo;

    }
    var update = `update ${tb} set `;

    for (var row of editarAttrCampos) {
        var val = $(`#AttrEditar_${row.campo.trim()}`).val();
        if (val * 0 == 0) {
            var js = `editarAttrFeature.setProperties({${row.campo}:${val}});`;
            eval(js);
            update += `${row.campo} = ${val},`;
        } else {
            var js = `editarAttrFeature.setProperties({${row.campo}:'${val}'});`;
            eval(js);
            update += `${row.campo} = '${val}',`;
        }



        $('#editarAttrTools').fadeOut();
        toolbox_editarAttr = false;

    }
    update = update.substring(0, update.length - 1);
    update += ` where id = ${gid}`;

    var url = `${host}/pastas/dados/update?consulta=${update}`;
    url = encodeURI(url);
    openLoader();
    $.getJSON(url, (data) => {
        console.log(data);
        closeLoader();
    })
}
var EditarAdminSalvar = $('#EditarAdminSalvar');
EditarAdminSalvar.on('click', () => {
    editarFeaturesGeometry2Bd();
    $('#EditarAdminSalvar_div').fadeOut();
})

function editarFeaturesGeometry2Bd() {
    var features = editedCamada.getSource().getFeatures();
    var WKT = new ol.format.WKT();
    openLoader();

    if (featuresModified.N.arquivo) {
        var f = featuresModified;
        //console.log(f);
        var thisGeom = WKT.writeGeometry(f.getGeometry());
        var abortAjax;
        var gid = f.N.id;
        var tb = f.N.arquivo;
        var consultaUpdate = `update ${tb} set geom = ST_geomfromtext('${thisGeom}',4326) where id = ${gid}`;
        //  console.log(consultaUpdate);
        var url = encodeURI(`${host}/update/geom`);
        var ajaxBuffer = $.ajax({
            url: url,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ consulta: consultaUpdate }),
            success: function (data) {
                // console.log(data);

                clearTimeout(abortAjax);

            }
        })
        abortAjax = setTimeout(() => {
            ajaxBuffer.abort();
            closeLoader();
            alert('Tempo de conecção expirou !');
        }, 15000);


        closeLoader();


    }
}
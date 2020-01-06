/* VARIAVEIS GLOBAIS */

var allVisibleLayers = { layers: [] };
var layersLegenda = [];
var DoubleLayers = [];
var styleFeatureSelected;
var fotoAtual;
const host = `http://10.68.54.169:443`;
 

// FUNCTION TO CREATE IMG FOR BUTTONS
function newImg(src) { // PARAMETER IMG SOURCE
    let img = document.createElement('img');
    img.src = src;
    img.style.backgroundRepeat = 'no-repeat';
    img.style.backgroundPosition = 'center center';
    img.style.width = '25.08px';
    img.style.height = '25.08px';
    return img;
};

// CONTROL - FULLSCREEN 
var olFullscreen = new ol.control.FullScreen({
    label: newImg('./img/fullscreen.png'), // IMG BUTTON OFF
    labelActive: newImg('./img/fechar.png'), // IMG BUTTON ON
    tipLabel: 'Tela Cheia' // TIP
});

// CONTROL - ROTATE 
var olRotate = new ol.control.Rotate({
    label: newImg('./img/acima.png'), // IMG BUTTON
    autoHide: false, // AUTO HIDE OFF
    tipLabel: 'Rotacionar' // TIP
});


// CONTROL - SCALE 
var olScale = new ol.control.ScaleLine();

// FUNCTION TO CREATE CUSTOM CONTROLS
function newCustomControl(classe, elements) { // PARAMETERS CLASS NAME AND ARRAY OF ELEMENTS
    let newElement = document.createElement('div'); // CREATES A NEW DIV ELEMENT
    newElement.className = `${classe} ol-unselectable ol-control`; // DEFINE THE ELEMENT CLASS

    for (let i = 0; i < elements.length; i++) { // FOR EACH ELEMENT INTO THE ARRAY
        newElement.appendChild(elements[i]);
    }

    var newControl = new ol.control.Control({
        element: newElement // CONTROL ELEMENT
    });

    return newControl; // RETURNS THE CUSTOM CONTROL
}

// CUSTOM CONTROL - USER POSITION ON MAP
var btnPosition = document.createElement('button');
btnPosition.appendChild(newImg('./img/gps.png'));
var customPosition = newCustomControl('custom_position', [btnPosition]);

var btnLegenda = document.createElement('button');
btnLegenda.appendChild(newImg('./img/informacao.png'));
var customLegenda = newCustomControl('custom_legenda', [btnLegenda]);

var btnMedir = document.createElement('button');
btnMedir.appendChild(newImg('./img/area.png'));
var customArea = newCustomControl('custom_area', [btnMedir]);

var btnBuscar = document.createElement('button');
btnBuscar.appendChild(newImg('./img/buscar.png'));
var customBuscar = newCustomControl('custom_buscar', [btnBuscar]);

var btnRaster = document.createElement('button');
btnRaster.appendChild(newImg('./img/raster.png'));
var customRaster = newCustomControl('custom_Raster', [btnRaster]);

var btnGrade = document.createElement('button');
btnGrade.appendChild(newImg('./img/grade.png'));
var customGrade = newCustomControl('custom_Grade', [btnGrade]);

var btnVector = document.createElement('button');
btnVector.appendChild(newImg('./img/vector.png'));
var customVector = newCustomControl('custom_Vector', [btnVector]);

var btnStats = document.createElement('button');
btnStats.appendChild(newImg('./img/stats.png'));
var customStats = newCustomControl('custom_Stats', [btnStats]);

var btnBaixar = document.createElement('button');
btnBaixar.appendChild(newImg('./img/baixar.png'));
var customBaixar = newCustomControl('custom_Baixar', [btnBaixar]);

var btnStyle = document.createElement('button');
btnStyle.appendChild(newImg('./img/estilo.png'));
var customStyle = newCustomControl('custom_Style', [btnStyle]);

var btnDescricao = document.createElement('button');
btnDescricao.appendChild(newImg('./img/fulllegenda.png'));
var customDescricao = newCustomControl('custom_Descricao', [btnDescricao]);

var btnEditarLayer = document.createElement('button');
btnEditarLayer.appendChild(newImg('./img/build.png'));
var customEditarLayer = newCustomControl('custom_EditarLayer', [btnEditarLayer]);



var map = new ol.Map({
    layers: [
        
    ],
    controls: ol.control.defaults({ rotate: false }).extend([
        olFullscreen,
        olRotate,

        customPosition,
        customLegenda,
        customArea,
        customBuscar,
        customRaster,
        customGrade,
        customVector,
        customStats,
        customBaixar,
        customStyle,
        customDescricao,
        customEditarLayer

    ]),
    target: 'map',
    view: new ol.View({
        projection: 'EPSG:4326',
        center: [-45.96, -23.3],

        zoom: 13
    })
});

var vectorSource = new ol.source.Vector({
});

var selectedsLayer = new ol.layer.Vector({
    source: vectorSource



});
map.addLayer(selectedsLayer);

var graticule = new ol.Graticule({
    // the style to use for the lines, optional.
    strokeStyle: new ol.style.Stroke({
        color: 'rgba(255,120,0,0.9)',
        width: 2,
        lineDash: [0.5, 4]
    }),
    showLabels: true
});
var gradeOn = 1;
graticule.setMap(map);


// FUNCTION TO CREATE A VECTOR STYLE
function newVectorStyle(fill, stroke, width) {
    let style = new ol.style.Style({ // NEW ol.style.Style
        fill: new ol.style.Fill({ // TO POLYGONS AND LINES
            color: fill
        }),
        stroke: new ol.style.Stroke({ // TO POLYGONS AND LINES
            width: width,
            color: stroke
        }),
        image: new ol.style.Circle({
            fill: new ol.style.Fill({ // TO POINTS
                color: fill
            }),
            stroke: new ol.style.Stroke({ // TO POINTS
                width: width,
                color: stroke
            }),
            radius: 7 // TO POINTS
        })
    });
    return style; // RETURNS THE VECTOR STYLE
};

var btnDesenhar = document.createElement('button');
btnDesenhar.appendChild(newImg('./img/edit.png'));
var customDesenhar = newCustomControl('custom_desenhar', [btnDesenhar]);
map.addControl(customDesenhar);






var div_base_cartografica = $('#div_base_cartografica');
div_base_cartografica.on('click', () => {
    $('#basecartografica_data').fadeOut();
})


var camadas_btn = $('#camadas_btn');

var filtros_btn = $('#filtros_btn');

var buscar_btn = $('#buscar_btn');




camadas_btn.on('click', () => {
    $(camadas_btn).css('background-color', "#7b7b7b18");
    $(filtros_btn).css('background-color', "#7b7b7b00");
    $(buscar_btn).css('background-color', "#7b7b7b00");
    $('#div_layers').fadeIn();
    $('#divFiltrardados').fadeOut();
    $('#divBuscar').fadeOut();
});

$('#div_base_cartografica').on('click', () => {
    $('#div_camadas_sub_folder').css('display') == "none" ?
        $('#div_camadas_sub_folder').fadeIn() :
        $('#div_camadas_sub_folder').fadeOut();

})


var base_shp = $('#base_shp');
base_shp.on('click', () => {

    $('#div_camadas_sub_folder_base_shp').css('display') == "none" ?
        $('#div_camadas_sub_folder_base_shp').fadeIn() :
        $('#div_camadas_sub_folder_base_shp').fadeOut();
})

$('#secretaria_SMA').on('click', () => {

    $('#div_SMA_sub_folder').css('display') == "none" ?
        $('#div_SMA_sub_folder').fadeIn() :
        $('#div_SMA_sub_folder').fadeOut();
})

var dados_SMA_Abastecimento_shp = $('#dados_SMA_Abastecimento_shp');
dados_SMA_Abastecimento_shp.on('click', () => {
    $('#div_camadas_sub_folder_SMA_abastecimento').css('display') == "none" ?
        $('#div_camadas_sub_folder_SMA_abastecimento').fadeIn() :
        $('#div_camadas_sub_folder_SMA_abastecimento').fadeOut();
})
var dados_SMA_App_shp = $('#dados_SMA_App_shp');
dados_SMA_App_shp.on('click', () => {
    $('#div_camadas_sub_folder_SMA_app').css('display') == "none" ?
        $('#div_camadas_sub_folder_SMA_app').fadeIn() :
        $('#div_camadas_sub_folder_SMA_app').fadeOut();
})
var dados_SMA_Uso_shp = $('#dados_SMA_Uso_shp');
dados_SMA_Uso_shp.on('click', () => {
    $('#div_camadas_sub_folder_SMA_Uso').css('display') == "none" ?
        $('#div_camadas_sub_folder_SMA_Uso').fadeIn() :
        $('#div_camadas_sub_folder_SMA_Uso').fadeOut();
})
var dados_SMA_Infraestrutura_shp = $('#dados_SMA_Infraestrutura_shp');
dados_SMA_Infraestrutura_shp.on('click', () => {
    $('#div_camadas_sub_folder_SMA_Infraestrutura').css('display') == "none" ?
        $('#div_camadas_sub_folder_SMA_Infraestrutura').fadeIn() :
        $('#div_camadas_sub_folder_SMA_Infraestrutura').fadeOut();
})


$('#secretaria_GO').on('click', () => {

    $('#div_GO_sub_folder').css('display') == "none" ?
        $('#div_GO_sub_folder').fadeIn() :
        $('#div_GO_sub_folder').fadeOut();
})


$('#secretaria_Fiscalizacao').on('click', () => {

    $('#div_Fiscalizacao_sub_folder').css('display') == "none" ?
        $('#div_Fiscalizacao_sub_folder').fadeIn() :
        $('#div_Fiscalizacao_sub_folder').fadeOut();
})



var divFiltrardados_h2 = $('#divFiltrardados_h2 h2');
for (var btn of divFiltrardados_h2) {
    $(btn).on('click', (event) => {
        var cat = event.currentTarget;
        if ($(cat).text() == "Base Cartografica") {
            $('#divFiltrardados_h2_Base_cartografica').fadeIn();
            $('#divFiltrardados_h2_fiscalizacao').fadeOut();
            $('#divFiltrardados_h2_Base_SMA').fadeOut();
            $('#divFiltrardados_h2_Base_GOV').fadeOut();
        } else if ($(cat).text() == "Secretaria do Meio Ambiente") {
            $('#divFiltrardados_h2_Base_cartografica').fadeOut();
            $('#divFiltrardados_h2_fiscalizacao').fadeOut();
            $('#divFiltrardados_h2_Base_SMA').fadeIn();
            $('#divFiltrardados_h2_Base_GOV').fadeOut();
        } else if ($(cat).text() == "Secretaria do Governo") {
            $('#divFiltrardados_h2_Base_cartografica').fadeOut();
            $('#divFiltrardados_h2_fiscalizacao').fadeOut();
            $('#divFiltrardados_h2_Base_SMA').fadeOut();
            $('#divFiltrardados_h2_Base_GOV').fadeIn();
        } else {
            $('#divFiltrardados_h2_Base_cartografica').fadeOut();
            $('#divFiltrardados_h2_fiscalizacao').fadeIn();
            $('#divFiltrardados_h2_Base_SMA').fadeOut();
            $('#divFiltrardados_h2_Base_GOV').fadeOut();
        }
    })
}








filtros_btn.on('click', () => {
    $(filtros_btn).css('background-color', "#7b7b7b18");
    $(camadas_btn).css('background-color', "#7b7b7b00");
    $(buscar_btn).css('background-color', "#7b7b7b00");
    $('#div_layers').fadeOut();
    $('#divFiltrardados').fadeIn();

    $('#divBuscar').fadeOut();

});

var divFiltrardados_h2_Base_cartografica_buttom = $('#divFiltrardados_h2_Base_cartografica_buttom');

divFiltrardados_h2_Base_cartografica_buttom.on('click', () => {
    var divFiltrardados_h2_Base_cartografica_sel_data = $('#divFiltrardados_h2_Base_cartografica_sel_data');
    AddlayerFromFolders($(divFiltrardados_h2_Base_cartografica_sel_data).val(), $('#divFiltrardados_h2_Base_cartografica_sel_data option:selected').text());
})







buscar_btn.on('click', () => {
    $(buscar_btn).css('background-color', "#7b7b7b18");
    $(filtros_btn).css('background-color', "#7b7b7b00");
    $(camadas_btn).css('background-color', "#7b7b7b00");
    $('#divBuscar').fadeIn();
    $('#divFiltrardados').fadeOut();
    $('#div_layers').fadeOut();
});




var all_div_layers_btns = $('.foldersOpened h2');
for (var btn of all_div_layers_btns) {
    $(btn).on('click', (event) => {
        var btn = event.currentTarget;
        // console.log($(btn).text());
        AddlayerFromFolders(btn.id, $(btn).text());
    })
}

function AddlayerFromFolders(id, nome) {
    $.get(`GeoJSON/${id}.geojson`, (data) => {
        var vectorSource = new ol.source.Vector({
            features: (new ol.format.GeoJSON()).readFeatures(data)
        });

        var vectorLayer = new ol.layer.Vector({
            source: vectorSource


        });

        map.addLayer(vectorLayer);
        var obj = { "camada": vectorLayer, "nome": nome };
        allVisibleLayers.layers.push(obj);
    })
}




// FUNCTION TO GET USER GEOLOCATION
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    // else {
    //     x.innerHTML = "Geolocation is not supported by this browser.";
    // }
}

// FUNCTION TO GET COORDINATES AND ADD IT ON MAP
function showPosition(position) {
    addPointToCoordinate(position.coords.longitude, position.coords.latitude);
}

// FUNCTION TO ADD USER GEOLOCATION ON MAP
function addPointToCoordinate(longitude, latitude) {
    var x = longitude * 20037508.34 / 180;
    var y = Math.log(Math.tan((90 + latitude) * Math.PI / 360)) / (Math.PI / 180);
    y = y * 20037508.34 / 180;

    var geojsonObject = {
        'type': 'FeatureCollection',
        'crs': {
            'type': 'name',
            'properties': {
                'name': 'EPSG:3857'
            }
        },
        'features': [{
            'type': 'Feature',
            'properties': {
                'name': 'User',
                'X': x,
                'Y': y
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [x, y]
            }
        }]
    };
    var vectorSource = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(geojsonObject)
    });
    var vectorLayer = new ol.layer.Vector({
        source: vectorSource
    });
    map.addLayer(vectorLayer);

    map.getView().animate({
        center: [x, y],
        zoom: 18
    });
};

// ON click EVENT 
$(btnPosition).on('click', () => {
    getLocation();
});




var IluminacaoPublica = [
    'Ativação De Chave magnética',
    'Instalação de Kit de Iluminação Pública',
    'Luminária Quebrada',
    'Lâmpada Acesa Durante o Dia',
    'Lâmpada Apagada',
    'Lâmpada Piscando',
    'Mais De Uma Lâmpada Apagada Na Mesma Rua',
    'Praça com Lâmpadas Apagadas',
    'Todas'
];

var ManutencaoDeViasPublicas = [
    'Concerto de Tampa e Boca de Lobo',
    'Desnível de Tampa em Via Pública',
    'Manutenção de Bloquete</option>',
    'Manutenção de calçadas</option>',
    'Tapa Buraco',
    'Todas'
];

var MeioAmbiente = [
    'Capina e Limpeza de Área Pública',
    'Limpeza de Córregos',
    'Manutenção de Praças',
    'Manutenção de calçadas',
    'Poda de Árvore',
    'Remoção de Animais Mortos',
    'Varrição',
    'Todas'
];

var MobilidadeUrbana = [
    'Manutenção de Pinturas de Solo',
    'Manutenção de Placas',
    'Manutenção de Vias Públicas',
    'Manutenção em calçadas',
    'Manutenção Semafórica',
    'Pinturas de Guias',
    'Solicitação de Lombadas e Lombofaixas',
    'Solicitação de Rampa de acesso em Via Pública',
    'Todas'
];

var Onibus = [
    'Denúncia de Ônibus Atrasado',
    'Denúncia de Ônibus Lotado',
    'Horário de Ônibus',
    'Intinerários',
    'Limpeza de Ponto de Ônibus',
    'Ponto de Ônibus Danificado',
    'Todas'
];

var Ouvidoria = [
    'Denúncia',
    'Elogios',
    'Reclamações',
    'Sugestões',
    'Todas'
];

var ProtecaoAnimal = [
    'Animais de Grande Porte em Via Pública',
    'Animal Abandonado',
    'Remoção de Animal Morto',
    'Todas'
];

var SAAE = [
    'Limpeza de boca Lobo',
    'Serviço de Drenagem e Limpeza de Galeria',
    'Vazamento',
    'Todas'
];


var Limpeza_Publica = [
    "Descarte de lixo nas vias",
    "Deficiencia de varredura",
    "Deficeiencia de coleta",
    "Mato crescendo nas guias",
    "Animal de pequeno porte morto"
];
var Coleta_de_Residuos = [
    "Coleta de residuo",
    "Coleta de residuo hospitalar",
    "Coleta de residuo reciclavel"

];
var Meio_Ambiente = [
    "Poluiçao atmosferica",
    "Lançamento de residuos em curso d´gua",
    "Incomodo gerado por industrias"
];
var Protecao_Animal = [
    "Mals tratos",
    "Animal abandonado",
    "Quer doar"

];


var gov_categorias = [
    "Iluminacao Pública",
    "Manutenção De Vias Públicas",
    "Mobilidade Urbana",
    "Ônibus",
    "Ouvidoria",
    "Proteção Animal",
    "SAAE",

]

var sma_categorias = [
    "Limpeza Publica",
    "Coleta de Residuos",
    "Meio Ambiente",
    "Proteção Animal"

]







var cat_sel = $('#cat_sel');
var cat_sel_secretaria = "SMA";

cat_sel.on('change', () => {
    var secretaria = $(cat_sel).val();
    if (secretaria == "SMA") {
        addSMAcats();
        carregarSubSel(Limpeza_Publica);
        cat_sel_secretaria = "SMA";

    } else {
        addGOVcats();
        carregarSubSel(IluminacaoPublica);
        cat_sel_secretaria = "GOV";
    }
})


function addSMAcats() {
    $('#divFiltrardadosFiscalizacaoOcorrencia_cat_sel').empty();
    for (var cat of sma_categorias) {
        $('#divFiltrardadosFiscalizacaoOcorrencia_cat_sel').append(`<option value='${cat}'>${cat}</option>`);
    }
}

function addGOVcats() {
    $('#divFiltrardadosFiscalizacaoOcorrencia_cat_sel').empty();
    for (var cat of gov_categorias) {
        $('#divFiltrardadosFiscalizacaoOcorrencia_cat_sel').append(`<option value='${cat}'>${cat}</option>`);
    }
}

function carregarSubSel(obj) {
    $('#divFiltrardadosFiscalizacaoOcorrencia_subcat_sel').empty();
    for (var sub_cat of obj) {
        $('#divFiltrardadosFiscalizacaoOcorrencia_subcat_sel').append(`<option value="${sub_cat}">${sub_cat}</option>`);
    }

}
addSMAcats();
carregarSubSel(Limpeza_Publica);
var divFiltrardadosFiscalizacaoOcorrencia_cat_sel = $('#divFiltrardadosFiscalizacaoOcorrencia_cat_sel');
divFiltrardadosFiscalizacaoOcorrencia_cat_sel.on('change', () => {
    var cat = $(divFiltrardadosFiscalizacaoOcorrencia_cat_sel).val();
    if (cat_sel_secretaria == "SMA") {

        console.log(cat);
        switch (cat) {
            case sma_categorias[0]: carregarSubSel(Limpeza_Publica); break;
            case sma_categorias[1]: carregarSubSel(Coleta_de_Residuos); break;
            case sma_categorias[2]: carregarSubSel(Meio_Ambiente); break;
            case sma_categorias[3]: carregarSubSel(Protecao_Animal); break;
        }
    } else {
        console.log(cat);
        switch (cat) {
            case gov_categorias[0]: carregarSubSel(IluminacaoPublica); break;
            case gov_categorias[1]: carregarSubSel(ManutencaoDeViasPublicas); break;
            case gov_categorias[2]: carregarSubSel(MobilidadeUrbana); break;
            case gov_categorias[3]: carregarSubSel(Onibus); break;
            case gov_categorias[4]: carregarSubSel(Ouvidoria); break;
            case gov_categorias[5]: carregarSubSel(ProtecaoAnimal); break;
            case gov_categorias[6]: carregarSubSel(SAAE); break;
        }
    }
})










var divFiltrardadosFiscalizacaoOcorrencia_exec = $('#divFiltrardadosFiscalizacaoOcorrencia_exec');
divFiltrardadosFiscalizacaoOcorrencia_exec.on('click', () => {
    var categoria = $('#divFiltrardadosFiscalizacaoOcorrencia_cat_sel').val();
    var subcategoria = $('#divFiltrardadosFiscalizacaoOcorrencia_subcat_sel').val();
    var status = $('#divFiltrardadosFiscalizacaoOcorrencia_status_sel').val();
    var url = `${host}/query/fiscalizacao?secretaria='Governo'&categoria=${categoria}&subcategoria=${subcategoria}&status=${status}`;
    var url = encodeURI(url);
    var abort;
    var query = $.getJSON(url, (data) => {
        if (data.erro) {
            console.log(data.erro);
        }
        if (data.length == 0) {
            alert('Nenhum registro encontrado');
        }
        if (data.length > 0) {
            var source = new ol.source.Vector();

            var layer = new ol.layer.Vector({
                source: source
            })
            map.addLayer(layer);
            var modify = new ol.interaction.Modify({ source: source });
            map.addInteraction(modify);
            snap = new ol.interaction.Snap({ source: source });
            map.addInteraction(snap);
            var obj = { 'camada': layer, 'nome': `Categoria : ${categoria}, Subcategoria : ${subcategoria}` };


            allVisibleLayers.layers.push(obj);


            for (var f of data) {
                var feature = createFeatureFromGeoJson(f, 2);
                layer.getSource().addFeatures(feature);
            }

        }
    })

})


var buscar_protocolo_btn = $('#buscar_protocolo_btn');

buscar_protocolo_btn.on('click', () => {
    var protocolo_secretaria = $('#protocolo_secretaria').val();
    var protocolo = $('#buscar_protocolo').val();
    var tb;
    var url;
    if (protocolo_secretaria == "SMA") {
        tb = 1;
        url = `${host}/consulta/tabular?secretaria=Meio_Ambiente&consulta=protocolo&protocolo=${protocolo}`;
    } else {
        tb = 2;
        url = `${host}/consulta/tabular?secretaria=Governo&consulta=protocolo&protocolo=${protocolo}`;
    }
    $('#buscar_result').empty();


    url = encodeURI(url);

    $.getJSON(url, (data) => {
        if (data.length > 0) {
            var f = data[0];
            for (var keys in f) {
                if (keys != "fotoDenuncia" && keys != "fotoOcorrencia") {
                    $('#buscar_result').append(` <h2 class="cat_teme">${keys} : </h2>
                        <input type="text" class="input" disabled value="${f[keys]}">`);
                }
            }

            var feature = createFeatureFromGeoJson(f, tb);
            console.log(feature);
            var source = new ol.source.Vector({});

            var layer = new ol.layer.Vector({
                source: source
            })
            map.addLayer(layer);
            layer.getSource().addFeatures(feature);
            var obj = { 'camada': layer, 'nome': `Resultado Busca : ${protocolo}` };
            if (allVisibleLayers.layers.indexOf(obj) == -1) {

                allVisibleLayers.layers.push(obj);
            }
        }
    })



})


var buscar_tipo = $('#buscar_tipo');
buscar_tipo.on('change',()=>{
    var tipo = $(buscar_tipo).val();
    if(tipo == "protocolo"){
        $('#divBuscar_metadado').css('display','none');
        $('#divBuscar_protocolo').fadeIn();
        
    }else{
        $('#divBuscar_metadado').fadeIn();
        $('#divBuscar_protocolo').css('display','none');
        
    }
})

var buscar_meta_btn= $('#buscar_meta_btn');
buscar_meta_btn.on('click',()=>{
    $('#meta_search_result').empty();
    var categoria = $('#metadado_categoria').val();
    var url = `${host}/listarAllFiles?pasta=${categoria}`;
    url = encodeURI(url);
    $.getJSON(url,(data)=>{
        
        for(var file of data.files){
            $('#meta_search_result').append(`<p><a class="download" target="_blank" href="${host}/download?diretorio=${file.nome}&pasta=${categoria}">${file.nome}</a></p>`);

        }
        
    })

})





var selected_style = newVectorStyle('rgba(47, 108, 241, 0.548)', 'rgb(0, 0, 255)', 2);
var situacaoOcorrencia;
var pt_clone = null;
function getFeatureId(pixel) {



    var feature = map.forEachFeatureAtPixel(pixel, function (feature) {

        if (pt_clone !== null) {
            selectedsLayer.getSource().removeFeature(pt_clone);
            pt_clone = null;
        }

        if (feature) {
            pt_clone = feature.clone();

            pt_clone.setStyle(selected_style);
            selectedsLayer.getSource().addFeature(pt_clone);
        }


        $('#popup').empty();
        $('#popup').fadeIn();

        var f = feature.N;
        
        for (var keys in f) {
            
               
                if (keys != "fotoDenuncia" && keys != "fotoOcorrencia" && keys != "geometry") {
                    $('#popup').append(` <h2 class="cat_teme">${keys} : </h2>
                        <input type="text" class="input" disabled value="${f[keys]}">`);
                }
            
           

        }





    });


}

$(document).on('click', '#novaSituacaoOcorrencia', () => {
    $("#novaSituacaoOcorrencia option[value='" + situacaoOcorrencia + "']").attr('selected', 'selected');

})

var div_foto = $('#div_foto');
div_foto.on('click', () => {
    if (fotoAtual != null) {
        if ($('#fotoExpandir').attr('src') == "img/expandirBlack.png") {
            $('#fotoGrande').fadeIn();
            $('#fotoGrande').empty();
            $('#fotoGrande').append(`<img src="data:image/png;base64, ${fotoAtual}" id="fotoGrande_img">`);
            $('#fotoExpandir').attr('src', 'img/fechar_vermelho.png');
        } else {
            $('#fotoGrande').fadeOut();

            $('#fotoExpandir').attr('src', 'img/expandirBlack.png');
        }
    }

})

var desenharActived = false;
map.on('click', function (evt) {

    if (desenharActived == false && DrawActived == false && BuscarActived == false) {
        $('#popup').css('display', 'none');
        getFeatureId(evt.pixel);
    }









});



// var createCamadasWmsBd_sma = function (title, layer, zIndex, visible) { // FUNÇÃO PARA CRIAR AS CAMADAS WMS
//     var camadaWms = new ol.layer.Tile({ // NOVO LAYER TILE
//         title: title, // TÍTULO DA CAMADA 
//         source: new ol.source.TileWMS({ // FONTE DA CAMADA
//             url: 'http://10.68.54.16:8080/geoserver/bd_sma/wms', // URL
//             params: { // PARÂMETROS
//                 LAYERS: 'bd_sma:' + layer, // CAMADA
//                 TILED: true // TILE
//             },
//             serverType: 'geoserver', // TIPO DO SERVIÇO
//             crossOrigin: "anonymous" // ORIGEM
//         }),
//         zIndex: zIndex, // ÍNDICE Z DA CAMADA
//         visible: visible // VISIBILIDADE DA CAMADA
//     });
//     return camadaWms; // RETORNA O LAYER TILE
// };


var exec_sma_dados = $('#exec_sma_dados');

exec_sma_dados.on('click', () => {


    var layer_sma = $('#cat_sel_dados').val();
    if (DoubleLayers.indexOf(layer_sma) == -1) {
        openLoader();
        for (var i = 0; i < sma_dados_categorias.length; i++) {
            if (layer_sma == sma_dados_categorias[i]) {
                objectCamadasWmsSma[i].setVisible(true);
                var obj = { 'camada': objectCamadasWmsSma[i], 'nome': layer_sma };
                allVisibleLayers.layers.push(obj);
                map.addLayer(objectCamadasWmsSma[i]);
            }
        }
        setTimeout(() => {
            closeLoader();
        }, 2000);
        DoubleLayers.push(layer_sma);
    } else {
        console.log('Ja existe esse Layer');
    }
})

function LayerAddRemove(layer) {
    console.log(layer);
}
var nav_map = $('#nav_map');

nav_map.on('click', () => {



    $('#layer').css('display', 'none');
    $('#info').css('display', 'none');
    $('#div_filtro_s_ma').css('display', 'none');
    $('#div_filtro_s_ma_dados').css('display', 'none');

    if (allVisibleLayers.layers.length > 0) {

        for (var i = 0; i < allVisibleLayers.layers.length; i++) {
            if (layersLegenda.indexOf(allVisibleLayers.layers[i].nome) == -1) {
                $('#map_layers').append(`<label class="control control-checkbox">
                    ${allVisibleLayers.layers[i].nome}
            <input type="checkbox" checked="checked" class="LayerChecked" name="${allVisibleLayers.layers[i].nome}" />
            <div class="control_indicator"></div>
        </label>`);
                layersLegenda.push(allVisibleLayers.layers[i].nome);
            }
        }
    }
})

$(btnDescricao).on('click', () => {
    if ($('#legendaTools').css('display') == 'none') {
        $('#legendaTools').fadeIn();
        $('#legenda_layers').empty();
        if (allVisibleLayers.layers.length > 0) {

            for (var i = 0; i < allVisibleLayers.layers.length; i++) {
                $('#legenda_layers').append(`<option value='${allVisibleLayers.layers[i].nome}'>${allVisibleLayers.layers[i].nome}</option>`);
            }
        }
    } else {
        $('#legendaTools').fadeOut();
    }

})

$(btnEditarLayer).on('click', () => {
    if ($('#editarTools').css('display') == 'none') {
        $('#editarTools').fadeIn();
        $('#editar_layers').empty();
        if (allVisibleLayers.layers.length > 0) {

            for (var i = 0; i < allVisibleLayers.layers.length; i++) {
                $('#editar_layers').append(`<option value='${allVisibleLayers.layers[i].nome}'>${allVisibleLayers.layers[i].nome}</option>`);
            }
        }
    } else {
        $('#editarTools').fadeOut();
    }
})
var editarTools_aplicar = $('#editarTools_aplicar');
editarTools_aplicar.on('click', () => {
    var layer = $('#editar_layers').val();
    var camada;



    for (var i = 0; i < allVisibleLayers.layers.length; i++) {
        if (layer == allVisibleLayers.layers[i].nome) {

            camada = allVisibleLayers.layers[i].camada;

        }
    }
    var thisSource = camada.getSource();
    var modify = new ol.interaction.Modify({ source: thisSource });
    map.addInteraction(modify);
    snap = new ol.interaction.Snap({ source: thisSource });
    map.addInteraction(snap);
    $('#editarTools').fadeOut();
})

$(btnLegenda).on('click', () => {

    if (allVisibleLayers.layers.length > 0) {

        for (var i = 0; i < allVisibleLayers.layers.length; i++) {
            if (layersLegenda.indexOf(allVisibleLayers.layers[i].nome) == -1) {
                $('#map_layers').append(`<label class="control control-checkbox">
                    ${allVisibleLayers.layers[i].nome}
            <input type="checkbox" checked="checked" class="LayerChecked" name="${allVisibleLayers.layers[i].nome}" />
            <div class="control_indicator">
            
            </div>
        </label>`);
                layersLegenda.push(allVisibleLayers.layers[i].nome);
            }
        }
    }

    if ($('#map_layers').css('display') == "none") {
        $('#map_layers').fadeIn();
    } else {
        $('#map_layers').fadeOut();
    }
});

$(document).on("click", ".LayerChecked", function (event) {
    var input = event.currentTarget;
    var layer = input.name;
    var layerVisibility = input.checked;
    for (var i = 0; i < allVisibleLayers.layers.length; i++) {
        if (layer == allVisibleLayers.layers[i].nome) {
            if (layer == "Medições") {
                if (layerVisibility == false) {
                    map.removeLayer(allVisibleLayers.layers[i].camada);
                    $('.tooltip-static').fadeOut();
                } else {
                    map.addLayer(allVisibleLayers.layers[i].camada);
                    $('.tooltip-static').fadeIn();
                }
            } else {
                if (layerVisibility == false) {
                    map.removeLayer(allVisibleLayers.layers[i].camada);
                } else {
                    map.addLayer(allVisibleLayers.layers[i].camada);
                }
            }
        }
    }
    var LayersLegenda = $('.LayerChecked');
    var allDisabled = true;

    setTimeout(() => {
        for (var j = 0; j > LayersLegenda.length; j++) {
            if (layersLegenda[j].checked == true) {
                allDisabled = false;
            }
        }

        if (allDisabled == true) {
            selectedsLayer.getSource().removeFeature(pt_clone);
            pt_clone = null;
            $('#info_div').empty();
            $('#info_div').append(`<h2 class="flex_box">INFORMAÇÕES:</h2>`);
            $('#popup').fadeOut();
            $('#popup').empty();

        }
    }, 50);

});


$(document).bind("dblclick", ".LayerChecked", function (event) {
    var input = event.currentTarget;
    var layer = input.name;
    console.log(event.currentTarget);

});

// dragElement(document.getElementById("map_layers"));


function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV: 
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


var buscarProtocolo = $('#buscarProtocolo');
buscarProtocolo.on('click', () => {
    var protocolo = $('#protocolo').val();
    var cat = $('#busca_protocolo_sel').val();
    var url;
    var cor = $('#cor_vet_oc_protocolo').val();
    var estilo = newVectorStyle(cor, "#db6d08", 2);

    var feature;
    if (cat == "Meio_Ambiente") {
        url = `http://10.68.54.16:8080/geoserver/conecta_denuncias/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=conecta_denuncias:geoserver_vdenuncia_foto&maxFeatures=50&outputFormat=application%2Fjson`;
        var where = `&viewparams=protocolo:${protocolo}`;
        where = encodeURI(where);
        url = url + where;
        openLoader();
        $.getJSON(url, function (data) {
            feature = data.features[0].properties;
            fotoAtual = data.features[0].properties.fotoDenuncia;

            $('#info_div').empty();
            html = ` <h3>Protocolo:</h3>
            <input type="text" name="" id="" value="${feature.protocolo}" disabled class="popupInputs">
            <h3>ID do Cidadao:</h3>
            <input type="text" name="" id="" value="${feature.idCidadao}" disabled class="popupInputs">
            <h3>Data da Ocorrencia</h3>
            <input type="text" name="" id="" value="${feature.dataDenuncia}" disabled class="popupInputs">
            <h3>Categoria</h3>
            <input type="text" name="" id="" value="${feature.categoria}" disabled class="popupInputs">
            <h3>Subcategoria</h3>
            <input type="text" name="" id="" value="${feature.subcategoria}" disabled class="popupInputs">
            <h3>Descrição</h3>
            <input type="text" name="" id="" value="${feature.descricaoDenuncia}" disabled class="popupInputs">
            <h3>Endereço : </h3>
            <input type="text" name="" id="" value="${feature.endereco}" disabled class="popupInputs">`;





            var situacao = `<h3>Situação : </h3>
           <select name="" id="novaSituacaoOcorrencia" class="sel_teme_white">
          <option value="RECEBIDO">Recebido</option>
          <option value="VISUALIZADO">Visualizado</option>
          <option value="RESOLVIDO">Resolvido</option>
          <option value="FINALIZADO">Finalizado</option>
          <option value="DELETADO">Deletado</option>
            </select>`;

            var botaoSalvar = `<buttom class="buttom">Alterar</buttom>`;
            html += situacao;
            html += botaoSalvar;

            $('#info_div').append(html);


            situacaoOcorrencia = feature.situacaoDenuncia;
            $('#novaSituacaoOcorrencia').click();


            setTimeout(() => {
                closeLoader();
            }, 1000);
            if (data.totalFeatures >= 1) {
                var features = new ol.format.GeoJSON().readFeatures(data);

                var LayerProtocolo = new ol.source.Vector({
                });


                var Layer_Protocolo = new ol.layer.Vector({
                    source: LayerProtocolo,
                    style: estilo


                });
                map.addLayer(Layer_Protocolo);
                Layer_Protocolo.getSource().clear();
                Layer_Protocolo.getSource().addFeatures(features);



                var obj = { "camada": Layer_Protocolo, "nome": `Protocolo : ${feature.protocolo}` };
                allVisibleLayers.layers.push(obj);

            } else {
                console.log('nada');
            }



        })
    } else {
        openLoader();
        url = `http://10.68.54.16:8080/geoserver/conecta_denuncias/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=conecta_denuncias:geoserver_vocorrencia_foto&maxFeatures=50&outputFormat=application%2Fjson`;
        var where = `&viewparams=protocolo:${protocolo}`;
        where = encodeURI(where);
        url = url + where;
        $.getJSON(url, function (data) {
            feature = data.features[0].properties;
            fotoAtual = data.features[0].properties.fotoOcorrencia;
            $('#info_div').empty();
            html = ` <h3>Protocolo:</h3>
            <input type="text" name="" id="" value="${feature.protocolo}" disabled class="popupInputs">
            <h3>ID do Cidadao:</h3>
            <input type="text" name="" id="" value="${feature.idCidadao}" disabled class="popupInputs">
            <h3>Data da Ocorrencia</h3>
            <input type="text" name="" id="" value="${feature.dataOcorrencia}" disabled class="popupInputs">
            <h3>Categoria</h3>
            <input type="text" name="" id="" value="${feature.categoria}" disabled class="popupInputs">
            <h3>Subcategoria</h3>
            <input type="text" name="" id="" value="${feature.subcategoria}" disabled class="popupInputs">
            <h3>Descrição</h3>
            <input type="text" name="" id="" value="${feature.descricaoOcorrencia}" disabled class="popupInputs">
            <h3>Endereço : </h3>
            <input type="text" name="" id="" value="${feature.endereco}" disabled class="popupInputs">`;





            var situacao = `<h3>Situação : </h3>
           <select name="" id="novaSituacaoOcorrencia" class="sel_teme_white">
          <option value="RECEBIDO">Recebido</option>
          <option value="VISUALIZADO">Visualizado</option>
          <option value="RESOLVIDO">Resolvido</option>
          <option value="FINALIZADO">Finalizado</option>
          <option value="DELETADO">Deletado</option>
            </select>`;

            var botaoSalvar = `<buttom class="buttom">Alterar</buttom>`;
            html += situacao;
            html += botaoSalvar;

            $('#info_div').append(html);


            situacaoOcorrencia = feature.situacaoOcorrencia;
            $('#novaSituacaoOcorrencia').click();
            setTimeout(() => {
                closeLoader();
            }, 1000);
            if (data.totalFeatures >= 1) {
                var features = new ol.format.GeoJSON().readFeatures(data);


                var LayerProtocolo = new ol.source.Vector({
                });


                var Layer_Protocolo = new ol.layer.Vector({
                    source: LayerProtocolo,
                    style: estilo


                });
                map.addLayer(Layer_Protocolo);
                Layer_Protocolo.getSource().clear();
                Layer_Protocolo.getSource().addFeatures(features);



                var obj = { "camada": Layer_Protocolo, "nome": `Protocolo : ${feature.protocolo}` };
                allVisibleLayers.layers.push(obj);


            } else {
                console.log('nada');
            }


        })
    }





})

var source = new ol.source.Vector();

var vectorMedir = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(12, 243, 23, 0.205)'
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        })
    })
});

map.addLayer(vectorMedir);








/**
 * Currently drawn feature.
 * @type {ol.Feature}
 */
var sketch;


/**
 * The help tooltip element.
 * @type {Element}
 */
var helpTooltipElement;


/**
 * Overlay to show the help messages.
 * @type {ol.Overlay}
 */
var helpTooltip;


/**
 * The measure tooltip element.
 * @type {Element}
 */
var measureTooltipElement;


/**
 * Overlay to show the measurement.
 * @type {ol.Overlay}
 */
var measureTooltip;


/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
var continuePolygonMsg = 'Click para continuar a medir';


/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
var continueLineMsg = 'Click para continuar a medir';


/**
 * Handle pointer move.
 * @param {ol.MapBrowserEvent} evt The event.
 */
var pointerMoveHandler = function (evt) {
    if (evt.dragging) {
        return;
    }
    /** @type {string} */
    var helpMsg = 'Click para começar a medir ';

    if (sketch) {
        var geom = (sketch.getGeometry());
        if (geom instanceof ol.geom.Polygon) {
            helpMsg = continuePolygonMsg;
        } else if (geom instanceof ol.geom.LineString) {
            helpMsg = continueLineMsg;
        }
    }

    helpTooltipElement.innerHTML = helpMsg;
    helpTooltip.setPosition(evt.coordinate);

    helpTooltipElement.classList.remove('hidden');
};








var typeSelect = document.getElementById('type');

var draw; // global so we can remove it later


/**
 * Format length output.
 * @param {ol.geom.LineString} line The line.
 * @return {string} The formatted length.
 */
var formatLength = function (line) {

    var length = ol.Sphere.getLength(line);
    var output;
    length = length * 111000;
    if (length > 1000) {
        output = Math.round(length / 1000) +
            ' ' + 'km';
    } else {
        output = Math.round(length) +
            ' ' + 'm';
    }
    return output;
};


/**
 * Format area output.
 * @param {ol.geom.Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
var formatArea = function (polygon) {
    var area = ol.Sphere.getArea(polygon);
    var output;
    area = area * 12321000000;
    if (area > 1000) {
        output = Math.round(area / 1000) +
            ' ' + 'km<sup>2</sup>';
    } else {
        output = Math.round(area) +
            ' ' + 'm<sup>2</sup>';
    }
    return output;
};

function addInteraction() {
    var type = (typeSelect.value == 'area' ? 'Polygon' : 'LineString');
    draw = new ol.interaction.Draw({
        source: source,
        type: type,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(243, 66, 12, 0.245)'
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)'
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)'
                })
            })
        })
    });
    map.addInteraction(draw);

    createMeasureTooltip();

    createHelpTooltip();

    var listener;
    draw.on('drawstart',
        function (evt) {
            // set sketch
            sketch = evt.feature;

            /** @type {ol.Coordinate|undefined} */
            var tooltipCoord = evt.coordinate;

            listener = sketch.getGeometry().on('change', function (evt) {
                var geom = evt.target;
                var output;
                if (geom instanceof ol.geom.Polygon) {
                    output = formatArea(geom);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof ol.geom.LineString) {
                    output = formatLength(geom);
                    tooltipCoord = geom.getLastCoordinate();
                }
                measureTooltipElement.innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
            });
        }, this);

    draw.on('drawend',
        function () {
            measureTooltipElement.className = 'tooltip tooltip-static';
            measureTooltip.setOffset([0, -7]);
            // unset sketch
            sketch = null;
            // unset tooltip so that a new one can be created
            measureTooltipElement = null;
            createMeasureTooltip();
            ol.Observable.unByKey(listener);

        }, this);
}


/**
 * Creates a new help tooltip
 */
function createHelpTooltip() {
    if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'tooltip hidden';
    helpTooltip = new ol.Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left'
    });
    map.addOverlay(helpTooltip);

}


/**
 * Creates a new measure tooltip
 */
function createMeasureTooltip() {
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'tooltip tooltip-measure';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center'
    });
    map.addOverlay(measureTooltip);

}


/**
 * Let user change the geometry type.
 */
typeSelect.onchange = function () {
    map.removeInteraction(draw);
    addInteraction();
};



desenharActived = false;
$(btnMedir).on('click', () => {

    DrawActived = false;
    map.removeInteraction(desenhar);
    map.on('pointermove', pointerMoveHandler);
    map.getViewport().addEventListener('mouseout', function () {
        helpTooltipElement.classList.add('hidden');
    });
    if (allVisibleLayers.layers.indexOf(obj) == -1) {
        var obj = { 'camada': vectorMedir, 'nome': 'Medições' };
        allVisibleLayers.layers.push(obj);
    }

    if (desenharActived == false) {
        desenharActived = true;
        addInteraction();
        map.addOverlay(measureTooltip);
        map.addOverlay(helpTooltip);
        $('#MeasuringTool').fadeIn();

    } else {
        desenharActived = false;
        map.removeInteraction(draw);
        map.removeOverlay(measureTooltip);
        map.removeOverlay(helpTooltip);
        $('#MeasuringTool').fadeOut();
    }
})

var sourcedesenhar = new ol.source.Vector();

var vectorDesenhar = new ol.layer.Vector({
    source: sourcedesenhar,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(51, 139, 255,0.3)'
        }),
        stroke: new ol.style.Stroke({
            color: 'rgb(6, 68, 148)',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33'
            })
        })
    })
});

map.addLayer(vectorDesenhar);
var desenhar_style = newVectorStyle('rgba(47, 108, 241, 0.548)', 'rgb(0, 0, 255)', 4);
var desenhar = new ol.interaction.Draw({
    type: 'Polygon',
    source: vectorDesenhar.getSource(),
    style: desenhar_style,
    freehand: true
});

// map.removeOverlay(measureTooltip);
// map.removeOverlay(helpTooltip);
// $('#MeasuringTool').fadeOut();
// desenharActived = false;
// map.removeInteraction(draw);
// var obj = { 'camada': vectorDesenhar, 'nome': 'Desenhos' };
// if (allVisibleLayers.layers.indexOf(obj) == -1) {

//     allVisibleLayers.layers.push(obj);
// }

// if (DrawActived == false) {
//     map.addInteraction(desenhar);
//     DrawActived = true;

// } else {
//     map.removeInteraction(desenhar);
//     DrawActived = false;
// }


var DrawActived = false;
var desenharInteraction;
var mapHadDesenharInteraction = false;
var desenharOpen2save = false;
var allLayersDesenhados = [];

$(btnDesenhar).on('click', () => {
    if (desenharOpen2save == true) {
        DrawActived = false;
        map.removeInteraction(desenharInteraction);

        mapHadDesenharInteraction = false;
        btnDesenhar.children[0].src = "./img/edit.png";
        desenharOpen2save = false;
    } else {


        if (DrawActived == false) {
            $('#desenharVector').fadeIn();
            DrawActived = true;
        } else {
            $('#desenharVector').fadeOut();
            DrawActived = false;
        }
    }
})

var tipo_desenhar = $('#tipo_desenhar');
tipo_desenhar.on('change', () => {
    if ($(tipo_desenhar).val() == "LineString") {
        $('#tituloCor').css('display', 'none');
        $('#cor_layer_desenhar').css('display', 'none');

    } else {
        $('#tituloCor').css('display', 'block');
        $('#cor_layer_desenhar').css('display', 'block');
    }
})

var desenhar_vector_buttom = $('#desenhar_vector_buttom');

desenhar_vector_buttom.on('click', () => {
    refleshLegenda();
    if (mapHadDesenharInteraction == true) {
        map.removeInteraction(desenharInteraction);
        mapHadDesenharInteraction = false;
    }
    var tipo = $(tipo_desenhar).val();
    var modo_desenhar = $('#modo_desenhar').val();
    var cor_layer_desenhar = $('#cor_layer_desenhar').val();
    var cont_layer_desenhar = $('#cont_layer_desenhar').val();
    var largura_linha_desenhar = $('#largura_linha_desenhar').val();
    var nomeLayer_desenhar = $('#nomeLayer_desenhar').val();
    var layerDesenharName = `layer_${nomeLayer_desenhar}`;
    var sourcerDesenharLayer = `source_${nomeLayer_desenhar}`;
    var nomePermitido;
    for (var i in allLayersDesenhados) {
        if (allLayersDesenhados[i] == nomeLayer_desenhar) {
            nomePermitido = false;
        } else {
            nomePermitido = true;
        }
    }
    if (nomeLayer_desenhar.trim() == "" || nomePermitido == false) {
        alert('Nome do layer invalido.Por favor, digite outro.');

    } else {

        if (tipo == "Polygon") {
            cor_layer_desenhar = cor_layer_desenhar + "3d";
        }

        eval(`

    var sourcerDesenharLayer = new ol.source.Vector();

    var layerDesenharName = new ol.layer.Vector({
        source: sourcerDesenharLayer,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: cor_layer_desenhar
            }),
            stroke: new ol.style.Stroke({
                color: cont_layer_desenhar,
                width: largura_linha_desenhar
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: cor_layer_desenhar
                })
            })
        })
    });
    map.addLayer(layerDesenharName);
    var obj = { "camada": layerDesenharName, "nome": nomeLayer_desenhar };
        allVisibleLayers.layers.push(obj);
`);


        var freehand;
        if (modo_desenhar == "livre") {
            freehand = true;
        } else {
            freehand = false;
        }


        var desenhar_style = newVectorStyle(cor_layer_desenhar, cont_layer_desenhar, largura_linha_desenhar);
        desenharInteraction = new ol.interaction.Draw({
            type: tipo,
            source: sourcerDesenharLayer,
            style: desenhar_style,
            freehand: freehand
        });

        map.addInteraction(desenharInteraction);
        mapHadDesenharInteraction = true;
        $('#desenharVector').fadeOut();
        btnDesenhar.children[0].src = "./img/save.png";
        desenharOpen2save = true;
        allLayersDesenhados.push(nomeLayer_desenhar);

    }


})







var sourceBuscar = new ol.source.Vector();

var vectorBuscar = new ol.layer.Vector({
    source: sourceBuscar,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(235, 127, 39,0.2)'
        }),
        stroke: new ol.style.Stroke({
            color: 'rgba(235, 127, 39,0.7)',
            width: 2
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: 'rgba(235, 127, 39,0.7)'
            })
        })
    })
});

map.addLayer(vectorBuscar);

var buscar_style = newVectorStyle('rgba(235, 127, 39,0.2)', 'rgba(235, 127, 39,0.7)', 4);
var buscar = new ol.interaction.Draw({
    type: 'Polygon',
    source: vectorBuscar.getSource(),
    style: buscar_style,
    freehand: false
});
var buscarTools = $('#buscarTools');
var BuscarActived = false;
$(btnBuscar).on('click', () => {


    map.removeOverlay(measureTooltip);
    map.removeOverlay(helpTooltip);
    $('#MeasuringTool').fadeOut();
    desenharActived = false;
    map.removeInteraction(draw);
    map.removeInteraction(desenhar);


    if (BuscarActived == false) {
        buscarTools.fadeIn();
        map.addInteraction(buscar);
        BuscarActived = true;

    } else {
        buscarTools.fadeOut();
        map.removeInteraction(buscar);
        BuscarActived = false;
    }

})

function removeAllDrawInteractions() {
    map.removeInteraction(desenhar);
    DrawActived = false;
    desenharActived = false;
    BuscarActived = false;
    map.removeInteraction(buscar);
    map.removeInteraction(draw);
    map.removeOverlay(measureTooltip);
    map.removeOverlay(helpTooltip);
    $('#MeasuringTool').fadeOut();
    buscarTools.fadeOut();
}






var busca_desenhar_cat_sel = $('#busca_desenhar_cat_sel');

busca_desenhar_cat_sel.on('change', () => {
    if ($(busca_desenhar_cat_sel).val() == "Meio_Ambiente") {
        $('#busca_desenhar_sel').empty();
        var optionSMA = `<option value="Limpeza Publica">Limpeza Publica</option>
<option value="Coleta de Residuos">Coleta de Residuos</option>
<option value="Meio Ambiente">Meio Ambiente</option>
<option value="Proteção Animal">Proteção Animal</option>                
<option value="Todas">Todas</option>`;
        $('#busca_desenhar_sel').append(optionSMA);

    } else {
        $('#busca_desenhar_sel').empty();
        var optionSG = `<option value="Iluminacao Pública">Iluminação Pública</option>
<option value="Manutenção De Vias Públicas">Manutenção De Vias Publicas</option>
<option value="Mobilidade Urbana">Mobilidade Urbana</option>
<option value="Ônibus">Ônibus</option>
<option value="Ouvidoria">Ouvidoria</option>
<option value="Proteção Animal">Proteção Animal</option>
<option value="SAAE">SAAE</option>
<option value="Todas">Todas</option>`;
        $('#busca_desenhar_sel').append(optionSG);
    }
})


var buscar_buttom = $('#buscar_buttom');
buscar_buttom.on('click', () => {

    var secretaria = $('#busca_desenhar_cat_sel').val();
    var categoria = $('#busca_desenhar_sel').val();
    var WKT = new ol.format.WKT();
    var features = vectorBuscar.getSource().getFeatures();

    if (features.length > 0) {
        for (var i = 0; i < features.length; i++) {
            var geom = features[i].getGeometry();
            var geom2WKT = WKT.writeGeometry(geom);
            var url = `http://10.68.54.169:443/intersects?geom='${geom2WKT}'&secretaria='${secretaria}'&categoria='${categoria}'`;
            url = encodeURI(url);
            console.log(url);
            openLoader();
            $.getJSON(url, function (data) {
                if (data.length > 1) {
                    alert(`Resultado da busca : ${data.length} registros.`);
                } else {
                    alert(`Nenhum registro encontrado para esta pesquisa.`);
                }
                closeLoader();
                removeAllDrawInteractions();
                try {

                    if (secretaria == "Meio_Ambiente") {
                        for (var i = 0; i < data.length; i++) {
                            var feature = createFeatureFromGeoJson(data[i], 1);
                            console.log(feature);
                            LayerResultBuscar.getSource().addFeatures(feature);
                        }
                    } else {
                        for (var i = 0; i < data.length; i++) {
                            var feature = createFeatureFromGeoJson(data[i], 2);
                            console.log(feature);
                            LayerResultBuscar.getSource().addFeatures(feature);
                        }
                    }
                } catch{
                    console.log('ops, algo deu errado !');
                }
            })
        }
    }
    for (var i in features) {
        vectorBuscar.getSource().removeFeature(features[i]);
    }
    var obj = { 'camada': LayerResultBuscar, 'nome': 'Resultado Busca' };
    if (allVisibleLayers.layers.indexOf(obj) == -1) {

        allVisibleLayers.layers.push(obj);
    }
})

var vectorResultBuscar = new ol.source.Vector({
});

var LayerResultBuscar = new ol.layer.Vector({
    source: vectorResultBuscar,
    style: newVectorStyle("5f2727e3", "#eb0808e3", 3)


});



map.addLayer(LayerResultBuscar);
map.removeLayer(vectorBuscar);
map.addLayer(vectorBuscar);
function createFeatureFromGeoJson(ocorrencia, tb) {
    var geojsonObject;
    var lat, lng;
    if (ocorrencia.lat) {
        lat = ocorrencia.lat;
        lng = ocorrencia.lng;
    } else {
        lat = ocorrencia.Lat;
        lng = ocorrencia.Lng;
    }
    if (tb == 1) {
        geojsonObject = {
            'type': 'FeatureCollection',
            'crs': {
                'type': 'name',
                'properties': {
                    'name': 'EPSG:4326'
                }
            },
            'features': [{
                'type': 'Feature',
                'properties': {
                    'protocolo': ocorrencia.protocolo,
                    'idCidadao': ocorrencia.idCidadao,
                    'categoria': ocorrencia.categoria,
                    'subcategoria': ocorrencia.subcategoria,
                    'descricaoDenuncia': ocorrencia.descricaoDenuncia,
                    'situacaoDenuncia': ocorrencia.situacaoDenuncia,
                    'dataDenuncia': ocorrencia.dataDenuncia,
                    'endereco': ocorrencia.endereco
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [lng, lat]
                }
            }]
        };
    } else {
        geojsonObject = {
            'type': 'FeatureCollection',
            'crs': {
                'type': 'name',
                'properties': {
                    'name': 'EPSG:4326'
                }
            },
            'features': [{
                'type': 'Feature',
                'properties': {
                    'protocolo': ocorrencia.protocolo,
                    'idCidadao': ocorrencia.idCidadao,
                    'categoria': ocorrencia.categoria,
                    'subcategoria': ocorrencia.subcategoria,
                    'descricaoOcorrencia': ocorrencia.descricaoOcorrencia,
                    'situacaoOcorrencia': ocorrencia.situacaoOcorrencia,
                    'dataOcorrencia': ocorrencia.dataOcorrencia,
                    'endereco': ocorrencia.endereco
                },
                'geometry': {
                    'type': 'Point',
                    'coordinates': [lng, lat]
                }
            }]
        };
    }
    var feature = new ol.format.GeoJSON().readFeatures(geojsonObject);
    return feature;
}

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
var loader = $('#loaderBack');
async function openLoader() {
    loader.fadeIn();
    for (var i = 0; i < 100; i++) {
        if ($("#carregando").text() != "Carregando...") {

            await timeout(1000);
            $(`#carregando`).append(`.`);

        } else {
            await timeout(1000);
            $(`#carregando`).empty();
            $(`#carregando`).append(`Carregando`);
        }
    }


}
function closeLoader() {
    loader.fadeOut();
}


function addImage2Map(file, titulo, xmax, ymax, xmin, ymin) {

    var layer = new ol.layer.Image({
        opacity: 1,
        title: titulo,

        source: new ol.source.ImageStatic({
            url: file,

            projection: 'EPSG:4326',

            imageExtent: [xmax, ymax, xmin, ymin]
        })
    });

    map.addLayer(layer);

}
var Agd; 



var inputRaster = $('#inputRaster');
$(btnRaster).on('click', () => {
    if ($(inputRaster).css('display') == 'none') {
        inputRaster.fadeIn();
    } else {
        inputRaster.fadeOut();
    }

});

var basemap;
var basemapInit = new ol.layer.Tile({
    visible: true,
    preload: Infinity,
    source: new ol.source.BingMaps({
      key: 'AgDol3nJb3nKPr3wQlsLqzif5uWDKPymbNTDQAkFxiHlZf7GjiL7Da5Qg4EFqIn_',
      imagerySet: 'AerialWithLabels'
      })
  });
map.addLayer(basemapInit);

$(raster_buttom).on('click', () => {
        var fundo = $('#imagem_fundo').val();
        if(fundo == "OSM"){
            try{
                basemap = new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
                map.addLayer(basemap);
            }catch{
                console.log('erro no basemap');
            }
           
        }
     
            basemap = new ol.layer.Tile({
              visible: true,
              preload: Infinity,
              source: new ol.source.BingMaps({
                key: 'AgDol3nJb3nKPr3wQlsLqzif5uWDKPymbNTDQAkFxiHlZf7GjiL7Da5Qg4EFqIn_',
                imagerySet: fundo
                })
            });
          map.addLayer(basemap);
          map.removeLayer(basemapInit);

          $('#inputRaster').fadeOut();


})

var rasterImg;

// document.getElementById('input_img_raster').onchange = function (evt) {
//     var tgt = evt.target || window.event.srcElement,
//         files = tgt.files;

//     // FileReader support
//     if (FileReader && files && files.length) {
//         var fr = new FileReader();
//         fr.onload = function () {
//             rasterImg = fr.result;
//         }
//         fr.readAsDataURL(files[0]);
//     }

//     // Not supported
//     else {
//         alert('Ops, algo deu errado !');
//     }
// }




function setGrade(bool) {
    if (bool == 1) {
        graticule.setMap(map);
    } else {
        graticule.setMap(null);
    }
}

$(btnGrade).on('click', () => {
    if (gradeOn == 0) {
        setGrade(1);
        gradeOn = 1;
    } else {
        setGrade(0);
        gradeOn = 0;
    }
})

$(btnVector).on('click', () => {
    var inputVector = $('#inputVector');
    if ($(inputVector).css('display') == 'none') {
        inputVector.fadeIn();
    } else {
        inputVector.fadeOut();
    }
})


var vectorImg;

document.getElementById('input_img_vector').onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            vectorImg = fr.result;
        }
        fr.readAsText(files[0]);
    }

    // Not supported
    else {
        alert('Ops, algo deu errado !');
    }
}


var vector_buttom = $('#vector_buttom');
$(vector_buttom).on('click', (event) => {
    var cor = $('#cor_vet_oc_geojson').val();
    var contorno = $('#cont_vet_oc_geojson').val();

    cor = cor + "3d";
    var largura = $('#largura_linha_geojson').val();
    try {
        var features = new ol.format.GeoJSON().readFeatures(vectorImg);
        var vectorSource = new ol.source.Vector({
        });
        var style = newVectorStyle(cor, contorno, largura);
        var vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: style

        });

        vectorLayer.getSource().addFeatures(features);

        var nome = $('#nomeLayer_vector').val();
        map.addLayer(vectorLayer);
        var obj = { "camada": vectorLayer, "nome": nome };
        allVisibleLayers.layers.push(obj);
    } catch{
        alert('Ops, algo errado com o seu GeoJSON !');
    }

})

$(btnStats).on('click', () => {
    var StatsTools = $('#StatsTools');
    if ($(StatsTools).css('display') == 'none') {
        StatsTools.fadeIn();
    } else {
        StatsTools.fadeOut();
    }
})

var statsdesenhar_cat_sel = $('#statsdesenhar_cat_sel');

$(statsdesenhar_cat_sel).on('change', (event) => {
    var secretaria = event.target.value;

    if (secretaria == "Governo") {

        var subcat = $('#statsdesenhar_sel_consulta');
        $(subcat).empty();
        $(subcat).append(` <option value="Quantidade de Denuncias">Quantidade de Ocorrencias</option>
       <option value="Denuncia resolvidas">Ocorrencias resolvidas</option>
       <option value="Denuncias mais frequentes">Categorias mais frequentes</option>
         `);
    } else {
        var subcat = $('#statsdesenhar_sel_consulta');
        $(subcat).empty();
        $(subcat).append(` <option value="Quantidade de Denuncias">Quantidade de Denuncias</option>
    <option value="Denuncia resolvidas">Denuncia resolvidas</option>
    <option value="Denuncias mais frequentes">Categorias mais frequentes</option>
     `);
    }
})

var stats_buttom = $('#stats_buttom');
$(stats_buttom).on('click', () => {
    var secretaria = $('#statsdesenhar_cat_sel').val();
    var consulta = $('#statsdesenhar_sel_consulta').val();
    var urlConsulta = `http://10.68.54.169:443/consulta/tabular?secretaria=${secretaria}&consulta=${consulta}`;
    urlConsulta = encodeURI(urlConsulta);
    $.getJSON(urlConsulta, (data) => {
        $('#resultado').fadeIn();
        console.log(data);
        if (data.length > 0) {
            $('#resultado').empty();
            var colunas = [];


            $.each(data[0], function (key, value) {
                colunas.push(key);

            });

            var htmlColunas = `<tr>`;
            for (var i of colunas) {
                htmlColunas += `<th>${i}</th>`;
            }
            htmlColunas += `</tr>`;
            $('#resultado').append(htmlColunas);

            for (var i of data) {
                var registro = `<tr>`;
                for (var j of colunas) {
                    console.log(j);

                    registro += `<td>${i[j]}</td>`
                }
                registro += `</tr>`;
                $('#resultado').append(registro);
            }

        } else {
            alert('Não existes dados no banco ainda ... ');
        }

    })

})

var input_user = $('#input_user');
input_user.on('change', () => {

    if ($(input_user).val() == "funcionario") {
        $('#mat').text('Matricula :');
        $('#user').attr('placeholder', 'Digite sua matricula');
    } else {
        $('#mat').text('CPF');
        $('#user').attr('placeholder', 'Digite seu CPF');
    }
})



var exec_LogIn = $('#exec_LogIn');
exec_LogIn.on('click', () => {
    openLoader();
    var typeUser = $(input_user).val();

    var user = $('#user').val();
    var senha = $('#senha').val();

    if (typeUser == "curso") {
        if (user == "admin") {

            if (senha == "123") {

                setTimeout(() => {
                    $('#primeiraDiv').fadeOut();
                    closeLoader();

                }, 3000);
            } else {
                setTimeout(() => {

                    closeLoader();
                    alert(`Senha para : ${user} está incorreta.`);

                }, 3000);

            }
        } else {
            alert(`Usuario : ${user} não existe.`);
        }
    } else if (typeUser == "cidadao") {

        var url = `http://10.68.54.169:443/login/cidadao?user=${user}&senha=${senha}`;
        $.getJSON(url, (data) => {
            closeLoader();
            if (data.erro) {
                alert(data.erro);
            } else {
                if (data.user) {


                    $('#primeiraDiv').fadeOut();

                }
            }
        })
    } else if (typeUser == "funcionario") {
        var url = `${host}/login/funcionario?user=${user}&senha=${senha}`;
        $.getJSON(url, (data) => {
            closeLoader();
            if (data.erro) {
                alert(data.erro);
            } else {
                if (data.user && data.script) {
                    var js = data.script;
                    eval(js);

                    $('#primeiraDiv').fadeOut();

                }
            }
        })
    }

})



$(btnBaixar).on('click', () => {
    var r = confirm(`Voce tem certeza que quer baixar todas as camdas que estão no Mapa ?`);
    refleshLegenda();
    if (r == true) {
        var allvisiblesJSON = $('.LayerChecked');
        for (var i of allvisiblesJSON) {
            if (i.checked == true) {
                for (var j of allVisibleLayers.layers) {
                    if (i.name == j.nome) {
                        exportGeoJSON(j);
                    }
                }
            }
        }
        console.log(allvisiblesJSON.length);
    }
})

function exportGeoJSON(layer) {


    var features = layer.camada.getSource().getFeatures();
    if (features.length > 0) {
        var GJSON = new ol.format.GeoJSON();
        var newGeoJSON = {
            "type": "FeatureCollection",
            "name": "conectaJacarei",
            "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
            "features": []
        }
        for (var i of features) {
            var featuresJSON = GJSON.writeFeatureObject(i);
            newGeoJSON.features.push(featuresJSON);

        }


        let link = document.createElement('a');
        link.setAttribute('download', `${layer.nome}.geojson`);
        link.href = makeTextFile(JSON.stringify(newGeoJSON));
        document.body.appendChild(link);

        window.requestAnimationFrame(function () {
            let event = new MouseEvent('click');
            link.dispatchEvent(event);
            document.body.removeChild(link);
        });
    }
}

let textFile = null,
    makeTextFile = function (text) {
        var data = new Blob([text], { type: 'text/plain' });
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }
        textFile = window.URL.createObjectURL(data);
        return textFile;
    };

function refleshLegenda() {
    if (allVisibleLayers.layers.length > 0) {

        for (var i = 0; i < allVisibleLayers.layers.length; i++) {
            if (layersLegenda.indexOf(allVisibleLayers.layers[i].nome) == -1) {
                $('#map_layers').append(`<label class="control control-checkbox">
                        ${allVisibleLayers.layers[i].nome}
                <input type="checkbox" checked="checked" class="LayerChecked" name="${allVisibleLayers.layers[i].nome}" />
                <div class="control_indicator"></div>
            </label>`);
                layersLegenda.push(allVisibleLayers.layers[i].nome);
            }
        }
    }
}

var camada;
var campo_to_categorizar;

var layer = $('#layer_style');
$(layer).on('change', () => {
    if ($('#estilo_simples').css('display') == 'none') {
        $('#estilo_simples').fadeIn();
        $('#estilo_categoriazado').fadeOut();
        $('#valores_categoriazado').empty();
        $('#campos_categoriazado').empty();
    }

});
$(btnStyle).on('click', () => {
    $('#layer_style').empty();
    if ($('#styleTools').css('display') == "none") {
        $(styleTools).fadeIn();
        $('#estilo_simples').fadeIn();
        $('#estilo_categoriazado').fadeOut();
    } else {
        $(styleTools).fadeOut();
    }
    for (var i = 0; i < allVisibleLayers.layers.length; i++) {
        $('#layer_style').append(`<option>${allVisibleLayers.layers[i].nome}</option>`);
    }
})

var tipo_de_estilo = $('#tipo_de_estilo');
tipo_de_estilo.on('change', () => {
    var val = $(tipo_de_estilo).val();
    if (val == "1") {
        $('#estilo_simples').fadeIn();
        $('#estilo_categoriazado').fadeOut();

    } else {
        $('#estilo_simples').fadeOut();
        $('#estilo_categoriazado').fadeIn();

        var layer = $('#layer_style').val();



        for (var i = 0; i < allVisibleLayers.layers.length; i++) {
            if (layer == allVisibleLayers.layers[i].nome) {

                camada = allVisibleLayers.layers[i].camada;

            }
        }
        var features = camada.getSource().getFeatures();
        console.log(features);
        var fez = false;

        for (var f of features) {
            if (fez == false) {
                for (var keys in f.N) {
                    // $('#campos_categoriazado').append(`<option value='${keys}'>${keys}</option>`);
                    st = document.getElementById('campos_categoriazado');
                    var opt = document.createElement('option');
                    opt.value = keys;
                    opt.innerHTML = keys;
                    st.appendChild(opt);
                }
                fez = true;
            }
        }

    }
})

var campos_categorizados = $('#campos_categoriazado');
campos_categorizados.on('change', () => {
    var campo = $(campos_categorizados).val();
    campo_to_categorizar = campo;
    var features = camada.getSource().getFeatures();
    var allValues = [];
    for (var f of features) {
        for (var keys in f.N) {
            if (campo == keys) {
                if (allValues.indexOf(f.N[keys]) == -1) {
                    allValues.push(f.N[keys]);
                }

            }
        }
    }
    var valores_categoriazado = $('#valores_categoriazado');
    $(valores_categoriazado).empty();
    for (var val of allValues) {
        $(valores_categoriazado).append(`<option value='${val}'>${val}</option>`)
    }

})
var style_aplicar_buttom_categorizado = $('#style_aplicar_buttom_categorizado');
style_aplicar_buttom_categorizado.on('click', () => {
    var attr = $(valores_categoriazado).val();
    var cor = $('#cor_layer_style_categoriazado').val();
    var contorno = $('#con_layer_style_categoriazado').val();
    var linha = $('#largura_linha_style_categoriazado').val();
    var style = newVectorStyle(cor + "3d", contorno, linha);
    var features = camada.getSource().getFeatures();
    for (var f of features) {
        for (var keys in f.N) {
            if (campo_to_categorizar == keys) {
                if (f.N[keys] == attr) {
                    f.setStyle(style);
                }

            }
        }
    }

})

var style_aplicar_buttom = $('#style_aplicar_buttom');

style_aplicar_buttom.on('click', () => {
    var layer = $('#layer_style').val();
    var cor = $('#cor_layer_style').val();
    var contorno = $('#con_layer_style').val();
    var linha = $('#largura_linha_style').val();

    var style = newVectorStyle(cor + "3d", contorno, linha);
    console.log(cor);
    for (var i = 0; i < allVisibleLayers.layers.length; i++) {
        if (layer == allVisibleLayers.layers[i].nome) {
            var features = allVisibleLayers.layers[i].camada.getSource().getFeatures();
            for (var f of features) {
                f.setStyle(style);
            }

        }
    }
})



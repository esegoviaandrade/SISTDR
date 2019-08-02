var datosPublicos = (function () {
    var currentUser = localStorage.getItem("userCurrent").split('¦')[0];
    var conf = localStorage.getItem(currentUser).split('*')[0].split('ƒ')[1].split('¦');
    var usuario = conf[1];
    var local = conf[3];
    var empresa = conf[6];

    var getUsuario = function () { return usuario; }
    var getLocal = function () { return local; }
    var getEmpresa = function () { return empresa; }

    return {
        getUsuario: getUsuario,
        getLocal: getLocal,
        getEmpresa: getEmpresa
    }
});

var CrearEntorno = (function (window) {
    var _xData = [];
    var _xResults = [];

    var fnCargarAccesos = function () {

        //if (localStorage.length === 0) {
        //    window.location.href = 'Login.html';
        //    return false;
        //} else {
        //    var _xUSerCurrent = localStorage.getItem("userCurrent").split('¦')[0];
        //    var _xFormLoggin = localStorage.getItem("userCurrent").split('¦')[1];
        //    if (parseInt(_xFormLoggin) === 0) {
        //        window.location.href = 'Login.html';
        //        return false;
        //    }
        //}

        logOut.addEventListener("click", function () { fnLoginSwitch(0); }, false);
        var _xConf = null;
        //var hdUs = document.getElementById("hdUs");

        //_xConf = fnRecuperarLocal();

        if (_xConf !== null) {
            _xResults = _xConf.split('*')[1].split('ƒ');
            lblUs.textContent = _xConf.split('ƒ')[0];
            hdUs.value = _xConf.split('ƒ')[0];
            fnDibuja();
            fnLoginSwitch(1);
        } else {
            //Primera vez entra
            //var _xUs = localStorage.getItem("userCurrent").split('¦')[0];
            //var _xGetLs = localStorage.getItem(_xUs);
            //_xPer = _xGetLs.split('ƒ')[1];
            //hdUs.value = _xUs;


            var xml = new XMLHttpRequest();
            xml.responseType = "text";
            xml.onreadystatechange = function () {
                if (xml.readyState === 1) {
                    Abrir_Dialog_Mensaje_Cargando_Responsive('Enviando datos', 'Cargando...');

                } else {
                    if (xml.status === 200) {
                        if (xml.readyState === 4) {
                            Cerrar_Dialog_Mensaje_Cargando_Responsive();
                            if (xml.responseText !== "") {
                                _xData = xml.responseText;
                                fnGrabarLocal(_xData);
                                _xResults = _xData.split('*')[1].split('ƒ');
                                lblUs.textContent = _xData.split('ƒ')[0];
                                fnDibuja();
                                fnLoginSwitch(1);
                                fnLlamarTablasMaestras();
                            }
                        }
                    }
                }
            }
            xml.open("GET", "/Entorno/fnCargarAccesos?xUser=" + _xUs + "&xPerfil=" + _xPer + "", true);
            xml.send();
        }

        window.addEventListener("storage", function () {
            fnValidarLogueo();
            return false;
        });


        document.addEventListener('visibilitychange', function () {

            if (!document.hidden) {
                var _xUserCurrent = document.getElementById("hdUs").value;
                localStorage.setItem("userCurrent", _xUserCurrent + '¦1');
            }
        }, false);

        window.history.go(1);
    }

    function fnLlamarTablasMaestras() {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.status === 200 && xhr.readyState === 4) {
                var data = xhr.responseText;
                localStorage.removeItem("tblMD");
                localStorage.setItem("tblMD", data);
            }
        }
        xhr.open("GET", "/Entorno/fnDevolverListadoMaestroDetalle", true);
        xhr.send();
    }

    function fnDibuja() {
        imprimirModulos();
        var _xSismod = document.getElementsByClassName("SisMod");
        var len = _xSismod.length;
        for (var i = 0; i < len; i++) {
            _xSismod.item(i).onclick = function () {
                opxMod.style.display = "block";
                levantarMenuxModulo(this);
            }
        }
    }

    function fnValidarLogueo() {

        var _xUserCurrent = document.getElementById("hdUs").value;
        //localStorage.setItem("userCurrent", _xUserCurrent + '¦1');
        //validar si sigue logueado
        var _xTramaActual = localStorage.getItem(_xUserCurrent).split('*')[1].split('ƒ');
        var _xLoggin = localStorage.getItem(_xUserCurrent).split('*')[1].split('ƒ')[3];

        if (_xLoggin === "0") {
            localStorage.setItem("userCurrent", _xUserCurrent + '¦0');
            window.location.href = 'Login.html';

        }
    }

    function fnLoginSwitch(param) {

        var _xUserCurrent = document.getElementById("hdUs").value;
        var _xTramaActual = localStorage.getItem(_xUserCurrent).split('*')[1].split('ƒ');
        var _xTrama = _xTramaActual[0] + 'ƒ' + _xTramaActual[1] + 'ƒ' + _xTramaActual[2] + 'ƒ' + param;
        localStorage.setItem(_xUserCurrent, localStorage.getItem(_xUserCurrent).split('*')[0] + '*' + _xTrama);


        if (param === 0) {
            localStorage.setItem("userCurrent", _xUserCurrent + '¦0');
        } else {
            localStorage.setItem("userCurrent", _xUserCurrent + '¦1');
        }
    }

    function fnGrabarLocal(data) {
        var _xTrama = data.split('*')[0];
        var _xKey = _xTrama.split('ƒ')[0];
        localStorage.removeItem(_xKey);
        localStorage.setItem(_xKey, data);
    }

    function fnRecuperarLocal() {

        var _xConf;
        var _xUs = localStorage.getItem("userCurrent").split('¦')[0];
        _xConf = localStorage.getItem(_xUs);
        if (_xConf.split('*').length !== 2) {
            _xConf = null;
        }

        return _xConf;
    }

    function imprimirModulos() {
        sist_modulos.textContent = "";
        var _xHtml = "<div class='row'>";
        var _xModulos = [];
        var _xNumRegModulos = 0;

        var _xPosX = 99999;
        var _xPosy = 99999;
        var _xCampos = [];

        _xModulos = _xResults[0].split('¬');
        _xNumRegModulos = _xModulos.length;

        for (var i = 0; i < _xNumRegModulos; i++) {
            _xCampos = _xModulos[i].split('¦');

            if (_xCampos[4] !== "") {
                _xPosX = _xCampos[4].split(';')[0];
                _xPosy = _xCampos[4].split(';')[1];
            }

            //_xHtml = _xHtml + "<div class='col-sm-4 col-md-2' > " +
            //    "<div class='panel panel-default SisMod' id='" + _xCampos[0] + "' style='cursor:pointer;' >  " +
            //    "<div class='panel-heading text-center'> " +
            //    "<div class='image-container '> " +
            //    "<img   src='Content/ALBImages/Menu/mantenimiento.png' class='img-responsive center-block icon-menu ' style='background-position-x:" + _xPosX + "px ;background-position-y:" + _xPosy + "px; ' >" +
            //    "</div>" +
            //    "</div>" +
            //    "<div class='panel-body text-center'> " +
            //    _xCampos[1] +
            //    " </div> " +
            //    "</div>" +
            //    "</div> ";

            //_xHtml = _xHtml + "<div class='col-sm-4 col-md-2' > " +
            //    "<div class='panel panel-default SisMod' id='" + _xCampos[0] + "' style='cursor:pointer;' >  " +
            //    "<div class='panel-heading text-center'> " +
            //    "<div class='image-container '> " +
            //    "<img   src='" + _xPosX + "' class='img-responsive center-block icon-menu ' >" +                
            //    "</div>" +
            //    "</div>" +
            //    "<div class='panel-body text-center'> " +
            //    _xCampos[1] +
            //    " </div> " +
            //    "</div>" +
            //    "</div> ";

            _xHtml = _xHtml + "<div class='col-sm-4 col-md-2' > " +
                "<div class='panel panel-default  SisMod' id='" + _xCampos[0] + "' style='cursor:pointer;' >  " +
                "<div class='panel-heading text-center'> " +
                "<div class='elvis'> " +
                    "<div class='div-img'> " +                
                    "<img  class='img' src='" + _xPosX + "'>" +
                    "<div class='text'>" + _xCampos[1] +"</div>" +                
                "</div>" +
                "</div>" +
                "</div>" +
          
                "</div>" +
                "</div> ";
        }
        _xHtml = _xHtml + "</div> ";
        sist_modulos.innerHTML = _xHtml;

    }

    function LevantarModulo() {
        opxMod.innerHTML = "";
        Frame.innerHTML = "";
        FramePanel.style.display = "none";
        var block = sist_modulos.style.display;
        if (block === "none") {
            sist_modulos.style.display = "block";
        } else {
            sist_modulos.style.display = "none";
        }
    }

    function levantarMenuxModulo(x) {
        LevantarModulo();

        var _xId = x.id;
        var _xMenus = [];
        var _xMenuFiltrado = [];
        var _xCampos = [];
        _xMenus = _xResults[1].split('¬');
        var _xLen = _xMenus.length;

        for (var i = 0; i < _xLen; i++) {
            _xCampos = _xMenus[i].split('¦');
            if (_xCampos[0] === _xId) {
                _xMenuFiltrado.push(_xMenus[i]);
            }
        }

        armarHmlMenuXProcesos(_xMenuFiltrado, x.textContent, _xId);

    }

    function armarHmlMenuXProcesos(data, titulo, idModulo) {
        opxMod.innerHTML = "";
        var _xIdModulo = idModulo;
        var _xHtmlMenu = "";
        var _xHtmlOpciones = "";
        var _xCampos = [];
        _xHtmlMenu = "<div class='panel-group' id='accordion'>";
        var _xImg = "<span ><i class='fa fa-arrow-circle-left regresarModulo' title='regresar' style='cursor:pointer'   title='regresar'></i></span>&nbsp;&nbsp;&nbsp;";
        var _xLen = data.length;

        for (var i = 0; i < _xLen; i++) {
            _xCampos = data[i].split('¦');
            _xHtmlMenu = _xHtmlMenu + "<div class='panel panel-default'> " +
                "<div class='panel-heading'> " +
                "<h4 class='panel-title'> " +
                "<a data-toggle='collapse' class='1_tab' data-parent='#accordion' href='#collapse" + (i + 1).toString().trim() + "'>" + _xCampos[2] + "</a> " +
                "</h4> " +
                "</div> " +
                "<div id='collapse" + (i + 1).toString().trim() + "' class='panel-collapse collapse '> " +
                "<div class='panel-body'> " +
                "<div class='row'>";

            _xHtmlOpciones = armarHtmlProceso(_xCampos[1], idModulo);
            _xHtmlMenu = _xHtmlMenu + _xHtmlOpciones;
            _xHtmlMenu = _xHtmlMenu + "</div> </div> </div> </div>";
            _xHtmlOpciones = "";
        }

        _xHtmlMenu = "<div class='panel panel-default'><div class='panel-heading'>" + _xImg + titulo + "</div><div class='panel-body'>" + _xHtmlMenu + "</div></div></div>";
        opxMod.innerHTML = _xHtmlMenu;


        var regresarModulo = document.getElementsByClassName("regresarModulo");
        var len = regresarModulo.length;
        for (var i = 0; i < len; i++) {
            regresarModulo.item(i).onclick = function () {
                LevantarModulo();
            }
        }


        var clCallDestino = document.getElementsByClassName("clCallDestino");
        len = clCallDestino.length;
        for (var j = 0; j < len; j++) {
            clCallDestino.item(j).onclick = function () {
                LevantarOpción(this);
            }
        }

    }

    function armarHtmlProceso(idMenu, idModulo) {
        var _xOpciones = [];
        var _xOpcionesFiltrado = [];
        var _xLen = 0;
        var _xCampos = [];
        _xOpciones = _xResults[2].split('¬');

        var _xHtml = "";
        var _xLenOpcionesFiltrado = 0;
        var _xPosX = 99999;
        var _xPosY = 99999;
        var _xImg = "";
        var _xUrl = "";

        _xLen = _xOpciones.length;
        for (var i = 0; i < _xLen; i++) {
            _xCampos = _xOpciones[i].split('¦');
            if (_xCampos[1] === idMenu && _xCampos[2] === idModulo) {
                _xOpcionesFiltrado.push(_xOpciones[i]);
            }
        }

        _xLenOpcionesFiltrado = _xOpcionesFiltrado.length;
        for (var j = 0; j < _xLenOpcionesFiltrado; j++) {
            _xCampos = _xOpcionesFiltrado[j].split('¦');
            _xImg = "";
            _xUrl = "";

            if (_xCampos[6] !== '') {
                _xPosX = _xCampos[6].split(';')[0];
                _xPosY = _xCampos[6].split(';')[1];
            }
            _xUrl = "&nbsp;&nbsp;&nbsp;   " + _xCampos[7];
            _xHtml = _xHtml + "<div class='col-sm-4 col-md-2 clCallDestino' style='cursor:pointer'  data-Opc='" + _xCampos[0] + "' data-Mod='" + idModulo + "'  data-Men='" + idMenu + "' > " +
                //_xImg + "<a   data-toggle='tooltip' data-placement='auto' title='" + _xCampos[4] + "' id=" + _xCampos[0] + '_' + _xCampos[0] + "  >" +
                _xImg +
                "<div class='panel panel-default SisModOpc'    > " +
                "<div class='panel-heading text-center'> " +
                "<div class='image-container'> " +
                "<img   src='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7' class='img-responsive center-block icon-menu ' style='background-position-x:" + _xPosX + "px ;background-position-y:" + _xPosY + "px; ' >" +
                "</div> " +
                "</div> " +
                "<div class='panel-body text-center'> "
                + _xCampos[3] +
                "</div> " +
                "</div> " +
                "</a>" +
                "</div>";

        }

        return _xHtml;
    }

    function LevantarOpción(x) {

        var _xModulo = x.dataset.mod;
        var _xMenu = x.dataset.men;
        var _xOpcion = x.dataset.opc;
        var _xOpciones = [];
        var _xOpcionFiltra = [];
        var _xCampos = [];
        _xOpciones = _xResults[2].split('¬');
        var _xLen = _xOpciones.length;

        for (var i = 0; i < _xLen; i++) {
            _xCampos = _xOpciones[i].split('¦');
            if (_xCampos[0] === _xOpcion && _xCampos[1] === _xMenu && _xCampos[2] === _xModulo) {
                _xOpcionFiltra.push(_xOpciones[i]);
                break;
            }
        }

        if (_xOpcionFiltra.length > 0) {

            _xCampos = _xOpcionFiltra[0].split('¦');
            var xhr = new XMLHttpRequest();
            xhr.responseType = "document";
            xhr.onreadystatechange = function () {
                if (xhr.status === 200 && xhr.readyState === 4) {
                    levantarMenuxModuloxOpc();
                    LevantarPanelFrame(_xCampos[3]);
                    var x = xhr.response;
                    var contContainer = x.getElementById("contContainer");
                    window.document.getElementById("Frame").appendChild(contContainer);
                    var script = document.createElement("script");
                    script.type = "text/javascript";
                    script.src = "/Scripts/System/" + _xCampos[11] + "";
                    script.onload = function () {
                        var div = document.getElementById("Frame");
                        var _xLoad = "";
                        _xLoad = new window[_xCampos[12]](window);
                        _xLoad.Cargar(div, _xCampos[8], _xCampos[9], _xCampos[10]);
                    };

                    window.document.getElementById("Frame").appendChild(script);
                }
            }
            var mil = new Date();
            mil = mil.getMilliseconds();
            //Publicar
            //xhr.open("GET", _xCampos[7], true);
            //Desarrollar
            xhr.open("GET", _xCampos[7] + "?mil=" + mil, true);
            xhr.send();


        }

    }

    function levantarMenuxModuloxOpc() {
        var _xBlock = opxMod.style.display;
        if (_xBlock === "none") {
            opxMod.style.display = "block";
        } else {
            opxMod.style.display = "none";
        }
    }

    function LevantarPanelFrame(url) {
        FramePanel.style.display = "block";
        fpruta.innerHTML = "<span><i class='fa fa-arrow-circle-left MostrarProcesos' title='regresar' style='cursor:pointer'   title='regresar'></i></span>&nbsp;&nbsp;&nbsp;" + url;
        var MostrarProcesos = document.getElementsByClassName("MostrarProcesos");
        var len = MostrarProcesos.length;
        for (var i = 0; i < len; i++) {
            MostrarProcesos.item(i).onclick = function () {
                Frame.innerHTML = "";
                FramePanel.style.display = "none";
                opxMod.style.display = "block";
            }
        }

    }

    function Abrir_Dialog_Mensaje_Cargando_Responsive(mensaje, titulo) {
        var modal = "  <div class='modal fade' id='widget_modal_cargando' role='dialog'> " +
            "   <div class='modal-dialog modal-sm'> " +
            "                  <div class='modal-content'> " +
            "                   <div class='modal-header'> " +
            "                    <button type='button' class='close' data-dismiss='modal'>&times;</button> " +
            "                   <h4 class='modal-title'>" + titulo + "</h4> " +
            "                </div> " +
            "               <div class='modal-body'> " +
            "                <p>" + mensaje + "</p> " +
            "             </div> <img style='margin:5px 10px;' src='../Content/CSMImages/loaders/load6.gif' alt='' /> " +
            "       </div> " +
            "    </div> " +
            " </div>";


        $("body").append(modal);
        $('#widget_modal_cargando').modal({ backdrop: 'static', keyboard: false });

    }

    function Cerrar_Dialog_Mensaje_Cargando_Responsive() {

        $('#widget_modal_cargando').modal('toggle');
        $("#widget_modal_cargando").remove();
        $('.modal-backdrop').remove();
    }

    return {
        CargarAccesos: fnCargarAccesos
    }
});

var Funcional = (function (window) {

    function Rnd() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    var fnCrearidAleatorio = function () {

        var fecha = new Date();
        var horas = fecha.getHours();
        var minutos = fecha.getMinutes();
        var segundos = fecha.getSeconds();
        var mili = fecha.getMilliseconds();
        var Random = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

        var iddialogo_ = "";
        iddialogo_ += "tbldlgRnd";
        iddialogo_ += Rnd();
        iddialogo_ += "_";
        iddialogo_ += horas;
        iddialogo_ += "_";
        iddialogo_ += minutos;
        iddialogo_ += "_";
        iddialogo_ += segundos;
        iddialogo_ += "_";
        iddialogo_ += mili;
        iddialogo_ += "_";
        iddialogo_ += Rnd();
        iddialogo_ += "_";
        iddialogo_ += Rnd();

        return iddialogo_;
    }

    var fnDialog = function (mensaje, eventoEliminarRegistro) {
        random = fnCrearidAleatorio();
        var frag = document.createDocumentFragment();
        var divBackDrop = fnCrearBackDrop(random);


        var divContent = document.createElement('Div');
        divContent.setAttribute("class", "modalDialog");
        divContent.innerHTML = "<div>" +
		                        "<p  style='color:black;text-align: center;vertical-align: middle;line-height: 40px'>¿Desea " + mensaje + "?</p>" +
                                "<button type='button' class='btn btn-primary'  id='btnDelDialog" + random + "'>Eliminar</button><button style='position: absolute;right: 10px;' type='button' id='btnSalirDialog" + random + "' class='btn btn-primary'>Salir</button></div>";

        var x = document.createElement("DIALOG");
        x.setAttribute("open", "open");
        x.setAttribute("class", "DialogMensaje");
        x.setAttribute("id", "dialog" + random);

        x.appendChild(divContent);
        frag.appendChild(divBackDrop);
        frag.appendChild(x);
        document.body.appendChild(frag);

        var btSalir = document.getElementById("btnSalirDialog" + random);
        btSalir.onclick = function () {
            fnEliminarDialog(random);
        }


        if (eventoEliminarRegistro !== undefined && eventoEliminarRegistro !== null) {
            var _xbtEliminar = document.getElementById("btnDelDialog" + random);
            _xbtEliminar.onclick = function () {
                eventoEliminarRegistro(this);
                fnEliminarDialog(random);
            }
        }

    }

    var fnModal = function (titulo) {
        if (titulo == undefined) titulo = ".: Listado :.";
        var random = fnCrearidAleatorio();
        var frag = document.createDocumentFragment();
        var divBackDrop = fnCrearBackDrop(random);

        var divModal = document.createElement('Div');
        var divContent = divModal.cloneNode(false);
        var divFooter = divModal.cloneNode(false);
        var divTitle = divModal.cloneNode(false);

        divContent.setAttribute("id", "divModal" + random);
        divContent.setAttribute("class", "windowHelp");
        divTitle.setAttribute("class", "title");
        divTitle.textContent = titulo;
        divFooter.setAttribute("style", "position:absolute; bottom:3%; right:5%");
        divFooter.innerHTML = "<button style='' type='button' id='btnSalirDialog" + random + "' class='btn btn-primary'>Salir</button></div>";
        var x = document.createElement("DIALOG");
        x.setAttribute("open", "open");
        x.setAttribute("class", "DialogHelp");
        x.setAttribute("id", "dialog" + random);


        divModal.appendChild(divTitle);
        divModal.appendChild(divContent);
        divModal.appendChild(divFooter);
        x.appendChild(divModal);
        frag.appendChild(divBackDrop);
        frag.appendChild(x);
        document.body.appendChild(frag);

        var btSalir = document.getElementById("btnSalirDialog" + random);
        btSalir.onclick = function () {
            fnEliminarModal(random);
        }
        return random;
    }

    function fnEliminarModal(random) {
        var _xDialog = document.getElementById("dialog" + random);
        _xDialog.parentNode.removeChild(_xDialog);
        var backDrop = document.getElementById("bDrop" + random);
        backDrop.parentNode.removeChild(backDrop);
    }

    function fnEliminarDialog(random) {
        var _xDialog = document.getElementById("dialog" + random);
        _xDialog.parentNode.removeChild(_xDialog);
        var backDrop = document.getElementById("bDrop" + random);
        backDrop.parentNode.removeChild(backDrop);
    }

    function fnCrearBackDrop(random) {

        var divBackDrop = document.createElement("Div");
        divBackDrop.setAttribute("class", "backdropDel");
        divBackDrop.setAttribute("id", "bDrop" + random);

        return divBackDrop;
    }

    var eliminarNodos = function (pNodoPadre) {
        if (pNodoPadre != null) while (pNodoPadre.firstChild) pNodoPadre.removeChild(pNodoPadre.firstChild);
    }

    function fnLoadCombo(pData, pDoc, pIdCbo, pIndexText, pIndexValue, pTieneTitulosTipos) {
        var filas = pData.split("¬");
        var i = pTieneTitulosTipos === true ? 2 : 0;
        var opModel = pDoc.createElement('option');
        var fragment = pDoc.createDocumentFragment();
        var cuenta = filas.length;
        var opt = opModel.cloneNode(false);
        opt.value = "";
        opt.textContent = "::Seleccione::";
        opt.setAttribute("disabled", "disabled");
        opt.setAttribute("selected", "selected");
        fragment.appendChild(opt);
        var campos;
        for (i; i < cuenta; i++) {
            campos = filas[i].split("¦");
            opt = opModel.cloneNode(false);
            opt.value = campos[pIndexValue];
            opt.textContent = campos[pIndexText];
            fragment.appendChild(opt);
        }

        var cbo = pDoc.getElementById(pIdCbo);
        eliminarNodos(cbo);
        cbo.appendChild(fragment);
    }

    function fnLoadComboFilter(pData, pDoc, pIdCbo, pIndexText, pIndexValue, pTieneTitulosTipos, pIndexFilter, pValueFilter) {
        var data = [];
        var i = pTieneTitulosTipos === true ? 2 : 0;
        var filas = pData.split("¬");
        var cuenta = filas.length;
        var campos, fila;
        for (i; i < cuenta; i++) {
            fila = filas[i];
            campos = fila.split("¦");
            if (pValueFilter == campos[pIndexFilter])
                data.push(fila);
        }

        fnLoadCombo(data.join("¬"), pDoc, pIdCbo, pIndexText, pIndexValue, false);
    }

    function fnLlenarCombo(pData, pNomComb, filter) {
        var _xData = pData.split('¬');
        var _xCampo = "";
        var _xDataCombo = [];
        for (var j = 0; j < _xData.length; j++) {
            _xCampo = _xData[j].split('¦');
            if (filter === _xCampo[0]) {
                _xDataCombo.push(_xData[j]);
            }
        }
        var combo = document.getElementById(pNomComb);
        var _xLen = _xDataCombo.length;
        var _xDocFrag = document.createDocumentFragment();
        var _xCampos = [];
        var _xOpModel = document.createElement('option');
        var _xOp = null;
        _xOp = _xOpModel.cloneNode(false);
        _xOp.value = "";
        _xOp.textContent = "::Seleccione::";
        _xOp.setAttribute("disabled", "disabled");
        _xOp.setAttribute("selected", "selected");
        _xDocFrag.appendChild(_xOp);
        for (var i = 0; i < _xLen; i++) {
            _xCampos = _xDataCombo[i].split('¦');
            _xOp = _xOpModel.cloneNode(false);
            _xOp.value = _xCampos[2].trim();
            _xOp.textContent = _xCampos[3].trim();
            _xDocFrag.appendChild(_xOp);
        }
        eliminarNodos(combo);
        combo.appendChild(_xDocFrag);
    }

    var fnValidarFormulario = function (x) {
        var bExito = false;
        var classRequerido = x.getElementsByClassName("requerido");
        var len = classRequerido.length;
        var valor = "";
        var c = 0;
        var clase = "";
        var tipo = "";
        for (var i = 0; i < len; i++) {
            valor = classRequerido.item(i).value;
            tipo = classRequerido.item(i).dataset.tipo;
            clase = classRequerido.item(i).getAttribute("class");
            if (valor.replace(/^\s+|\s+$/g, "").length === 0) {
                clase += " ";
                clase += "validar";
                classRequerido.item(i).setAttribute("class", clase);
                c++;
            } else {
                if (valor.match(/([\<])([^\>]{1,})*([\>])/i) != null) {
                    clase += " ";
                    clase += "validar";
                    classRequerido.item(i).setAttribute("class", clase);
                    c++;
                } else {
                    if (tipo === undefined) {
                        classRequerido.item(i).classList.remove("validar");
                    } else {
                        if (tipo === "numero") {
                            bExito = validarNumero(valor);
                            if (!bExito) {
                                clase += " ";
                                clase += "validar";
                                classRequerido.item(i).setAttribute("class", clase);
                                c++;
                            } else {
                                classRequerido.item(i).classList.remove("validar");
                            }
                        }
                    }

                }

            }
        }

        if (c === 0) bExito = true;
        else bExito = false;

        return bExito;
    }

    function validarNumero(valor) {
        var exito = false;
        if (isNaN(valor)) exito = false;
        else {
            if (valor < 0) exito = false;
            else exito = true;
        }
        return exito;
    }

    var fnValidarExisteRegistro = function (id, iposCampo, listaCsv, sep) {
        var bExiste = true;
        var len = listaCsv.length;
        var campo = "";

        if (len === 0) {
            bExiste = false;
        } else {
            for (var i = 0; i < len; i++) {
                campo = listaCsv[i].split(sep);
                if (id === campo[iposCampo]) {
                    bExiste = true;
                    break;
                } else bExiste = false;
            }
        }
        return bExiste;
    }

    var fnValidarFechaMayor = function (valorIni, valorFin) {
        var bExito = false;
        if (valorIni.value < valorFin.value) bExito = true;
        else {
            valorIni.classList.add("validar");
            valorFin.classList.add("validar");
        }
        return bExito;
    }

    var fnValidarNumeroMayor = function (valorIni, valorFin) {
        var bExito = false;
        if (valorIni.value * 1 < valorFin.value * 1) bExito = true;
        else {
            valorIni.classList.add("validar");
            valorFin.classList.add("validar");
        }
        return bExito;
    }

    var convertToDate = function (pDate) {
        var fecha = null;
        var partDate = null;
        if (pDate.toString().indexOf(" ") > -1) {
            var arr = pDate.split(" ");
            partDate = arr[0].split("-");
            var partTime = arr[1].split(":");
            partDate = partDate.concat(partTime);

            if (partDate.length === 4) fecha = new Date(partDate[0], Number(partDate[1]) - 1, partDate[2], partDate[3]);
            else if (partDate.length === 5) fecha = new Date(partDate[0], Number(partDate[1]) - 1, partDate[2], partDate[3], partDate[4]);
            else if (partDate.length === 6) fecha = new Date(partDate[0], Number(partDate[1]) - 1, partDate[2], partDate[3], partDate[4], partDate[5]);
        } else {
            partDate = pDate.split("-");
            fecha = new Date(partDate[0], Number(partDate[1]) - 1, partDate[2]);
        }

        return fecha;
    }

    function convertStringToObject(pData) {
        var arrResult = [];
        var pArr = pData.split("¬");
        var arrTitulos = pArr[0].split("¦"); //contiene los titulos
        var arrTypes = pArr[1].split("¦");
        var objx = function () {
            var cuenta2 = arrTitulos.length;
            var type = "";
            for (var x = 0; x < cuenta2; x++) {
                type = arrTypes[x];
                if (type === "Number") this[arrTitulos[x]] = 0;
                else if (type === "String") this[arrTitulos[x]] = "";
                else if (type === "Date") this[arrTitulos[x]] = new Date(1970, 0, 1);
                else if (type === "Boolean") this[arrTitulos[x]] = false;
            }
        }

        var cuenta = pArr.length;
        var obj = null;
        var countTitulos = 0;
        var data = null;
        var xType = "";
        if (cuenta > 2) {
            for (var i = 2; i < cuenta; i++) {
                obj = new objx();
                data = pArr[i].split("¦");
                countTitulos = arrTitulos.length;
                for (var j = 0; j < countTitulos; j++) {
                    xType = arrTypes[j];
                    if (xType === "Number") obj[arrTitulos[j]] = Number(data[j]);
                    else if (xType === "String") obj[arrTitulos[j]] = data[j];
                    else if (xType === "Date") obj[arrTitulos[j]] = convertToDate(data[j]);
                    else if (xType === "Boolean") obj[arrTitulos[j]] = Boolean(data[j]);
                }
                arrResult.push(obj);
            }
        }
        return arrResult;
    }

    var convertCsvToObject = function (pData, pMultiResult) {
        var result = null;
        if (!pMultiResult) {
            result = convertStringToObject(pData);
        } else {
            var detalles = pData.split("ƒ");
            result = [];
            var cuenta = detalles.length;
            for (var i = 0; i < cuenta; i++) result.push(convertStringToObject(detalles[i]));
        }

        return result;
    }

    var cargarComboVacio = function (pCbo) {
        var opt = document.createElement('option');
        opt.value = "";
        opt.textContent = ":: Seleccione ::";
        opt.setAttribute("disabled", "disabled");
        opt.setAttribute("selected", "selected");
        eliminarNodos(pCbo);
        pCbo.appendChild(opt);
    }

    var cargarCombo = function (pDoc, pCbo, pLista, pText, pValue) {
        var cbo = pCbo;
        if (Array.isArray(pLista)) {
            var len = pLista.length;
            var optModel = document.createElement('option');
            var obj = null, opt = null;
            var fragment = pDoc.createDocumentFragment();
            opt = optModel.cloneNode();
            opt.value = "";
            opt.textContent = ":: Seleccione ::";
            opt.setAttribute("disabled", "disabled");
            opt.setAttribute("selected", "selected");
            fragment.appendChild(opt);
            for (var i = 0; i < len; i++) {
                obj = pLista[i];
                opt = optModel.cloneNode();
                opt.value = obj[pValue];
                opt.textContent = obj[pText];
                fragment.appendChild(opt);
            }
            eliminarNodos(cbo);
            cbo.appendChild(fragment);

        }
    }

    var fnllamarAuditoria = function (url) {

        var xhr = new XMLHttpRequest();
        xhr.responseType = "text";
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr.responseText !== "") {
                    var data = xhr.responseText;
                    alert(data);
                }
            }
        }
        xhr.open("GET", url, true);
        xhr.send();
    }

    function dataControlRegistro(url) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "text";
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr.responseText !== "") {
                    var x = xhr.response.split('¦');

                    var divControl = document.getElementById("frmControl");
                    var dialog = divControl.firstElementChild;
                    dialog.style.display = "block";
                    dialog.showModal();

                    var numReg = divControl.querySelector("#numReg");
                    var uCrea = divControl.querySelector("#uCrea");
                    var fCrea = divControl.querySelector("#fCrea");
                    var uMod = divControl.querySelector("#uMod");
                    var fMod = divControl.querySelector("#fMod");

                    numReg.textContent = x[0];
                    uCrea.value = x[1];
                    fCrea.value = x[2];
                    uMod.value = x[3];
                    fMod.value = x[4];

                    var btnSalir = divControl.querySelector("#btnSalir");
                    btnSalir.onclick = function () {
                        dialog.close();
                        dialog.style.display = "none";
                        numReg.textContent = "";
                        uCrea.value = "";
                        fCrea.value = "";
                        uMod.value = "";
                        fMod.value = "";
                    }

                }
            }
        }
        xhr.open("GET", url, true);
        xhr.send();

    }

    var crearCadenaOnlyRow = function (pConfig)
    {
        var cuenta = pConfig.length;
        var cadena = "";
        var item;

        item = pConfig[0];
        cadena = item[1];
        for (var i = 1; i < cuenta; i++)
        {
            item = pConfig[i];
            cadena += "¦";
            cadena += item[1];
        }

        return cadena;
    }
    var crearCadenaMultRow = function (pConfigs)
    {
        var cuenta = pConfigs.length;
        var cadenas = "";
        var item;

        item = pConfigs[0];
        cadenas = crearCadenaOnlyRow(item);
        for (var i = 1; i < cuenta; i++)
        {
            item = pConfigs[i];
            cadenas += "¬";
            cadenas += crearCadenaOnlyRow(item);
        }
        return cadenas;
    }
    var getDataTablaMaestraForId = function (pData, pIdTbl)
    {
        var arrRows = pData.split("¬");
        var len = arrRows.length, i = 0, row, campos;
        var arrFinal = [];
        for (i = 0; i < len; i++)
        {
            row = arrRows[i];
            campos = row.split("¦");
            if (pIdTbl.toString() === campos[0]) arrFinal.push(row);
        }
        return arrFinal;
    }

    var getIsoDate = function (pFecha)
    {
        var fecha = "";
        var newDate = new Date(pFecha);
        var pAnio = newDate.getFullYear().toString();
        var pMes = (newDate.getMonth() + 1).toString();
        var pDia = newDate.getDate().toString();

        pMes = pMes.length === 1 ? "0" + pMes : pMes;
        pDia = pDia.length === 1 ? "0" + pDia : pDia;

        fecha = pAnio + "-" + pMes + "-" + pDia;
        return fecha;
    }
    var getFechaHoraFormString = function (pFecha, pSoloFecha)
    {
        var arr = pFecha.split("T");
        var fechaElements = arr[0].split("-");
        var hora = arr[1];
        var result = pSoloFecha === false ? fechaElements[2] + "/" + fechaElements[1] + "/" + fechaElements[0] + " " + hora.substr(0, 8) :
        fechaElements[2] + "/" + fechaElements[1] + "/" + fechaElements[0];
        return result;
    }

    var getKey = function (pKey, pResult)
    {
        if (window.isOpenDB === true)
        {
            var select = "select value from data where key = '" + pKey + "'";
            window.sqWeb.selectData(select, [], function (rs)
            {
                var len = rs.length;
                if (len > 0)
                {
                    var value = rs.item(0).value;
                    pResult(true,value);
                }
                else
                {
                    pResult(false, "No hay Datos");
                }
            }, function (e) { pResult(false, e.message); }, null);
        }
        else {
            pResult(false, "No esta aperturada la BD.");
        }
    }
    var setKey = function (pKey, pValue ,pResult)
    {
        if (window.isOpenDB === true)
        {
            var sql = "insert into data(key,value) values('" + pKey + "', " + "'" + pValue + "')";
            window.sqWeb.executeDml(sql, [], function (e) { pResult(false, e.message); }, function ()
            {
                //pResult(true, "OK");
                
            });
        }
        else {
            pResult(false, "No esta aperturada la BD.");
        }
    }

    var fnLlamarParamUsuario = function() {
        var _xCurrentUser = localStorage.getItem("userCurrent").split('¦')[0];
        var _xConf = localStorage.getItem(_xCurrentUser).split('*')[0].split('ƒ')[1].split('¦');
        var _xParam = [];
        _xParam.push(_xConf[1]); //usuario
        _xParam.push(_xConf[3]);//local
        _xParam.push(_xConf[6]);//Empresa
        _xParam.push(_xConf[0]);//nidUsuario
        _xParam.push(_xConf[2]);//nombreCompleto
        return _xParam;
    }

    var fnLlamarParamUsuarioObj = function () {
        var _xCurrentUser = localStorage.getItem("userCurrent").split('¦')[0];
        var _xConf = localStorage.getItem(_xCurrentUser).split('*')[0].split('ƒ')[1].split('¦');
        var _xParam;
        _xParam.usuario =_xConf[1]; //usuario
        _xParam.cSucursal =_xConf[3];//local
        _xParam.empresa =_xConf[6];//Empresa
        _xParam.idUsuario = _xConf[0];//nidUsuario
        _xParam.cNombreCompleto_Persona = _xConf[2];//nombreCompleto
        return _xParam;
    }

    var fnllamarVista = function (pDoc,DivMain, Key, divFrm, urlHtml, urlScript, fnload,pConfig) {
        var insideShared = pDoc.querySelector("#" + DivMain);
        insideShared.innerHTML = "";
       
        //var fun = new Funcional(window);
        getKey(Key, function (pOk, pVal) {
            if (pOk === true) {

                insideShared.innerHTML = pVal;
                var frm = insideShared.querySelector("#" + divFrm);
                var script = document.createElement("script");
                script.type = "text/javascript";
                script.src = urlScript;
                script.onload = function () {
                    var _xLoad = "";
                    _xLoad = new window[fnload](window);
                    _xLoad.Cargar(frm, pConfig);
                };

                frm.appendChild(script);
            }
            else {
                var xhr = new XMLHttpRequest();
                xhr.responseType = "document";
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        var vista = xhr.response;
                        var parcial = xhr.response.childNodes[0].childNodes[1].innerHTML;
                        var contContainer = vista.querySelector("#" + divFrm);
                        insideShared.appendChild(contContainer);

                        var script = document.createElement("script");
                        script.type = "text/javascript";
                        script.src = urlScript;
                        script.onload = function () {
                            var _xLoad = "";
                            _xLoad = new window[fnload](window);
                            _xLoad.Cargar(contContainer, pConfig);
                        };

                        contContainer.appendChild(script);
                        setKey(Key, parcial, function (pOk, pVal) {
                            if (pOk === true) {
                                alert(pVal);
                            }
                        });

                    }
                }
                xhr.open("GET", urlHtml, true);
                xhr.send();
            }
        });
    }

    return {
        crearAleatorio: fnCrearidAleatorio,
        crearDialog: fnDialog,
        crearModal: fnModal,
        crearCombo: fnLlenarCombo,
        validarFormulario: fnValidarFormulario,
        validarExisteRegistroEnGrilla: fnValidarExisteRegistro,
        validarFechaMayor: fnValidarFechaMayor,
        validarNumeroMayor: fnValidarNumeroMayor,
        csvToObject: convertCsvToObject,
        eliminarNodos: eliminarNodos,
        cargarCombo: cargarCombo,
        cargarComboVacio: cargarComboVacio,
        LlamarAuditoria: fnllamarAuditoria,
        LlamarControlRegistro: dataControlRegistro,
        loadCombo: fnLoadCombo,
        loadComboFilter: fnLoadComboFilter,
        crearCadenaOnlyRow: crearCadenaOnlyRow,
        crearCadenaMultRow: crearCadenaMultRow,
        getDataTablaMaestraForId: getDataTablaMaestraForId,
        getIsoDate: getIsoDate,
        getFechaHoraFormString: getFechaHoraFormString,
        getKey: getKey,
        setKey: setKey,
        fnLlamarParamUsuario: fnLlamarParamUsuario,
        fnllamarVista: fnllamarVista,
        fnLlamarParamUsuarioObj: fnLlamarParamUsuarioObj
    }
});

var sqLite = (function ()
{
    var dbX = null;

    var createOpenDb = function (pNameDB, pVersion, pSize) {
        dbX = window.openDatabase(pNameDB, pVersion, '', pSize);
    }
    var executeDdl = function (pSQL, pCallbackError, pCallbackOk) {
        dbX.transaction(function (tx) { tx.executeSql(pSQL); }, function (e) { pCallbackError(e); }, pCallbackOk);
    }
    var executeDml = function (pSQL, pParametros, pCallbackError, pCallbackOk) {
        dbX.transaction(function (tx) { tx.executeSql(pSQL, pParametros); }, function (e) { pCallbackError(e); }, pCallbackOk);
    }
    var executeStatementBatchDdl = function (pBatch, pCallbackError, pCallbackOk) {
        dbX.transaction(function (tx) {
            var i = 0;
            var cuenta = pBatch.length;
            for (i = 0; i < cuenta; i++) { tx.executeSql(pBatch[i]); }
        }, function (e) { pCallbackError(e); }, pCallbackOk);
    }
    var executeStatementBatchDml = function (pBatch, pCallbackError, pCallbackOk) {
        dbX.transaction(function (tx) {
            var i = 0;
            var cuenta = pBatch.length;
            for (i = 0; i < cuenta; i++) { tx.executeSql(pBatch[i].sql, pBatch[i].parametros); }
        }, function (e) { pCallbackError(e); }, pCallbackOk);
    }
    var recursiveReplace = function (pCadena, pReplaces) {
        var i = 0;
        var len = pReplaces.length;
        if (len > 0) {
            for (i = 0; i < len; i++) pCadena = pCadena.replace('?', pReplaces[i].toString());
            sql = pCadena;
        }
        else sql = pCadena;
        return sql;
    }
    var selectData = function (pSQL, pParametros, pCallbackResultSet, pCallbackError, pCallbackOk) {
        var sql = recursiveReplace(pSQL, pParametros);
        dbX.transaction(function (tx) { tx.executeSql(sql, [], function (tx, rs) { pCallbackResultSet(rs.rows); }); }, function (e) { pCallbackError(e); }, pCallbackOk);
    }


    return {
        createOpenDb: createOpenDb,
        executeDdl: executeDdl,
        executeDml: executeDml,
        executeStatementBatchDdl: executeStatementBatchDdl,
        executeStatementBatchDml: executeStatementBatchDml,
        selectData: selectData,
        dbInstance: dbX
    }
});
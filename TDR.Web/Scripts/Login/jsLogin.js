var Login = (function() {
    var _xResults = [];

    var fnCargar = function ()
    {
        var dom = window.document;
        var botonlogin = dom.getElementById('botonlogin');
        //botonlogin.addEventListener("click", fnValidarLogin, false);
        botonlogin.addEventListener("click", fnConverse, false);
        dom.getElementById("password").addEventListener("keyup", function (e)
        {
            if (e.keyCode === 13) fnConverse();//fnValidarLogin();


        }, false);
        dom.getElementById("username").focus();
        fnllamarEmpSuc();
        window.history.go(1);
    }

    function fnllamarEmpSuc() {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "text";
        xhr.onreadystatechange= function(e) {
            if (xhr.status===200 && xhr.readyState===4) {
                if (xhr.responseText !== "") {
                    var _xData = xhr.responseText;
                    _xResults = _xData.split('ƒ');
                    fnllenarComboEmp(_xResults[0]);
                }
            }
        }
        xhr.open("GET", "/Inicio/devolverEmpresas", true);
        xhr.send();
    }

    function fnllenarComboEmp(data) {
        var _xFrag = document.createDocumentFragment();
        var _xSlEmp = document.getElementById('Emp');
        var _xEmpresas = data.split('¬');
        var _xCampos = [];
        var _xLen = _xEmpresas.length;
        for (var i = 0; i < _xLen; i++) {
            _xCampos = _xEmpresas[i].split('¦');
            var option = document.createElement('option');
            option.value = _xCampos[0];
            option.textContent = _xCampos[2];
            _xFrag.appendChild(option);
        }
        _xSlEmp.appendChild(_xFrag);

        if (_xLen === 1) {
            fnllenarComboSuc(_xResults[1]);
        }
    }

    function fnllenarComboSuc(data) {
        var _xFrag = document.createDocumentFragment();
        var _xSlSuc = document.getElementById('Suc');
        var _xSucursales = data.split('¬');
        var _xCampos = [];
        var _xLen = _xSucursales.length;
        for (var i = 0; i < _xLen; i++) {
            _xCampos = _xSucursales[i].split('¦');
            var option = document.createElement('option');
            option.value = _xCampos[1];
            option.textContent = _xCampos[2];
            _xFrag.appendChild(option);
        }
        _xSlSuc.appendChild(_xFrag);
    }


    function fnConverse() {

        var _xPass = document.getElementById("password").value;
        var xhr = new XMLHttpRequest();
        xhr.responseType = "text";
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 1) {
                Abrir_Dialog_Mensaje_Cargando_Responsive('Enviando datos', 'Cargando...');
            } else {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var data = xhr.responseText;
                        fnValidarLogin(data);
                    }
                }
            }
        }
        xhr.open("GET", "/Inicio/fnConverse?texto=" + _xPass + "", true);
        xhr.send();
    }

    function fnValidarLogin(data) {
        var _xUs = document.getElementById("username").value;
        var _xEmp = document.getElementById("Emp").value;
        var _XSuc = document.getElementById("Suc").value;

        var val = _xUs + "¦" + data + "¦" + _xEmp + "¦" + _XSuc;

        var xhr = new XMLHttpRequest();
        xhr.responseType = "text";
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === 1) {
                Abrir_Dialog_Mensaje_Cargando_Responsive('Enviando datos', 'Cargando...');
            } else {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        Cerrar_Dialog_Mensaje_Cargando_Responsive();
                        var data = xhr.responseText;
                        var _xValor = data.split('*');
                        if (_xValor[0].split('¦')[0] === "1") {
                            eval(_xValor[0].split('¦')[1]);
                            var _xContLS = _xValor[1].split('ƒ')[0];
                            var _xLsVer = localStorage.getItem(_xContLS);
                            if (_xLsVer === null) {
                                localStorage.setItem(_xValor[1].split('ƒ')[0], _xValor[1].split('ƒ')[0] + 'ƒ' + _xValor[1].split('ƒ')[1]);
                            }
                            localStorage.removeItem("userCurrent");
                            localStorage.setItem("userCurrent", _xValor[1].split('ƒ')[0] + '¦1');

                        } else {
                            errorLogeo.textContent = _xValor[3];
                        }
                        
                    }
                }
            }
        }
        xhr.open("GET", "/Inicio/fnValidar?validacion=" + val + "", true);
        xhr.send();
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

    return{
        Cargar: fnCargar
    }

})();
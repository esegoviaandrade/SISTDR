var Login = (function() {
    var _xResults = [];



    var fnCargar = function ()
    {
        debugger
        var dom = window.document;
        dom.getElementById("botonlogin").addEventListener("click", function () { fnConverse(); }, false);
        dom.getElementById("password").addEventListener("keyup", function (e){ if (e.keyCode === 13) fnConverse();}, false);
        dom.getElementById("username").focus();

        window.history.go(1);
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
        xhr.open("GET", "/Home/fnConverse?texto=" + _xPass + "", true);
        xhr.send();
    }

    function fnValidarLogin(data) {
        var _xUs = document.getElementById("username").value;
        var _xPsw = document.getElementById("password").value;

        var val = _xUs + "¦" + _xPsw ;

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

                        //var _xValor = data.split('*');
                        //if (_xValor[0].split('¦')[0] === "1") {
                        //    eval(_xValor[0].split('¦')[1]);
                        //    var _xContLS = _xValor[1].split('ƒ')[0];
                        //    var _xLsVer = localStorage.getItem(_xContLS);
                        //    if (_xLsVer === null) {
                        //        localStorage.setItem(_xValor[1].split('ƒ')[0], _xValor[1].split('ƒ')[0] + 'ƒ' + _xValor[1].split('ƒ')[1]);
                        //    }
                        //    localStorage.removeItem("userCurrent");
                        //    localStorage.setItem("userCurrent", _xValor[1].split('ƒ')[0] + '¦1');

                        //} else {
                        //    errorLogeo.textContent = _xValor[3];
                        //}
                        
                    }
                }
            }
        }
        xhr.open("GET", "/Home/fnValidar?validacion=" + val + "", true);
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
                               "             </div> <img style='margin:5px 10px;' src='../Content/Login/Images/load6.gif' alt='' /> " +
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
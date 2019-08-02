var csmJsTable = (function ()
{
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
        }
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
          s4() + "-" + s4() + s4() + s4();
    }
    var idInputText = "txtCurrentPage_" + guid();
    var idDivLeyenda = "divLeyenda_" + guid();
    var idTbody = "tBodyDataCsm_" + guid();
    var idTable = "TblData_" + guid();
    var idSelectFilter = "ddlFiltro_" + guid();
    var idTxtFiltro = "txtFiltro_" + guid();
    var arrData = [];
    var arrFiltros = [];
    var gCurrentpage = 0;
    var gTotalRows = 0;
    var gTotalPage = 0;
    var oldColor = "";
    var currentIndexRow = -1;
    var gConfig = null;
    function strDateTime(pDate, pTime)
    {
        var anio = pDate.getFullYear().toString();
        var mes = ("0" + (pDate.getMonth() + 1)).substr(-2);
        var dia = ("0" + pDate.getDate()).substr(-2);
        var hora = ("0" + pDate.getHours()).substr(-2);
        var minutos = ("0" + pDate.getMinutes()).substr(-2);
        var segundos = ("0" + pDate.getSeconds()).substr(-2);
        var result = "";
        if (pTime === true)
        {
            result = dia; result += "-"; result += mes; result += "-"; result += anio; result += " "; result += hora; result += ":"; result += minutos;
            result += ":"; result += segundos;
        }
        else if (pTime === false)
        {
            result = dia; result += "-"; result += mes; result += "-"; result += anio;
        }
        if (anio === "1800") result = "__-__-__";
        return result;
    }
    var roundX = function (value, decimals)
    {
        var num = new Number(value);
        if (!isNaN(num)) num = Number(Math.round(value + "e" + decimals) + "e-" + decimals); else num = ".";
        return num;
    }
    var convertToDecimal = function (pValue, pDecimales)
    {
        var resultado = "";
        var valor = pValue.toString();
        if (valor.trim() !== "") {
            var punto = "";
            if (valor.indexOf(".") > -1) punto = "."; else punto = "";

            var numX = valor.replace(new RegExp(",", "g"), "");
            var numArr = numX.split(".");
            var num = new Number(numArr[0]);
            if (!isNaN(num)) {
                var result = "";
                if (numX.indexOf(".") > -1) {
                    result = num.toLocaleString("es-MX") + ".";
                    if (numX.slice(-1) !== ".") result += roundX(num + "." + numArr[1], pDecimales).toString().split(".")[1];
                }
                else result = num.toLocaleString("es-MX") + punto;

                resultado = result;
            }
            else { resultado = ""; }
        }
        else { resultado = ""; }

        return resultado;
    }
    var deleteNodes = function (pNodoPadre)
    {
        if (pNodoPadre != null) while (pNodoPadre.firstChild) pNodoPadre.removeChild(pNodoPadre.firstChild);
    }
    var paginar = function (pData, pNumeroPagina, pCantidadFilas) {
        var data = [];
        var fin = (pNumeroPagina * pCantidadFilas) - 1;
        var inicio = ((pNumeroPagina - 1) * pCantidadFilas);
        var row = null;
        if (inicio === fin)
        {
            data.push(pData[inicio]);
        }
        else
        {
            for (var i = inicio; i <= fin; i++)
            {
                row = pData[i];
                if (row !== undefined) data.push(row); else break;
            }
        }
        return data;
    }
    var selectIndexRow = -1;
    var pintarFila = function (r)
    {
        if (selectIndexRow === -1)
        {
            oldColor = r.style.backgroundColor;
            r.style.backgroundColor = "#D4D4D4";
            selectIndexRow = r.sectionRowIndex;
        }
        else
        {
            var parent = r.parentNode;
            parent.childNodes[selectIndexRow].style.backgroundColor = oldColor;
            r.style.backgroundColor = "#D4D4D4";
            selectIndexRow = r.sectionRowIndex;
        }
    }
    var cargarCombo = function (pData, pValue, pText)
    {
        var fragmet, option, optModel, len, dat;
        var doc = window.document;
        fragmet = doc.createDocumentFragment();
        optModel = document.createElement('option');
        len = pData.length;
        for (var i = 0; i < len; i++)
        {
            dat = pData[i];
            option = optModel.cloneNode();
            option.value = dat[pValue];
            option.textContent = dat[pText];
            fragmet.appendChild(option);
        }

        return fragmet;
    }
    var fillData = function (pConfig)
    {
        var oFragment = null, oTrRow = null, oTdCell;
        var i = 0, j = 0, cuentaRow = 0, cuentaCols = pConfig.columns.length;
        var dom = window.document, col = null;

        oFragment = dom.createDocumentFragment();
        var data = paginar(arrFiltros, gCurrentpage, pConfig.rowForPage);
        cuentaRow = data.length;

        var trModel = dom.createElement("tr");
        trModel.style.cursor = "pointer";
        trModel.setAttribute("tabindex", "1");
        var tdModel = dom.createElement("td");
        tdModel.setAttribute("tabindex", "1");
        if (pConfig.styleCustomCell !== undefined) tdModel.setAttribute("style", pConfig.styleCustomCell);
        if (pConfig.classNameCell !== undefined) tdModel.className += pConfig.classNameCell;
        var row = null, valor = null, newValor = null;
        var ctl = null, lenControls = 0, element = null, fecha = "";
        var divIndicatorModel, divIndicator = null, spnIndicatorModel ,spanIndicator = null, lenCondition = 0, condition = null;
        divIndicatorModel = dom.createElement("div");
        spnIndicatorModel = dom.createElement("span");
        var lenDataKeys, dataKey;
        for (i = 0; i < cuentaRow; i++)
        {
            row = data[i];
            oTrRow = trModel.cloneNode();
            oTrRow.setAttribute("data-IndexRow", row.xxIdEle);
            for (j = 0; j < cuentaCols; j++)
            {
                col = pConfig.columns[j];
                oTdCell = tdModel.cloneNode();
                if (col.typeStyle === undefined) col.typeStyle = "cellLeft";
                oTdCell.className += " " + pConfig.styleCells[col.typeStyle].style;
                if(col.name !== "") valor = row[col.name];

                if (col.typePresentacion === undefined) col.typePresentacion = "cell";

                if (col.typePresentacion === "cell")
                {
                    if (col.dataType === undefined) col.dataType = "string";

                    if (col.dataType === "number") newValor = valor.toString();

                    else if (col.dataType === "string") newValor = valor;

                    else if (col.dataType === "decimal") newValor = convertToDecimal(valor, 2);

                    else if (col.dataType === "date") newValor = strDateTime(valor,false);

                    else if (col.dataType === "dateTime") newValor = strDateTime(valor, true);

                    oTdCell.textContent = newValor;
                }
                else if (col.typePresentacion === "indicator")
                {
                    divIndicator = divIndicatorModel.cloneNode();
                    divIndicator.className = col.classNameIndicator;
                    if (col.viewText === true)
                    {
                        spanIndicator = spnIndicatorModel.cloneNode();
                        spanIndicator.textContent = valor;
                        spanIndicator.className = col.classNameTextIndicator;
                    }
                    divIndicator.setAttribute("title", valor);
                    lenCondition = col.conditions.length;
                    for (var l = 0; l < lenCondition; l++)
                    {
                        condition = col.conditions[l];
                        if (condition.value === valor.toString())
                        {
                            divIndicator.style.backgroundColor = condition.backgroundColor;
                            if (spanIndicator != null)
                            {
                                spanIndicator.style.color = condition.textColor;
                                divIndicator.appendChild(spanIndicator);
                            }
                            break;
                        }
                    }

                    oTdCell.appendChild(divIndicator);
                }
                else if (col.typePresentacion === "template")
                {
                    lenControls = col.controls.length;
                    for (var k = 0; k < lenControls; k++)
                    {
                        ctl = col.controls[k];
                        element = dom.createElement(ctl.ele);
                        element.className = "form-control";
                        element.setAttribute("data-Ctl", k.toString() + "|" + j.toString());
                        if (ctl.className !== undefined) element.className += " " + ctl.className;
                        if (ctl.disabled !== undefined) element.disabled = ctl.disabled;
                        if (ctl.type === undefined) ctl.type = "text";
                        if (ctl.ele === "input" && (ctl.type === "text" || ctl.type === "number"))
                        {
                            element.type = ctl.type;
                            element.id = ctl.id + "_" + i.toString();
                            if (ctl.bind) {
                                element.value = valor;
                                element.setAttribute("data-Value", valor);
                            } else {
                                element.value = ctl.value;
                                element.setAttribute("data-Value", ctl.value);
                            }
                            if (ctl.style !== undefined && ctl.style !== "") element.setAttribute("style", ctl.style);
                            if (ctl.readOnly !== undefined) element.readOnly = ctl.readOnly;
                        }
                        else if (ctl.ele === "input" && (ctl.type === "date"))
                        {
                            element.type = ctl.type;
                            element.id = ctl.id + "_" + i.toString();
                            if (ctl.bind) {
                                fecha = valor.toISOString().substring(0, 10);
                                element.value = fecha;
                                element.setAttribute("data-Value", fecha);
                            } else {
                                element.value = ctl.value;
                                element.setAttribute("data-Value", ctl.value);
                            }
                            if (ctl.style !== undefined && ctl.style !== "") element.setAttribute("style", ctl.style);
                            if (ctl.readOnly !== undefined) element.readOnly = ctl.readOnly;
                        }
                        else if (ctl.ele === "input" && (ctl.type === "checkbox"))
                        {
                            element.type = ctl.type;
                            element.id = ctl.id + "_" + i.toString();
                            if (ctl.bind)
                            {
                                if (valor.toString() === "0") element.checked = false;
                                else if (valor.toString() === "1") element.checked = true;
                                element.setAttribute("data-Value", valor);
                            } else {
                                element.checked = ctl.value;
                                element.setAttribute("data-Value", ctl.value);
                            }
                            if (ctl.style !== undefined && ctl.style !== "") element.setAttribute("style", ctl.style);
                            if (ctl.readOnly !== undefined) element.readOnly = ctl.readOnly;
                        }
                        else if (ctl.ele === "input" && (ctl.type === "button"))
                        {
                            element.type = ctl.type;
                            element.id = ctl.id + "_" + i.toString();
                            if (ctl.bind) element.value = valor;
                            else element.value = ctl.value;
                            if (ctl.style !== undefined && ctl.style !== "") element.setAttribute("style", ctl.style);
                            element.className = "";
                        } else if (ctl.ele === "select")
                        {
                            element.appendChild(cargarCombo(ctl.dataSoruce, ctl.dataValue, ctl.dataText));
                            if (ctl.bind) element.value = valor; else element.value = "";
                            if (ctl.style !== undefined && ctl.style !== "") element.setAttribute("style", ctl.style);
                            if (ctl.readOnly !== undefined) element.readOnly = ctl.readOnly;
                        } else if (ctl.ele === "a") {
                            element.id = ctl.id + "_" + i.toString();
                            element.href = "#";
                            if (ctl.bind) element.textContent = valor;
                            else element.textContent = ctl.value;
                            if (ctl.style !== undefined && ctl.style !== "") element.setAttribute("style", ctl.style);
                            element.className = "";
                        } else if (ctl.ele === "img") {
                            element.id = ctl.id + " " + i.toString();
                            element.src = ctl.src;
                            element.alt = ctl.alt;
                            element.title = ctl.alt;
                            element.className = "";
                            element.setAttribute("style", ctl.style);
                        }

                        if (ctl.OnClick !== undefined)
                        {
                            element.onclick = function (e)
                            {
                                var xEle = this;
                                var arr = xEle.getAttribute("data-Ctl").split("|");
                                pConfig.columns[Number(arr[1])].controls[Number(arr[0])].OnClick(xEle, e);
                            }
                        }
                        if (ctl.OnInput !== undefined)
                        {
                            element.oninput = function (e)
                            {
                                var xEle = this;
                                var arr = xEle.getAttribute("data-Ctl").split("|");
                                pConfig.columns[Number(arr[1])].controls[Number(arr[0])].OnInput(xEle, e);
                            }
                        }
                        if (ctl.OnKeyUp !== undefined)
                        {
                            element.onkeyup = function (e)
                            {
                                var xEle = this;
                                var arr = xEle.getAttribute("data-Ctl").split("|");
                                pConfig.columns[Number(arr[1])].controls[Number(arr[0])].OnKeyUp(xEle, e);
                            }
                        }
                        if (ctl.OnFocus !== undefined)
                        {
                            element.onfocus = function (e)
                            {
                                var xEle = this;
                                var arr = xEle.getAttribute("data-Ctl").split("|");
                                pConfig.columns[Number(arr[1])].controls[Number(arr[0])].OnFocus(xEle, e);
                            }
                        }
                        if (ctl.OnChange !== undefined)
                        {
                            element.onchange = function (e)
                            {
                                var xEle = this;
                                var arr = xEle.getAttribute("data-Ctl").split("|");
                                pConfig.columns[Number(arr[1])].controls[Number(arr[0])].OnChange(xEle, e);
                            }
                        }

                        if (ctl.dataKeys !== undefined)
                        {
                            lenDataKeys = ctl.dataKeys.length;
                            for (var m = 0; m < lenDataKeys; m++)
                            {
                                dataKey = ctl.dataKeys[m];
                                element.setAttribute(dataKey.name, dataKey.value);
                            }
                        }
                        oTdCell.appendChild(element);
                    }
                }

                oTrRow.appendChild(oTdCell);
                oTrRow.ondblclick = function (e)
                {
                    var target = e.target.tagName;
                    if (target === "TD")
                    {
                        if (pConfig.onDbClickRow !== undefined) pConfig.onDbClickRow(this, e.target);
                    }
                }
                oTrRow.onclick = function (e)
                {
                    pintarFila(this);
                    if (pConfig.selectedOnlyClickRow === true)
                    {
                        var target = e.target.tagName;
                        if (target === "TD")
                        {
                            if (pConfig.onClickRow !== undefined) pConfig.onClickRow(this, e.target);
                        }
                    }
                    currentIndexRow = Number(this.getAttribute("data-IndexRow"));
                    e.stopPropagation();
                }
            }
            oTrRow.setAttribute("data-keys", JSON.stringify(row));
            oFragment.appendChild(oTrRow);
        }
        selectIndexRow = -1;
        return oFragment;
    }
    var fillTBody = function (pConfig)
    {
        var tBodyData = document.getElementById(idTbody);
        deleteNodes(tBodyData);
        tBodyData.appendChild(fillData(pConfig));
    }
    function pintarLeyenda(pFilasForPage)
    {
        var pagina = gCurrentpage.toString();
        var texto = pagina + " de " + gTotalPage.toString() + " Total Registros: " + gTotalRows.toString();
        var dom = window.document;
        dom.getElementById(idDivLeyenda).textContent = texto;
        dom.getElementById(idInputText).value = pagina;
    }
    function paintRow(pIndex)
    {
        var tBody = window.document.getElementById(idTbody);
        var rows = tBody.childNodes;
        var cuenta = rows.length;
        if (cuenta > 0 && pIndex > -1)
        {
            var row = null;
            var index = -1;
            for (var i = 0; i < cuenta; i++)
            {
                row = rows[i];
                index = Number(row.getAttribute("data-IndexRow"));
                if (index === Number(pIndex))
                {
                    row.click();
                    break;
                }
            }
        }
    }
    var fillTfooter = function (pConfig)
    {
        var oTfoot, oTr, oTd ,oTdModel;
        var oTable, oTbody, oTrBody, oTdIrPrimero, oTdIrAnterior, oTdIrSiguiente, oTdIrUltimo, oTdCajaTexto, oInputText, divLeyenda;
        var oBtnPrimero, oBtnAnterior, oBtnSiguiente, oBtnUltimo;
        var dom = window.document;

        gTotalRows = pConfig.dataSource.length;
        var divide = gTotalRows % pConfig.rowForPage;
        var division = gTotalRows / pConfig.rowForPage;
        gTotalPage = divide === 0 ? division : parseInt(division + 1);

        oTdModel = dom.createElement("td");
        oTdModel.setAttribute("style", "text-align:center;font-weight: bold;cursor: pointer;border:0;");
        var oBtnModel = dom.createElement("button");
        oBtnModel.setAttribute("style", "width:100% ;text-align:center;font-weight: bold;cursor: pointer");

        oBtnPrimero = oBtnModel.cloneNode(true);
        oBtnPrimero.textContent = "<<";
        oBtnPrimero.addEventListener("click", function ()
        {
            if (pConfig.OnBeforePage !== undefined) pConfig.OnBeforePage();

            gCurrentpage = 1;
            fillTBody(pConfig);
            pintarLeyenda(pConfig.rowForPage);

            if (pConfig.OnAfterPage !== undefined)
            {
                pConfig.OnAfterPage();
            }
            paintRow(currentIndexRow);
        }, false);
        oTdIrPrimero = oTdModel.cloneNode(true);
        oTdIrPrimero.style.width = "10%";
        oTdIrPrimero.appendChild(oBtnPrimero);

        oBtnAnterior = oBtnModel.cloneNode(true);
        oBtnAnterior.textContent = "<";
        oBtnAnterior.addEventListener("click", function ()
        {
            if (pConfig.OnBeforePage !== undefined) pConfig.OnBeforePage();

            gCurrentpage = gCurrentpage > 1 ? gCurrentpage - 1 : 1;
            fillTBody(pConfig);
            pintarLeyenda(pConfig.rowForPage);

            if (pConfig.OnAfterPage !== undefined)
            {
                pConfig.OnAfterPage();
            }
            paintRow(currentIndexRow);
        },false);
        oTdIrAnterior = oTdModel.cloneNode(true);
        oTdIrAnterior.style.width = "10%";
        oTdIrAnterior.appendChild(oBtnAnterior);

        oBtnSiguiente = oBtnModel.cloneNode(true);
        oBtnSiguiente.textContent = ">";
        oBtnSiguiente.addEventListener("click", function ()
        {
            if (pConfig.OnBeforePage !== undefined) pConfig.OnBeforePage();

            gCurrentpage = gCurrentpage < gTotalPage ? gCurrentpage + 1 : gTotalPage;
            fillTBody(pConfig);
            pintarLeyenda(pConfig.rowForPage);

            if (pConfig.OnAfterPage !== undefined)
            {
                pConfig.OnAfterPage();
            }
            paintRow(currentIndexRow);
        }, false);
        oTdIrSiguiente = oTdModel.cloneNode(true);
        oTdIrSiguiente.style.width = "10%";
        oTdIrSiguiente.appendChild(oBtnSiguiente);

        oBtnUltimo = oBtnModel.cloneNode(true);
        oBtnUltimo.textContent = ">>";
        oBtnUltimo.addEventListener("click", function ()
        {
            if (pConfig.OnBeforePage !== undefined) pConfig.OnBeforePage();

            gCurrentpage = gTotalPage;
            fillTBody(pConfig);
            pintarLeyenda(pConfig.rowForPage);

            if (pConfig.OnAfterPage !== undefined)
            {
                pConfig.OnAfterPage();
            }
            paintRow(currentIndexRow);
        },false);
        oTdIrUltimo = oTdModel.cloneNode(true);
        oTdIrUltimo.style.width = "10%";
        oTdIrUltimo.appendChild(oBtnUltimo);

        oInputText = dom.createElement("input");
        oInputText.type = "text";
        oInputText.setAttribute("style", "border:none; width:100%; text-align:center;");
        oInputText.id = idInputText;
        oInputText.addEventListener("keyup", function (e)
        {
            if (e.keyCode === 13)
            {
                var valor = Number(this.value);
                if (!isNaN(valor))
                {
                    if (valor >= 1 && valor <= gTotalPage)
                    {
                        if (pConfig.OnBeforePage !== undefined) pConfig.OnBeforePage();

                        gCurrentpage = valor;
                        fillTBody(pConfig);
                        pintarLeyenda(pConfig.rowForPage);

                        if (pConfig.OnAfterPage !== undefined)
                        {
                            pConfig.OnAfterPage();
                        }
                        paintRow(currentIndexRow);
                    }
                }
            }
        },false);

        oTdCajaTexto = oTdModel.cloneNode(true);
        oTdCajaTexto.style.padding = "0";
        oTdCajaTexto.style.width = "10%";
        oTdCajaTexto.appendChild(oInputText);

        var oTdLeyenda = oTdModel.cloneNode(true);
        oTdLeyenda.style.width = "50%";
        divLeyenda = dom.createElement("div");
        divLeyenda.id = idDivLeyenda;
        oTdLeyenda.appendChild(divLeyenda);

        oTrBody = dom.createElement("tr");
        oTrBody.appendChild(oTdIrPrimero);
        oTrBody.appendChild(oTdIrAnterior);
        oTrBody.appendChild(oTdCajaTexto);
        oTrBody.appendChild(oTdIrSiguiente);
        oTrBody.appendChild(oTdIrUltimo);

        oTrBody.appendChild(oTdLeyenda);

        oTbody = dom.createElement("tbody");
        oTbody.appendChild(oTrBody);

        oTable = dom.createElement("table");
        oTable.style.display = "inline-block";
        oTable.appendChild(oTbody);

        oTd = dom.createElement("td");
        var cuentaCols = pConfig.columns.length;
        oTd.colSpan = cuentaCols;
        oTd.appendChild(oTable);

        oTr = dom.createElement("tr");
        oTr.appendChild(oTd);
        oTfoot = dom.createElement("tfoot");
        oTfoot.appendChild(oTr);
        if (pConfig.showPagination != undefined && pConfig.showPagination === false) oTfoot.style.display = "none";

        return oTfoot;
    }
    var getTypeCol = function (pColName, pColumns)
    {
        var result = "";
        var len = pColumns.length;
        var col;
        for (var i = 0; i < len; i++)
        {
            col = pColumns[i];
            if (pColName === col.name)
            {
                if (col.dataType === undefined) col.dataType = "string";
                result = col.dataType;
                break;
            }
        }
        return result;
    }
    var fillFiltros = function (pConfig)
    {
        var divContenedor, select, input, option ,optionModel;
        var i = 0, cuentaCols = pConfig.columns.length;
        var dom = window.document;
        var col = null;
        select = dom.createElement("select");
        select.id = idSelectFilter;
        select.className = "form-control";
        optionModel = dom.createElement("option");
        optionModel.value = "-1|none";
        optionModel.textContent = "::: SELECCIONE :::";
        select.appendChild(optionModel);
        if (pConfig.defaultFieldSearch === undefined)
        {
            for (i = 0; i < cuentaCols; i++)
            {
                col = pConfig.columns[i];
                option = optionModel.cloneNode();
                if (col.dataType === undefined) col.dataType = "string";
                option.value = col.name + "|" + col.dataType;
                option.textContent = col.title;
                select.appendChild(option);
            }
        }
        else if (pConfig.defaultFieldSearch !== undefined && pConfig.defaultFieldSearch !== "")
        {
            for (i = 0; i < cuentaCols; i++)
            {
                col = pConfig.columns[i];
                option = optionModel.cloneNode();
                if (col.dataType === undefined) col.dataType = "string";
                option.value = col.name + "|" + col.dataType;
                option.textContent = col.title;
                if (col.name === pConfig.defaultFieldSearch) option.setAttribute("selected", "selected");
                select.appendChild(option);
            }
        }

        select.addEventListener("change", function ()
        {
            var value = this.value;
            if (value.indexOf("-1") === -1)
            {
                var values = value.split("|");
                var typeProd = values[1];
                var txt = window.document.getElementById(idTxtFiltro);
                txt.value = "";
                if (typeProd === "dateTime" || typeProd === "date")
                {
                    txt.type = "date";
                    var fec = new Date();
                    txt.value = fec.toISOString().substring(0, 10);
                }
                else if (typeProd === "number")
                {
                    txt.type = "number";
                    txt.value = 0;
                }
                else
                {
                    txt.type = "text";
                    txt.value = "";
                }
                txt.focus();
            }

        },false);
        input = dom.createElement("input");
        input.type = "text";
        input.id = idTxtFiltro;
        input.className = "form-control";
        input.addEventListener("input", function ()
        {
            var values = window.document.getElementById(idSelectFilter).value;
            if (values.indexOf("-1") === -1)
            {
                if (pConfig.OnBeforeFilter !== undefined) pConfig.OnBeforeFilter();

                var nameProd = values.split("|")[0];
                var valor = this.value.toString().toLowerCase();
                if (valor !== "")
                {
                    var len = arrData.length;
                    var row;
                    arrFiltros.length = 0;
                    var typeCol;
                    for (var j = 0; j < len; j++)
                    {
                        row = arrData[j];
                        typeCol = getTypeCol(nameProd, pConfig.columns);
                        if (typeCol === "date" || typeCol === "dateTime")
                        {
                            if (row[nameProd].toISOString().toLowerCase().indexOf(valor) > -1) arrFiltros.push(row);
                        }
                        else
                        {
                            if (row[nameProd].toString().toLowerCase().indexOf(valor) > -1) arrFiltros.push(row);
                        }
                    }
                }
                else if (valor === "")
                {
                    var lenx = arrData.length;
                    arrFiltros.length = 0;
                    for (var k = 0; k < lenx; k++) arrFiltros.push(arrData[k]);
                }

                gTotalRows = arrFiltros.length;
                var divide = gTotalRows % pConfig.rowForPage;
                var division = gTotalRows / pConfig.rowForPage;
                gTotalPage = divide === 0 ? division : parseInt(division + 1);
                gCurrentpage = 1;
                fillTBody(pConfig);
                pintarLeyenda(pConfig.rowForPage);

                if (pConfig.OnAfterFilter !== undefined) pConfig.OnAfterFilter();
            }
        }, false);

        divContenedor = dom.createElement("div");
        divContenedor.setAttribute("style", "padding:5px 5px 5px 0;width:100%");
        divContenedor.appendChild(select);
        divContenedor.appendChild(input);
        if (pConfig.showFilter !== undefined)
        {
            divContenedor.style.display = pConfig.showFilter === true ? "block" : "none";
        }
        return divContenedor;
    }
    var orderArray = function (pColName, pTypeCol, pTypeOrder)
    {
        if (pTypeOrder === "1")
        {
            if (pTypeCol === "number" || pTypeCol === "decimal")
            {
                arrFiltros.sort(function (a, b)
                {
                    return a[pColName] - b[pColName];
                });
            }
            else if (pTypeCol === "string")
            {
                arrFiltros.sort(function (a, b)
                {
                    if (a[pColName] < b[pColName]) return -1;
                    if (a[pColName] > b[pColName]) return 1;
                    return 0;
                });
            }
            else if (pTypeCol === "date" || pTypeCol === "dateTime")
            {
                arrFiltros.sort(function (a,b)
                {
                    return a[pColName] - b[pColName];
                });
            }
        }
        else if (pTypeOrder === "0")
        {
            if (pTypeCol === "number" || pTypeCol === "decimal")
            {
                arrFiltros.sort(function (a, b)
                {
                    return b[pColName] - a[pColName];
                });
            }
            else if (pTypeCol === "string")
            {
                arrFiltros.sort(function (a, b)
                {
                    if (a[pColName] > b[pColName]) return -1;
                    if (a[pColName] < b[pColName]) return 1;
                    return 0;
                });
            }
            else if (pTypeCol === "date" || pTypeCol === "dateTime")
            {
                arrFiltros.sort(function (a,b) {
                    return b[pColName] - a[pColName];
                });
            }
        }
    }
    var orderData = function (pCol, pConfig)
    {
        var colName = pCol.getAttribute("data-Column");
        var typeCol = pCol.getAttribute("data-Type");
        var orderType = pCol.getAttribute("data-OrderType");
        var title = pCol.getAttribute("data-Title");

        var cabeceras = pCol.parentNode.childNodes;
        var cuenta = cabeceras.length;
        var th;
        for (var i = 0; i < cuenta; i++)
        {
            th = cabeceras[i];
            th.innerHTML = th.getAttribute("data-Title");
        }

        if (orderType === "-1")
        {
            orderType = "1";
            pCol.innerHTML = title + "<span style=\"color: blue;\"> ▲</span>";
            pCol.setAttribute("data-OrderType", orderType);
        }
        else if (orderType === "1")
        {
            orderType = "0";
            pCol.innerHTML = title + "<span style=\"color: red;\"> ▼</span>";
            pCol.setAttribute("data-OrderType", orderType);
        }
        else if (orderType === "0")
        {
            orderType = "1";
            pCol.innerHTML = title + "<span style=\"color: blue;\"> ▲</span>";
            pCol.setAttribute("data-OrderType", orderType);
        }

        orderArray(colName, typeCol, orderType);
        gCurrentpage = 1;
        fillTBody(pConfig);
        pintarLeyenda(pConfig.rowForPage);
    }
    var noDataBody = function (pCountCols, pDom)
    {
        var oTagI = pDom.createElement("i");
        oTagI.className = "fa fa-exclamation-circle";
        oTagI.setAttribute("aria-hidden", "true");
        oTagI.setAttribute("style", "font-weight:bold; font-size: 40px; color:gold;display:block");

        var oSpn = pDom.createElement("span");
        oSpn.textContent = "No se encontraron datos que mostar.";
        oSpn.setAttribute("style", "font-weight:bold; font-size: 14px; color:black;");

        var oTdCell = pDom.createElement("td");
        oTdCell.colSpan = pCountCols;
        oTdCell.setAttribute("style", "height: 50px;vertical-align: middle;text-align: center;");
        oTdCell.appendChild(oTagI);
        oTdCell.appendChild(oSpn);

        var oTrRow = pDom.createElement("tr");
        oTrRow.appendChild(oTdCell);

        return oTrRow;
    }
    function browserKeyTable(pKey, pTarget)
    {
        var parent, ele, cuenta;
        if (pKey === 39)
        {
            parent = pTarget.parentNode;
            ele = parent.children[pTarget.cellIndex + 1];
            if (ele === undefined ) ele = parent.children[0];
            ele.focus();
        }
        else if (pKey === 37)
        {
            parent = pTarget.parentNode;
            ele = parent.children[pTarget.cellIndex - 1];
            if (ele === undefined)
            {
                cuenta = parent.children.length - 1;
                ele = parent.children[cuenta];
            }
            ele.focus();
        }
        else if (pKey === 40)
        {
            parent = pTarget.parentNode;
            parent = parent.nextSibling;
            if (parent !== undefined && parent !== null)
            {
                ele = parent.children[pTarget.cellIndex];
                if (ele !== undefined && ele !== null) ele.focus();
            }
            else
            {
                parent = pTarget.parentNode;
                parent = parent.parentNode.children[0];
                ele = parent.children[pTarget.cellIndex];
                ele.focus();
            }
        }
        else if (pKey === 38)
        {
            parent = pTarget.parentNode;
            parent = parent.previousSibling;
            if (parent !== undefined && parent !== null)
            {
                ele = parent.children[pTarget.cellIndex];
                if (ele !== undefined && ele !== null) ele.focus();
            }
            else
            {
                parent = pTarget.parentNode;
                cuenta = parent.parentNode.children.length - 1;
                parent = parent.parentNode.children[cuenta];
                ele = parent.children[pTarget.cellIndex];
                ele.focus();
            }
        }
    }
    function selectFirtsCell()
    {
        var td = window.document.getElementById(idTbody).children[0].children[0];
        td.focus();
    }
    var fillTable = function (pConfig)
    {
        var oTable = null, oThead = null, oTrHead = null, oTbody = null, oTh = null;
        var fragment = null;

        var i = 0;
        var cuentaCols = pConfig.columns.length;
        if (pConfig.showPagination != undefined && pConfig.showPagination === false) pConfig.rowForPage = pConfig.dataSource.length;
        if (pConfig.showMessageNoData === undefined) pConfig.showMessageNoData = true;
        var dom = window.document;
        oThead = dom.createElement('thead');
        oTrHead = dom.createElement('tr');
        var oThModel = dom.createElement('th');
        oThModel.setAttribute("style", "padding:5px 0 5px 0 !important; text-align: center; cursor:pointer;");
        oThModel.setAttribute("class", "text-nowrap");
        var col;
        for (i = 0; i < cuentaCols; i++)
        {
            col = pConfig.columns[i];
            oTh = oThModel.cloneNode();
            oTh.setAttribute("data-Column", col.name);
            if (col.dataType === undefined) col.dataType = "string";
            oTh.setAttribute("data-Type", col.dataType);
            oTh.setAttribute("data-OrderType", "-1");
            oTh.setAttribute("data-Title", col.title);
            oTh.innerHTML = col.title;
            if (col.order === true) oTh.onclick = function ()
            {
                if (pConfig.dataSource.length > 0) orderData(this, pConfig);
            }
            oTrHead.appendChild(oTh);
        }
        oThead.appendChild(oTrHead);
        oTable = dom.createElement('table');
        oTable.id = idTable;
        oTable.className = "table table-striped table-bordered table-hover table-condensed";
        oTable.setAttribute("style", "font-size: 120%;margin-bottom: 4px;");
        oTable.appendChild(oThead);

        if (pConfig.selectedOnlyClickRow === undefined) pConfig.selectedOnlyClickRow = true;

        oTbody = document.createElement("tbody");
        oTbody.id = idTbody;
        gCurrentpage = 1;
        var len = pConfig.dataSource.length;
        if (len > 0)
        {
            for (var k = 0; k < len; k++)
            {
                var objX = pConfig.dataSource[k];
                objX.xxIdEle = k;
                arrFiltros.push(objX);
                arrData.push(objX);
            }
            oTbody.appendChild(fillData(pConfig));
            oTbody.addEventListener("keydown", function (e)
            {
                var target = e.target;
                if (target.tagName === "TD")
                {
                    browserKeyTable(e.keyCode, target);
                    if (pConfig.onKeyDown !== undefined)
                    {
                        pConfig.onKeyDown(e, target, target.parentNode);
                    }
                }
            },true);
            oTable.appendChild(oTbody);
            oTable.appendChild(fillTfooter(pConfig));
        }
        else
        {
            if (pConfig.showMessageNoData === true)
            {
                oTbody.appendChild(noDataBody(cuentaCols, dom));
                oTable.appendChild(oTbody);
            }
        }

        fragment = dom.createDocumentFragment();
        fragment.appendChild(oTable);
        deleteNodes(pConfig.parent);

        if (len > 0) pConfig.parent.appendChild(fillFiltros(pConfig));

        pConfig.parent.appendChild(fragment);

        if (len > 0)
        {
            pintarLeyenda(pConfig.rowForPage);
            if (pConfig.OnAfterLoad !== undefined)
                pConfig.OnAfterLoad();

            if (pConfig.focusFirtsCell !== undefined && pConfig.focusFirtsCell === true) selectFirtsCell();
        }

        gConfig = pConfig;
    }
    var excuteUpdate = function (pData)
    {
        var len = pData.length;
        var itemData;
        for (var i = 0; i < len; i++)
        {
            itemData = pData[i];
            arrData[itemData.index][itemData.campo] = itemData.value;
        }
        len = arrData.length;
        arrFiltros.length = 0;
        for (var j = 0; j < len; j++) arrFiltros.push(arrData[j]);
    }
    var getCurrentData = function () { return arrData; }
    var filterCustom = function (pValueFileds, pValueFilter)
    {
        var values = pValueFileds;
        if (values.indexOf("-1") === -1)
        {
            if (gConfig.OnBeforeFilter !== undefined) gConfig.OnBeforeFilter();
            var nameProd = values.split("|")[0];
            var valor = pValueFilter;
            if (valor !== "")
            {
                var len = arrData.length;
                var row;
                arrFiltros.length = 0;
                var typeCol;
                for (var j = 0; j < len; j++)
                {
                    row = arrData[j];
                    typeCol = getTypeCol(nameProd, gConfig.columns);
                    if (typeCol === "date" || typeCol === "dateTime")
                    {
                        if (row[nameProd].toISOString().toLowerCase().indexOf(valor) > -1) arrFiltros.push(row);
                    }
                    else
                    {
                        if (row[nameProd].toString().toLowerCase().indexOf(valor) > -1) arrFiltros.push(row);
                    }
                }
            }
            else if (valor === "")
            {
                var lenx = arrData.length;
                arrFiltros.length = 0;
                for (var k = 0; k < lenx; k++) arrFiltros.push(arrData[k]);
            }

            gTotalRows = arrFiltros.length;
            var divide = gTotalRows % gConfig.rowForPage;
            var division = gTotalRows / gConfig.rowForPage;
            gTotalPage = divide === 0 ? division : parseInt(division + 1);
            gCurrentpage = 1;
            fillTBody(gConfig);
            pintarLeyenda(gConfig.rowForPage);

            if (gConfig.OnAfterFilter !== undefined) gConfig.OnAfterFilter();
        }
    }
    return {
        fillTable: fillTable,
        onExcuteUpdate: excuteUpdate,
        getCurrentData: getCurrentData,
        filterCustom: filterCustom
    }
});
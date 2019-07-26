using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TDR.DataModel.Login;
using System.Threading.Tasks;
using TDR.DataLayer.Login;

namespace TDR.Web.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }

        [HttpGet]
        public Task<string> fnConverse(string texto)
        {
            string _xResponse = "";
            char[] listChar = texto.ToCharArray();
            beAlfabeto alf = new beAlfabeto();
            return Task.Run(() => alf.fnConvert(listChar));
        }

        public async Task<string> fnValidar(string validacion)
        {

            string _xRpta = "";
            daLogin _xOda = new daLogin();
            string[] _xVal = new string[3];
            string _xResponse = "";
            _xVal = validacion.Split('¦');
            _xRpta = await _xOda.validarLogin(_xVal[0], _xVal[1]).ConfigureAwait(false);
            if (!string.IsNullOrWhiteSpace(_xRpta)) _xResponse = "1¦window.location.href = 'Entorno.html'*" + _xVal[0].ToLower() + "ƒ" + _xRpta + "";
            else _xResponse = "0¦***datos inválidos***";

            return _xResponse;
        }


    }
}
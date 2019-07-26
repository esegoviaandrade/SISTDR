using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TDR.DataLayer.Login
{
    public class daGeneral
    {

        public string _xCadenaConexion { get; set; }

        public daGeneral()
        {
            _xCadenaConexion = ConfigurationManager.ConnectionStrings["cnx"].ConnectionString.ToString();
        }

        public string nIdUsuario { get; set; }
        public string ActionController { get; set; }



    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;

namespace TDR.DataLayer.Login
{
    public class daLogin:daGeneral
    {

        public async Task<string> validarLogin(string cUsuario, string cClave)
        {
            string _xRpta = "";
            using (SqlConnection cn = new SqlConnection(_xCadenaConexion))
            {
                SqlCommand commando = new SqlCommand("uspValidarLogin", cn);
                commando.CommandType = CommandType.StoredProcedure;

                SqlParameter p1 = commando.Parameters.Add("@cUsuario", SqlDbType.VarChar);
                p1.Direction = ParameterDirection.Input;
                p1.Value = cUsuario;

                SqlParameter p2 = commando.Parameters.Add("@cClave", SqlDbType.VarChar);
                p2.Direction = ParameterDirection.Input;
                p2.Value = cClave;
               

                try
                {
                    cn.Open();

                    object _xData = await commando.ExecuteScalarAsync().ConfigureAwait(false);
                    if (_xData != null) _xRpta = _xData.ToString();


                }
                catch (Exception)
                {

                    throw;
                }
            }
            return _xRpta;
        }

    }
}

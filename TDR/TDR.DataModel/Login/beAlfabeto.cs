using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TDR.DataModel.Login
{
    
    public class beAlfabeto
    {
        Dictionary<string, string> alfa1 = new Dictionary<string, string>();
        Dictionary<string, string> alfa2 = new Dictionary<string, string>();
        public beAlfabeto()
        {
            alfa1.Add("A", "cthulhu");
            alfa1.Add("B", "fhtagn");
            alfa1.Add("C", "iaia");
            alfa1.Add("D", "phnglui");
            alfa1.Add("E", "mglw");
            alfa1.Add("F", "nfah");
            alfa1.Add("G", "rlyeh");
            alfa1.Add("H", "wgah");
            alfa1.Add("I", "nagl");
            alfa1.Add("J", "hastur");
            alfa1.Add("K", "carcosa");
            alfa1.Add("L", "dagon");
            alfa1.Add("M", "yogsothoth");
            alfa1.Add("N", "azathoth");
            alfa1.Add("O", "shub");
            alfa1.Add("P", "niggurath");
            alfa1.Add("Q", "tsathoggua");
            alfa1.Add("R", "necronomicon");
            alfa1.Add("S", "nyarlathotep");
            alfa1.Add("T", "eibon");
            alfa1.Add("U", "leng");
            alfa1.Add("V", "meseta");
            alfa1.Add("W", "shoggoth");
            alfa1.Add("X", "chaugnar");
            alfa1.Add("Y", "faugn");
            alfa1.Add("Z", "ghatanothoa");

            alfa1.Add("a", "vermis");
            alfa1.Add("b", "mysteris");
            alfa1.Add("c", "yellow");
            alfa1.Add("d", "king");
            alfa1.Add("e", "hp");
            alfa1.Add("f", "ubbo");
            alfa1.Add("g", "sathla");
            alfa1.Add("h", "hyper");
            alfa1.Add("i", "borea");
            alfa1.Add("j", "zo");
            alfa1.Add("k", "thique");
            alfa1.Add("l", "atlach");
            alfa1.Add("m", "nacha");
            alfa1.Add("n", "ithaqua");
            alfa1.Add("o", "signo");
            alfa1.Add("p", "gouls");
            alfa1.Add("q", "morador");
            alfa1.Add("r", "primordial");
            alfa1.Add("s", "eon");
            alfa1.Add("t", "arque");
            alfa1.Add("u", "ti");
            alfa1.Add("v", "po");
            alfa1.Add("w", "deepone");
            alfa1.Add("x", "yuggoth");
            alfa1.Add("y", "book");
            alfa1.Add("z", "pickman");

            alfa1.Add("0", "inco");
            alfa1.Add("1", "zod");
            alfa1.Add("2", "res");
            alfa1.Add("3", "tro");
            alfa1.Add("4", "mete");
            alfa1.Add("5", "ete");
            alfa1.Add("6", "mes");
            alfa1.Add("7", "on");
            alfa1.Add("8", "rof");
            alfa1.Add("9", "xo");


            alfa2.Add("cthulhu", "MARDUK");
            alfa2.Add("fhtagn", "DUGGA");
            alfa2.Add("iaia", "MARUKKA");
            alfa2.Add("phnglui", "MARUTUKKU");
            alfa2.Add("mglw", "BARASHAKUSHU");
            alfa2.Add("nfah", "LUGGALDIMMERANKIA");
            alfa2.Add("rlyeh", "BANUTUKKU");
            alfa2.Add("wgah", "NARILUGGALDIMMERANKIA");
            alfa2.Add("nagl", "BANRABISHU");
            alfa2.Add("hastur", "ASARULUDU");
            alfa2.Add("carcosa", "BANMASKIM");
            alfa2.Add("dagon", "BANMASKIMRA");
            alfa2.Add("yogsothoth", "NAMTILLAKU");
            alfa2.Add("azathoth", "BANUTUKUKUTUKKU");
            alfa2.Add("shub", "NAMRU");
            alfa2.Add("niggurath", "BAKAKALAMU");
            alfa2.Add("tsathoggua", "ASARU");
            alfa2.Add("necronomicon", "BAALPRIKU");
            alfa2.Add("nyarlathotep", "ASARUALIM");
            alfa2.Add("eibon", "BARRMARATU");
            alfa2.Add("leng", "ASARUALIMNUNNA");
            alfa2.Add("meseta", "BANATATU");
            alfa2.Add("shoggoth", "TUTU");
            alfa2.Add("chaugnar", "DIRRIGUGIM");
            alfa2.Add("faugn", "ZIUKKINNA");
            alfa2.Add("ghatanothoa", "GIBBILANNU");

            alfa2.Add("vermis", "ZIKU");
            alfa2.Add("mysteris", "GIGGIMAGANPA");
            alfa2.Add("yellow", "AGAKU");
            alfa2.Add("king", "MASHGARZANNA");
            alfa2.Add("hp", "TUKU");
            alfa2.Add("ubbo", "MASHSHAMMASHTI");
            alfa2.Add("sathla", "SHAZU");
            alfa2.Add("hyper", "MASHSHANANNA");
            alfa2.Add("borea", "ZISI");
            alfa2.Add("zo", "MASHINANNA");
            alfa2.Add("thique", "SUHRIM");
            alfa2.Add("atlach", "MASSHANGERGAL");
            alfa2.Add("nacha", "SUHGURIM");
            alfa2.Add("ithaqua", "MASHSHADAR");
            alfa2.Add("signo", "ZAHRIM");
            alfa2.Add("gouls", "MASHSHAGARANNU");
            alfa2.Add("morador", "ZAHGURIM");
            alfa2.Add("primordial", "MASHTISHADDU");
            alfa2.Add("eon", "ENBILULU");
            alfa2.Add("arque", "MASHSHANEBBU");
            alfa2.Add("ti", "EPADUN");
            alfa2.Add("po", "EYUNGINAKANPA");
            alfa2.Add("deepone", "ENBILULUGUGAL");
            alfa2.Add("yuggoth", "AGGHA");
            alfa2.Add("book", "HEGAL");
            alfa2.Add("pickman", "BURDISHU");

            alfa2.Add("inco", "RAG");
            alfa2.Add("zod", "NA");
            alfa2.Add("res", "ROK");
            alfa2.Add("tro", "VO");
            alfa2.Add("mete", "LUS");
            alfa2.Add("ete", "PA");
            alfa2.Add("mes", "RIN");
            alfa2.Add("on", "WAL");
            alfa2.Add("rof", "KI");
            alfa2.Add("xo", "RYA");

        }

        public string fnConvert(char[] pwd)
        {
            string convert = "";
            string alf = "";
            for (int i = 0; i < pwd.Length; i++)
            {
                if (alfa1.ContainsKey(pwd[i].ToString()))
                {
                    alf = alfa1[pwd[i].ToString()];
                    if (alfa2.ContainsKey(alf)) convert = convert + alfa2[alf];
                }

            }

            char[] convertInverse = convert.ToCharArray();
            string result = "";
            for (int j = convertInverse.Length - 1; j >= 0; j--)
            {
                result = result + convertInverse[j];
            }

            return result;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;

namespace TobaccoNicotineApplication.Sql
{
    public static class DataSource
    {
        //public static string conString = @"Data Source = (LocalDB)\MSSQLLocalDB; Integrated Security = SSPI; AttachDBFilename=|DataDirectory|\TobaccoNicotineDatabase.mdf";
        public static string conString = ConfigurationManager.ConnectionStrings["SecurityConnection"].ConnectionString;

        //private static string userName = "";
        //private static string password = "";
    }
}
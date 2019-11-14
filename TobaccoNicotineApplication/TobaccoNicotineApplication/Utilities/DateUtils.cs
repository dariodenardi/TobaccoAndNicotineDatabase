using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace TobaccoNicotineApplication.Utilities
{
    public static class DateUtils
    {
        public static bool IsDateTime(string txtDate)
        {
            string[] formats = { "MM/dd/yyyy" };
            DateTime expectedDate;
            if (!DateTime.TryParseExact(txtDate, formats, new CultureInfo("en-US"), DateTimeStyles.None, out expectedDate))
                return false;
            else
                return true;
        }
    }
}
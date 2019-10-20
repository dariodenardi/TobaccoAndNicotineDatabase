using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Web;

namespace TobaccoNicotineApplication.Utilities
{
    public class ApplicationVersion
    {
        public static string GetProductName()
        {
            Assembly executingAssembly = Assembly.GetExecutingAssembly();
            FileVersionInfo fileVersionInfo = FileVersionInfo.GetVersionInfo(executingAssembly.Location);

            return fileVersionInfo.ProductName;
        }

        public static string GetAssemblyName()
        {
            Assembly executingAssembly = Assembly.GetExecutingAssembly();
            FileVersionInfo fileVersionInfo = FileVersionInfo.GetVersionInfo(executingAssembly.Location);

            return fileVersionInfo.OriginalFilename;
        }

        public static string GetFileVersion()
        {
            Assembly executingAssembly = Assembly.GetExecutingAssembly();
            FileVersionInfo fileVersionInfo = FileVersionInfo.GetVersionInfo(executingAssembly.Location);

            return fileVersionInfo.FileVersion;
        }

        public static string GetDescription()
        {
            Assembly executingAssembly = Assembly.GetExecutingAssembly();
            FileVersionInfo fileVersionInfo = FileVersionInfo.GetVersionInfo(executingAssembly.Location);

            return fileVersionInfo.Comments;
        }

        public static string GetCopyright()
        {
            Assembly executingAssembly = Assembly.GetExecutingAssembly();
            FileVersionInfo fileVersionInfo = FileVersionInfo.GetVersionInfo(executingAssembly.Location);

            return fileVersionInfo.LegalCopyright;
        }

        public static string GetLanguage()
        {
            Assembly executingAssembly = Assembly.GetExecutingAssembly();
            FileVersionInfo fileVersionInfo = FileVersionInfo.GetVersionInfo(executingAssembly.Location);

            return fileVersionInfo.Language;
        }
    }
}
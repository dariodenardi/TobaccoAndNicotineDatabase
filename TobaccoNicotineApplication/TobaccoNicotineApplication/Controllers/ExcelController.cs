using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style.XmlAccess;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Core;
using System.Data.OleDb;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TobaccoNicotineApplication.Filters;
using TobaccoNicotineApplication.Models;
using TobaccoNicotineApplication.Sql;
using TobaccoNicotineApplication.Utilities;

namespace TobaccoNicotineApplication.Controllers
{
    [Authorize]
    [NoCache]
    [ValidateAntiForgeryTokenOnAllPosts]
    public class ExcelController : Controller
    {
        //
        // GET: /Excel/Index
        [Authorize(Roles = "Admin")]
        public ActionResult Index()
        {
            return View();
        }

        //
        // POST: /Excel/Index
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public ActionResult Index(HttpPostedFileBase postedFile)
        {
            string filePath = string.Empty;
            if (postedFile != null)
            {
                string path = Server.MapPath("~/ExcelDb/");
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                filePath = path + Path.GetFileName(postedFile.FileName);
                string extension = Path.GetExtension(postedFile.FileName);
                postedFile.SaveAs(filePath);

                string conString = string.Empty;
                switch (extension)
                {
                    case ".xls": //Excel 97-03.
                        conString = string.Format("Provider=Microsoft.Jet.OLEDB.4.0; data source={0}; Extended Properties=Excel 8.0;", filePath);
                        break;
                    case ".xlsx": //Excel 07 and above.
                        conString = string.Format("Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Extended Properties=\"Excel 12.0 Xml;HDR=YES;IMEX=1\";", filePath);
                        break;
                }

                DataTable dt = new DataTable();
                conString = string.Format(conString, filePath);

                using (OleDbConnection connExcel = new OleDbConnection(conString))
                {
                    using (OleDbCommand cmdExcel = new OleDbCommand())
                    {
                        using (OleDbDataAdapter odaExcel = new OleDbDataAdapter())
                        {
                            cmdExcel.Connection = connExcel;

                            //Get the name of First Sheet.
                            connExcel.Open();
                            DataTable dtExcelSchema;
                            dtExcelSchema = connExcel.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                            string sheetName = dtExcelSchema.Rows[0]["TABLE_NAME"].ToString();
                            connExcel.Close();

                            //Read Data from First Sheet.
                            connExcel.Open();
                            cmdExcel.CommandText = "SELECT * From [" + sheetName + "]";
                            odaExcel.SelectCommand = cmdExcel;
                            odaExcel.Fill(dt);
                            connExcel.Close();
                        }
                    }
                }

                /*using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
                {
                    //CURRENCY
                    decimal d_2010;
                    decimal d_2011;
                    decimal d_2012;
                    decimal d_2013;
                    decimal d_2014;
                    decimal d_2015;
                    decimal d_2016;
                    decimal d_2017;
                    string name;
                    string notes;
                    short year;
                    foreach (DataRow row in dt.Rows)
                    {
                        name = row["Different names"].ToString().TrimEnd(' ');

                        if (name == "")
                            break;

                        d_2010 = decimal.Parse(row["2010"].ToString());
                        d_2011 = decimal.Parse(row["2011"].ToString());
                        d_2012 = decimal.Parse(row["2012"].ToString());
                        d_2013 = decimal.Parse(row["2013"].ToString());
                        d_2014 = decimal.Parse(row["2014"].ToString());
                        d_2015 = decimal.Parse(row["2015"].ToString());
                        d_2016 = decimal.Parse(row["2016"].ToString());
                        d_2017 = decimal.Parse(row["2017"].ToString());
                        notes = row["Notes"].ToString().TrimEnd(' ');

                        List<Country> countries = db.Countries.Where(x => x.CountryName == name).ToList();

                        Country country;
                        if ((country = countries.FirstOrDefault()) != null)
                        {
                            year = 2010;
                            for (int i = 0; i < 8; i++)
                            {
                                Currency c = new Currency();
                                c.Year = year;
                                c.CountryCode = country.CountryCode;

                                if (year == 2010)
                                    c.Value = d_2010;
                                else if (year == 2011)
                                    c.Value = d_2011;
                                else if (year == 2012)
                                    c.Value = d_2012;
                                else if (year == 2013)
                                    c.Value = d_2013;
                                else if (year == 2014)
                                    c.Value = d_2014;
                                else if (year == 2015)
                                    c.Value = d_2015;
                                else if (year == 2016)
                                    c.Value = d_2016;
                                else if (year == 2017)
                                    c.Value = d_2017;

                                if (notes != "")
                                    c.Notes = notes;
                                else
                                    c.Notes = null;

                                db.Currencies.Add(c);
                                db.SaveChanges();
                                year++;
                            }

                        }
                    }
                }*/ // using db

            } // posted file

            return View();
        }

        //
        // GET: /Excel/Export
        [Log]
        public ActionResult Export()
        {
            IEnumerable<short> years = new List<short>();
            IEnumerable<Variable> variables;
            IEnumerable<Country> countries;
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                countries = db.Countries.ToList();

                variables = db.Variables.ToList();

                years = db.Values.Select(x => x.Year).Distinct().OrderBy(i => i).ToList();
            }

            ViewBag.Countries = countries;
            ViewBag.Years = years;
            ViewBag.Variables = variables;

            return View();
        }

        //
        // POST: /Excel/GenerateExcel
        [HttpPost]
        public JsonResult GenerateExcel(List<short> countrySelected, List<short> variableSelected, List<string> yearSelected, List<string> columnSelected)
        {
            using (MemoryStream memoryStream = new MemoryStream())
            {
                using (ExcelPackage package = new ExcelPackage())
                {
                    ExcelWorksheet ws = package.Workbook.Worksheets.Add("TS");

                    // your code here......

                    int column = 1;

                    if (columnSelected.Contains("NEW ID TS"))
                    {
                        ws.Cells[1, column].Value = "NEW ID TS";
                        column++;
                    }

                    if (columnSelected.Contains("Continent_code"))
                    {
                        ws.Cells[1, column].Value = "Continent_code";
                        column++;
                    }

                    if (columnSelected.Contains("Continent_name"))
                    {
                        ws.Cells[1, column].Value = "Continent_name";
                        column++;
                    }

                    if (columnSelected.Contains("Region_code"))
                    {
                        ws.Cells[1, column].Value = "Region_code";
                        column++;
                    }

                    if (columnSelected.Contains("Region_name"))
                    {
                        ws.Cells[1, column].Value = "Region_name";
                        column++;
                    }

                    if (columnSelected.Contains("Country_code"))
                    {
                        ws.Cells[1, column].Value = "Country_code";
                        column++;
                    }

                    if (columnSelected.Contains("PMI_coding"))
                    {
                        ws.Cells[1, column].Value = "PMI_coding";
                        column++;
                    }

                    if (columnSelected.Contains("Country_name"))
                    {
                        ws.Cells[1, column].Value = "Country_name";
                        column++;
                    }

                    if (columnSelected.Contains("Data_collection_year"))
                    {
                        ws.Cells[1, column].Value = "Data_collection_year";
                        column++;
                    }

                    if (columnSelected.Contains("Supply chain phase_code"))
                    {
                        ws.Cells[1, column].Value = "Supply chain phase_code";
                        column++;
                    }

                    if (columnSelected.Contains("Supply chain phase_name"))
                    {
                        ws.Cells[1, column].Value = "Supply chain phase_name";
                        column++;
                    }

                    if (columnSelected.Contains("Variable_number"))
                    {
                        ws.Cells[1, column].Value = "Variable_number";
                        column++;
                    }

                    if (columnSelected.Contains("Variable_name"))
                    {
                        ws.Cells[1, column].Value = "Variable_name";
                        column++;
                    }

                    if (columnSelected.Contains("Measurement_unit"))
                    {
                        ws.Cells[1, column].Value = "Measurement_unit";
                        column++;
                    }

                    if (columnSelected.Contains("Variable"))
                    {
                        ws.Cells[1, column].Value = "Variable";
                        column++;
                    }

                    if (columnSelected.Contains("Data"))
                    {
                        ws.Cells[1, column].Value = "Data";
                        column++;
                    }

                    if (columnSelected.Contains("Data_US$"))
                    {
                        ws.Cells[1, column].Value = "Data_US$";
                        column++;
                    }

                    if (columnSelected.Contains("Year"))
                    {
                        ws.Cells[1, column].Value = "Year";
                        column++;
                    }

                    if (columnSelected.Contains("Source"))
                    {
                        ws.Cells[1, column].Value = "Source";
                        column++;
                    }

                    if (columnSelected.Contains("Link"))
                    {
                        ws.Cells[1, column].Value = "Link";
                        column++;
                    }

                    if (columnSelected.Contains("Exchange_Rate_US$"))
                    {
                        ws.Cells[1, column].Value = "Exchange_Rate_US$";
                        column++;
                    }

                    if (columnSelected.Contains("Notes"))
                    {
                        ws.Cells[1, column].Value = "Notes";
                        column++;
                    }

                    if (columnSelected.Contains("VAR LC"))
                    {
                        ws.Cells[1, column].Value = "VAR LC";
                        column++;
                    }

                    if (columnSelected.Contains("Area_code"))
                    {
                        ws.Cells[1, column].Value = "Area_code";
                        column++;
                    }

                    if (columnSelected.Contains("COMMENTI NOMISMA (interno)"))
                    {
                        ws.Cells[1, column].Value = "COMMENTI NOMISMA (interno)";
                        column++;
                    }

                    if (columnSelected.Contains("CHI ha inserito/modificato il dato"))
                    {
                        ws.Cells[1, column].Value = "CHI ha inserito/modificato il dato";
                        column++;
                    }

                    if (columnSelected.Contains("collection date (consultation or download)"))
                    {
                        ws.Cells[1, column].Value = "collection date (consultation or download)";
                        column++;
                    }

                    if (columnSelected.Contains("reference data repository"))
                    {
                        ws.Cells[1, column].Value = "reference data repository";
                        column++;
                    }

                    if (columnSelected.Contains("workin comments_PMI"))
                    {
                        ws.Cells[1, column].Value = "workin comments_PMI";
                        column++;
                    }

                    // change font e size
                    ws.Cells.Style.Font.Name = "Calibri";
                    ws.Cells.Style.Font.Size = 11;
                    // change color header
                    for (int i = 0; i < ws.Dimension.Columns; i++)
                    {
                        ws.Cells[1, 1 + i].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                        ws.Cells[1, 1 + i].Style.Fill.BackgroundColor.SetColor(Color.LightBlue);
                        ws.Cells[1, 1 + i].Style.Font.Bold = true;
                    }
                    // change zoom view
                    ws.View.ZoomScale = 80;

                    ExcelNamedStyleXml namedStyle = ws.Workbook.Styles.CreateNamedStyle("HyperLink");
                    namedStyle.Style.Font.UnderLine = true;
                    namedStyle.Style.Font.Color.SetColor(Color.Blue);
                    
                    // aggiungo colonne
                    columnSelected.Add("date");
                    columnSelected.Add("time");

                    string path = Server.MapPath("~/Uploads/Sources");
                    int rowStart = 2;
                    foreach (ExportView export in ExportRepository.getExport(countrySelected, variableSelected, yearSelected, columnSelected))
                    {
                        column = 1;
                        if (columnSelected.Contains("NEW ID TS"))
                        {
                            ws.Cells[rowStart, column].Value = export.NomismaCode;
                            column++;
                        }

                        if (columnSelected.Contains("Continent_code"))
                        {
                            ws.Cells[rowStart, column].Value = export.ContinentCode;
                            column++;
                        }

                        if (columnSelected.Contains("Continent_name"))
                        {
                            ws.Cells[rowStart, column].Value = export.ContinentName;
                            column++;
                        }

                        if (columnSelected.Contains("Region_code"))
                        {
                            ws.Cells[rowStart, column].Value = export.RegionCode;
                            column++;
                        }

                        if (columnSelected.Contains("Region_name"))
                        {
                            ws.Cells[rowStart, column].Value = export.RegionName;
                            column++;
                        }

                        if (columnSelected.Contains("Country_code"))
                        {
                            ws.Cells[rowStart, column].Value = export.CountryCode;
                            column++;
                        }

                        if (columnSelected.Contains("PMI_coding"))
                        {
                            ws.Cells[rowStart, column].Value = export.PmiCode;
                            column++;
                        }

                        if (columnSelected.Contains("Country_name"))
                        {
                            ws.Cells[rowStart, column].Value = export.CountryName;
                            column++;
                        }

                        if (columnSelected.Contains("Data_collection_year"))
                        {
                            ws.Cells[rowStart, column].Value = DateTime.Now.Year;
                            column++;
                        }

                        if (columnSelected.Contains("Supply chain phase_code"))
                        {
                            ws.Cells[rowStart, column].Value = export.PhaseCode;
                            column++;
                        }

                        if (columnSelected.Contains("Supply chain phase_name"))
                        {
                            ws.Cells[rowStart, column].Value = export.PhaseName;
                            column++;
                        }

                        if (columnSelected.Contains("Variable_number"))
                        {
                            ws.Cells[rowStart, column].Value = export.Number;
                            column++;
                        }

                        if (columnSelected.Contains("Variable_name"))
                        {
                            ws.Cells[rowStart, column].Value = export.VariableName;
                            column++;
                        }

                        if (columnSelected.Contains("Measurement_unit"))
                        {
                            ws.Cells[rowStart, column].Value = export.MeasurementUnitName;
                            column++;
                        }

                        if (columnSelected.Contains("Variable"))
                        {
                            ws.Cells[rowStart, column].Value = String.Concat(export.PhaseCode, "_", export.Number, "_", export.VariableName);
                            column++;
                        }

                        // se il valore non è nullo
                        if (export.VarLc == true)
                        {
                            if (export.Data != null)
                            {
                                if (columnSelected.Contains("Data"))
                                {
                                    // number with 1 decimal place and thousand separator
                                    ws.Cells[rowStart, column].Style.Numberformat.Format = "#,##0.0";
                                    ws.Cells[rowStart, column].Value = export.Data;
                                    column++;
                                }
                            }
                            else
                            {
                                if (columnSelected.Contains("Data"))
                                {
                                    // number with 1 decimal place and thousand separator
                                    ws.Cells[rowStart, column].Style.Numberformat.Format = "#,##0.0";
                                    ws.Cells[rowStart, column].Value = "";
                                    column++;
                                }
                            }

                            if (export.DataUs != null)
                            {
                                if (columnSelected.Contains("Data_US$"))
                                {
                                    // number with 1 decimal place and thousand separator
                                    ws.Cells[rowStart, column].Style.Numberformat.Format = "#,##0.0";
                                    ws.Cells[rowStart, column].Value = export.DataUs;
                                    column++;
                                }
                            }
                            else
                            {
                                if (columnSelected.Contains("Data_US$"))
                                {
                                    // number with 1 decimal place and thousand separator
                                    ws.Cells[rowStart, column].Style.Numberformat.Format = "#,##0.0";
                                    ws.Cells[rowStart, column].Value = "";
                                    column++;
                                }
                            }
                        }
                        else
                        {
                            if (export.Data != null)
                            {
                                if (columnSelected.Contains("Data"))
                                {
                                    // number with 1 decimal place and thousand separator
                                    ws.Cells[rowStart, column].Style.Numberformat.Format = "#,##0.0";
                                    ws.Cells[rowStart, column].Value = export.Data;
                                    column++;
                                }

                                if (columnSelected.Contains("Data_US$"))
                                {
                                    // number with 1 decimal place and thousand separator
                                    ws.Cells[rowStart, column].Style.Numberformat.Format = "#,##0.0";
                                    ws.Cells[rowStart, column].Value = "";
                                    column++;
                                }
                            }
                            else
                            {
                                if (columnSelected.Contains("Data"))
                                {
                                    // number with 1 decimal place and thousand separator
                                    ws.Cells[rowStart, column].Style.Numberformat.Format = "#,##0.0";
                                    ws.Cells[rowStart, column].Value = "";
                                    column++;
                                }

                                if (columnSelected.Contains("Data_US$"))
                                {
                                    // number with 1 decimal place and thousand separator
                                    ws.Cells[rowStart, column].Style.Numberformat.Format = "#,##0.0";
                                    ws.Cells[rowStart, column].Value = "";
                                    column++;
                                }
                            }
                        }

                        if (columnSelected.Contains("Year"))
                        {
                            ws.Cells[rowStart, column].Value = export.Year;
                            column++;
                        }

                        if (export.SourceName != null)
                        {
                            if (columnSelected.Contains("Source"))
                            {
                                ws.Cells[rowStart, column].Value = export.SourceName;
                                column++;
                            }
                        }
                        else
                        {
                            if (columnSelected.Contains("Source"))
                            {
                                ws.Cells[rowStart, column].Value = "";
                                column++;
                            }
                        }

                        if (!String.IsNullOrEmpty(export.Link))
                        {
                            if (columnSelected.Contains("Link"))
                            {
                                Uri uri = new UriBuilder(export.Link).Uri;
                                ws.Cells[rowStart, column].Hyperlink = uri;
                                ws.Cells[rowStart, column].StyleName = namedStyle.Name;
                                ws.Cells[rowStart, column].Value = export.Link;
                                column++;
                            }
                        }
                        else
                        {
                            if (columnSelected.Contains("Link"))
                            {
                                ws.Cells[rowStart, column].Value = "";
                                column++;
                            }
                        }

                        if (export.VarLc == true && export.DataUs != null)
                        {
                            if (export.CurrencyValue.HasValue)
                            {
                                if (columnSelected.Contains("Exchange_Rate_US$"))
                                {
                                    ws.Cells[rowStart, column].Value = export.CurrencyValue.Value;
                                    column++;
                                }
                            }
                            else
                            {
                                if (columnSelected.Contains("Exchange_Rate_US$"))
                                {
                                    ws.Cells[rowStart, column].Value = "";
                                    column++;
                                }
                            }
                        }
                        else
                        {
                            if (columnSelected.Contains("Exchange_Rate_US$"))
                            {
                                ws.Cells[rowStart, column].Value = "";
                                column++;
                            }
                        }

                        if (columnSelected.Contains("Notes"))
                        {
                            ws.Cells[rowStart, column].Value = export.PublicNotes;
                            column++;
                        }

                        if (columnSelected.Contains("VAR LC"))
                        {
                            ws.Cells[rowStart, column].Value = export.VarLc == true ? "1" : "";
                            column++;
                        }

                        if (columnSelected.Contains("Area_code"))
                        {
                            ws.Cells[rowStart, column].Value = export.AreaCode == true ? "1" : "";
                            column++;
                        }

                        if (columnSelected.Contains("COMMENTI NOMISMA (interno)"))
                        {
                            ws.Cells[rowStart, column].Value = export.InternalNotes;
                            column++;
                        }

                        if (export.SourceName != null)
                        {
                            if (columnSelected.Contains("CHI ha inserito/modificato il dato"))
                            {
                                ws.Cells[rowStart, column].Value = export.Username;
                                column++;
                            }
                        }
                        else
                        {
                            if (columnSelected.Contains("CHI ha inserito/modificato il dato"))
                            {
                                ws.Cells[rowStart, column].Value = "";
                                column++;
                            }
                        }

                        if (export.DateDownload != null)
                        {
                            if (columnSelected.Contains("collection date (consultation or download)"))
                            {
                                ws.Cells[rowStart, column].Value = String.Format("{0:MM/dd/yyyy}", export.DateDownload);
                                column++;
                            }
                        }
                        else
                        {
                            if (columnSelected.Contains("collection date (consultation or download)"))
                            {
                                ws.Cells[rowStart, column].Value = "";
                                column++;
                            }
                        }

                        if (!String.IsNullOrEmpty(export.Repository))
                        {
                            if (columnSelected.Contains("reference data repository"))
                            {
                                Uri uri = new UriBuilder(path + "/" + export.SourceName + "-" + export.SourceDate.Value.Day + "-" + export.SourceDate.Value.Month + "-" + export.SourceDate.Value.Year + "-" + export.SourceTime.Value.Hours + "-" + export.SourceTime.Value.Minutes + "-" + export.SourceTime.Value.Seconds + "/" + export.Repository).Uri;
                                ws.Cells[rowStart, column].Hyperlink = uri;
                                ws.Cells[rowStart, column].StyleName = namedStyle.Name;
                                ws.Cells[rowStart, column].Value = path + "/" + export.SourceName + "-" + export.SourceDate.Value.Day + "-" + export.SourceDate.Value.Month + "-" + export.SourceDate.Value.Year + "-" + export.SourceTime.Value.Hours + "-" + export.SourceTime.Value.Minutes + "-" + export.SourceTime.Value.Seconds + "/" + export.Repository;
                                column++;
                            }
                        }
                        else
                        {
                            if (columnSelected.Contains("reference data repository"))
                            {
                                ws.Cells[rowStart, column].Value = "";
                                column++;
                            }
                        }

                        if (columnSelected.Contains("workin comments_PMI"))
                        {
                            ws.Cells[rowStart, column].Value = "";
                            column++;
                        }

                        rowStart++;
                    }

                    //

                    ws.Cells[ws.Dimension.Address].AutoFitColumns();

                    package.SaveAs(memoryStream);

                    TempData["fileStream"] = memoryStream.ToArray();

                    return Json("ok", JsonRequestBehavior.AllowGet);
                } // using package
            } // using memorystream
        }

        //
        // GET: /Excel/DownloadFile
        public ActionResult DownloadFile()
        {
            if (TempData["fileStream"] != null)
            {
                byte[] data = TempData["fileStream"] as byte[];
                return File(data, "application/vnd.ms-excel", "ExportTobaccoNicotineDatabase.xlsx");
            }
            else
            {
                // Problem - Log the error, generate a blank file,
                //           redirect to another controller action - whatever fits with your application
                return new EmptyResult();
            }
        }

        //
        // GET: /Excel/Import
        [Authorize(Roles = "Admin")]
        public ActionResult Import()
        {
            return View();
        }

        //
        // POST: /Excel/Import
        [HttpPost]
        [Authorize(Roles = "Admin, Writer")]
        [Log]
        public JsonResult Import(HttpPostedFileBase postedFile)
        {
            bool status = false;
            string filePath = String.Empty;
            if (postedFile != null)
            {
                string path = Server.MapPath("~/Uploads/Temp/");
                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);

                filePath = path + Path.GetFileName(postedFile.FileName);
                string extension = Path.GetExtension(postedFile.FileName);
                postedFile.SaveAs(filePath);

                string conString = string.Empty;
                switch (extension)
                {
                    case ".xls": //Excel 97-03.
                        conString = string.Format("Provider=Microsoft.Jet.OLEDB.4.0; data source={0}; Extended Properties=Excel 8.0;", filePath);
                        break;
                    case ".xlsx": //Excel 07 and above.
                        conString = string.Format("Provider=Microsoft.ACE.OLEDB.12.0;Data Source={0};Extended Properties=\"Excel 12.0 Xml;HDR=YES;IMEX=1\";", filePath);
                        break;
                }

                DataTable dt2 = new DataTable();
                conString = string.Format(conString, filePath);

                using (OleDbConnection connExcel = new OleDbConnection(conString))
                {
                    using (OleDbCommand cmdExcel = new OleDbCommand())
                    {
                        using (OleDbDataAdapter odaExcel = new OleDbDataAdapter())
                        {
                            cmdExcel.Connection = connExcel;

                            //Get the name of First Sheet.
                            connExcel.Open();
                            DataTable dtExcelSchema;
                            dtExcelSchema = connExcel.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null);
                            string sheetName = dtExcelSchema.Rows[0]["TABLE_NAME"].ToString();
                            connExcel.Close();

                            //Read Data from First Sheet.
                            connExcel.Open();
                            cmdExcel.CommandText = "SELECT * From [" + sheetName + "]";
                            odaExcel.SelectCommand = cmdExcel;
                            odaExcel.Fill(dt2);
                            connExcel.Close();
                        }
                    }
                }

                // file da importare
                int nomismaCode;
                short country_code;
                short variable_number;
                decimal? data;
                decimal? dataUs;
                short year;
                string source_name;
                string link;
                string public_notes;
                string internal_notes;
                string username;
                bool varLc;
                DateTime? download_source;
                string reference_data_repository;

                try
                {
                    // il primo elemento è sempre il valore vecchio, il secondo è sempre il valore nuovo
                    List<Value> warningList = new List<Value>();

                    Value oldValue = null;
                    using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
                    {
                        db.Configuration.LazyLoadingEnabled = false;

                        foreach (DataRow row in dt2.Rows)
                        {
                            if (String.IsNullOrEmpty(row[0].ToString()))
                                break;

                            // prendo valori dall'excel
                            nomismaCode = int.Parse(row[0].ToString());
                            country_code = short.Parse(row[5].ToString());
                            variable_number = short.Parse(row[11].ToString());
                            varLc = (row[22].ToString() == "1") ? true : false;
                            if (!String.IsNullOrEmpty(row[16].ToString())) // se il valore è diverso da null
                                dataUs = decimal.Parse(row[16].ToString().Replace(".", "").Replace(",", "."));
                            else
                                dataUs = null;
                            if (!String.IsNullOrEmpty(row[15].ToString())) // se il valore è diverso da null
                                data = decimal.Parse(row[15].ToString().Replace(".", "").Replace(",", "."));
                            else
                                data = null;
                            year = short.Parse(row[17].ToString());
                            source_name = row[18].ToString();
                            link = (!String.IsNullOrEmpty(row[19].ToString())) ? row[19].ToString() : null;
                            public_notes = (!String.IsNullOrEmpty(row[21].ToString())) ? row[21].ToString() : null;
                            internal_notes = (!String.IsNullOrEmpty(row[24].ToString())) ? row[24].ToString() : null;
                            username = row[25].ToString();
                            if (DateUtils.IsDateTime(row[26].ToString()))
                                download_source = DateTime.ParseExact(row[26].ToString(), "MM/dd/yyyy", null);
                            else
                                download_source = null;
                            reference_data_repository = (!String.IsNullOrEmpty(row[27].ToString())) ? row[27].ToString() : null;

                            oldValue = db.Values.Where(x => x.NomismaCode == nomismaCode).FirstOrDefault();

                            // se il valore è stato trovato
                            if (oldValue != null)
                            {
                                // caricamento lazy load
                                db.Entry(oldValue).Collection(x => x.Sources).Load();

                                // valore non è stato già inserito
                                if (oldValue.Data == null || varLc == true && oldValue.DataUs == null)
                                {
                                    // effettuo la modifica solo se è stato effettivamente cambiato
                                    if (oldValue.Data != data || varLc == true && oldValue.DataUs != dataUs)
                                    {
                                        oldValue.Data = data;
                                        oldValue.DataUs = dataUs;
                                        oldValue.InternalNotes = internal_notes;
                                        oldValue.PublicNotes = public_notes;

                                        // vedo se la sorgente è stata cambiata
                                        if (((oldValue.Sources.FirstOrDefault() != null) ? oldValue.Sources.FirstOrDefault().Name : null) != source_name)
                                        {
                                            // rimuovo vecchia sorgente se è presente
                                            if (oldValue.Sources.Count > 0)
                                                oldValue.Sources.Remove(oldValue.Sources.FirstOrDefault());

                                            // metto la sorgente solo se è stato messo un dato diverso da null
                                            if (!String.IsNullOrEmpty(source_name) && oldValue.Data != null || varLc == true && oldValue.DataUs != null)
                                            {
                                                Source newSource = new Source();
                                                newSource.Name = source_name;
                                                newSource.Date = DateTime.Now.Date;
                                                newSource.Time = DateTime.Now.TimeOfDay;
                                                newSource.Link = link;
                                                if (download_source != null)
                                                    newSource.DateDownload = download_source.Value;
                                                newSource.Repository = reference_data_repository;
                                                newSource.Username = username;

                                                oldValue.Sources.Add(newSource);
                                            }
                                        }

                                        // salvo
                                        db.Entry(oldValue).State = EntityState.Modified;
                                    }
                                }
                                // valore è già inserito
                                else
                                {
                                    // inserisco il warning solo se il valore è diverso
                                    if (oldValue.Data != data || varLc == true && oldValue.DataUs != dataUs)
                                    {
                                        Value newValue = new Value();
                                        newValue.CountryCode = country_code;
                                        newValue.Number = variable_number;
                                        newValue.Year = year;
                                        newValue.NomismaCode = nomismaCode;
                                        newValue.Data = data;
                                        newValue.DataPmi = Decimal.Parse("0.0");
                                        oldValue.DataUs = dataUs;
                                        newValue.PublicNotes = public_notes;
                                        newValue.InternalNotes = internal_notes;

                                        // vedo se la sorgente è stata cambiata
                                        if (((oldValue.Sources.FirstOrDefault() != null) ? oldValue.Sources.FirstOrDefault().Name : null) != source_name)
                                        {
                                            // metto la sorgente solo se è stato messo un dato diverso da null
                                            if (!String.IsNullOrEmpty(source_name) && oldValue.Data != null || varLc == true && oldValue.DataUs != null)
                                            {
                                                Source newSource = new Source();
                                                newSource.Name = source_name;
                                                newSource.Date = DateTime.Now.Date;
                                                newSource.Time = DateTime.Now.TimeOfDay;
                                                newSource.Link = link;
                                                if (download_source != null)
                                                    newSource.DateDownload = download_source.Value;
                                                newSource.Repository = reference_data_repository;
                                                newSource.Username = username;

                                                newValue.Sources.Add(newSource);
                                            }
                                        }
                                        else
                                            newValue.Sources.Add(oldValue.Sources.FirstOrDefault());

                                        warningList.Add(oldValue);
                                        warningList.Add(newValue);
                                    }
                                    else
                                    {
                                        // vedo se la sorgente è stata cambiata
                                        if (((oldValue.Sources.FirstOrDefault() != null) ? oldValue.Sources.FirstOrDefault().Name : null) != source_name)
                                        {
                                            // rimuovo vecchia sorgente se è presente
                                            if (oldValue.Sources.Count > 0)
                                                oldValue.Sources.Remove(oldValue.Sources.FirstOrDefault());

                                            // metto la sorgente solo se è stato messo un dato diverso da null
                                            if (!String.IsNullOrEmpty(source_name) && oldValue.Data != null || varLc == true && oldValue.DataUs != null)
                                            {
                                                Source newSource = new Source();
                                                newSource.Name = source_name;
                                                newSource.Date = DateTime.Now.Date;
                                                newSource.Time = DateTime.Now.TimeOfDay;
                                                newSource.Link = link;
                                                if (download_source != null)
                                                    newSource.DateDownload = download_source.Value;
                                                newSource.Repository = reference_data_repository;
                                                newSource.Username = username;

                                                oldValue.Sources.Add(newSource);
                                            }
                                        }

                                        // salvo
                                        db.Entry(oldValue).State = EntityState.Modified;
                                    }
                                }

                            } // valore non presente all'interno del database
                            else
                            {
                                Value newValue = new Value();
                                newValue.CountryCode = country_code;
                                newValue.Number = variable_number;
                                newValue.Year = year;
                                newValue.NomismaCode = nomismaCode;
                                newValue.Data = data;
                                newValue.DataPmi = Decimal.Parse("0.0");
                                newValue.DataUs = dataUs;
                                newValue.PublicNotes = public_notes;
                                newValue.InternalNotes = internal_notes;

                                if (!String.IsNullOrEmpty(source_name))
                                {
                                    Source newSource = new Source();
                                    newSource.Name = source_name;
                                    newSource.Date = DateTime.Now.Date;
                                    newSource.Time = DateTime.Now.TimeOfDay;
                                    newSource.Link = link;
                                    if (download_source != null)
                                        newSource.DateDownload = download_source.Value;
                                    newSource.Repository = reference_data_repository;
                                    newSource.Username = username;

                                    newValue.Sources.Add(newSource);
                                }

                                // salvo
                                db.Values.Add(newValue);
                            }
                        } //foreach row

                        // salvo le modifiche
                        db.SaveChanges();

                        // cancello il file se presente
                        if (System.IO.File.Exists(filePath))
                            System.IO.File.Delete(filePath);

                        return Json(new { status = true, warning = JsonConvert.SerializeObject(warningList, Formatting.Indented, new JsonSerializerSettings() { ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore}) }, JsonRequestBehavior.AllowGet);
                    } // using database
                }
                catch (ArgumentException ex)
                {
                    // colonna non valida
                    // numero non valido/numero nullo
                    return Json(new { status, error = ex.Message }, JsonRequestBehavior.AllowGet);
                }
                catch (FormatException ex2)
                {
                    // formato non valido della data
                    return Json(new { status, error = ex2.Message }, JsonRequestBehavior.AllowGet);
                }
                catch (OverflowException ex3)
                {
                    // metto un numero più grande di quello dovuto
                    return Json(new { status, error = ex3.Message }, JsonRequestBehavior.AllowGet);
                }
                catch (EntityException ex4)
                {
                    // metto un numero più grande di quello dovuto
                    return Json(new { status, error = ex4.Message }, JsonRequestBehavior.AllowGet);
                }

            } // posted file

            return Json(new { status, error = "No file found." }, JsonRequestBehavior.AllowGet);
        }

        //
        // POST: /Excel/ReplaceValue
        [HttpPost]
        [Authorize(Roles = "Admin, Writer")]
        public JsonResult ReplaceValue(Value newValue)
        {
            bool status = false;
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                if (newValue != null)
                {
                    Value oldValue = db.Values.Where(x => x.NomismaCode == newValue.NomismaCode).FirstOrDefault();
                    // caricamento lazy load
                    db.Entry(oldValue).Collection(x => x.Sources).Load();
                    oldValue.Sources = newValue.Sources;
                    oldValue.Data = newValue.Data;
                    oldValue.DataUs = newValue.DataUs;
                    oldValue.InternalNotes = newValue.InternalNotes;
                    oldValue.PublicNotes = newValue.PublicNotes;
                    // salvo
                    status = true;
                    db.Entry(oldValue).State = EntityState.Modified;
                    db.SaveChanges();
                }

                return Json(status, JsonRequestBehavior.AllowGet);
            }
        }

    }
}
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
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
                        ws.Cells[1, 1 + i].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightBlue);
                        ws.Cells[1, 1 + i].Style.Font.Bold = true;
                    }
                    // change zoom view
                    ws.View.ZoomScale = 80;

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
                        if (export.Data != null)
                        {
                            // se la variabile è economica
                            if (export.VarLc == true)
                            {
                                if (!export.CurrencyValue.HasValue)
                                {
                                    if (columnSelected.Contains("Data"))
                                    {
                                        ws.Cells[rowStart, column].Value = "";
                                        column++;
                                    }

                                    if (columnSelected.Contains("Data_US$"))
                                    {
                                        ws.Cells[rowStart, column].Value = "";
                                        column++;
                                    }
                                }
                                else
                                {
                                    if (columnSelected.Contains("Data"))
                                    {
                                        ws.Cells[rowStart, column].Value = export.Data;
                                        column++;
                                    }

                                    if (columnSelected.Contains("Data_US$"))
                                    {
                                        if (export.CurrencyValue.Value != 0)
                                            ws.Cells[rowStart, column].Value = export.Data / export.CurrencyValue.Value;
                                        else
                                            ws.Cells[rowStart, column].Value = "";
                                        column++;
                                    }
                                }

                            }
                            else
                            {
                                if (columnSelected.Contains("Data"))
                                {
                                    ws.Cells[rowStart, column].Value = export.Data;
                                    column++;
                                }

                                if (columnSelected.Contains("Data_US$"))
                                {
                                    ws.Cells[rowStart, column].Value = "";
                                    column++;
                                }

                            }

                            if (columnSelected.Contains("Year"))
                            {
                                ws.Cells[rowStart, column].Value = export.Year;
                                column++;
                            }
                        }
                        else
                        {
                            if (columnSelected.Contains("Data"))
                            {
                                ws.Cells[rowStart, column].Value = "";
                                column++;
                            }

                            if (columnSelected.Contains("Data_US$"))
                            {
                                ws.Cells[rowStart, column].Value = "";
                                column++;
                            }

                            if (columnSelected.Contains("Year"))
                            {
                                ws.Cells[rowStart, column].Value = "";
                                column++;
                            }
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

                        if (export.SourceName != null)
                        {
                            if (columnSelected.Contains("Link"))
                            {
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

                        if (export.VarLc == true)
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

                        if (export.SourceName != null)
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

                        if (export.SourceName != null)
                        {
                            if (columnSelected.Contains("reference data repository"))
                            {
                                ws.Cells[rowStart, column].Value = export.Repository;
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
        // GET: /Excel/Report
        [Log]
        public ActionResult Report()
        {
            return View();
        }

        //
        // GET: /Excel/GenerateReportRegion
        [Log]
        public ActionResult GenerateReportRegion(short yearA, short yearB)
        {
            using (ExcelPackage package = new ExcelPackage())
            {
                ExcelWorksheet ws = package.Workbook.Worksheets.Add("Regions");

                int rowStart = 2;

                ws.Cells["A1"].Value = "Continent Code";
                ws.Cells["B1"].Value = "Region Code";
                ws.Cells["C1"].Value = "Region Name";
                ws.Cells["D1"].Value = "Pmi Name";
                ws.Cells["E1"].Value = "% of the database that is filled in";
                ws.Cells["F1"].Value = "of which, % of the filled in database that is UPDATED";
                ws.Cells["G1"].Value = "This Year";
                ws.Cells["H1"].Value = "Last Year";

                // change font e size
                ws.Cells.Style.Font.Name = "Calibri";
                ws.Cells.Style.Font.Size = 11;
                // change color header
                for (int i = 0; i < ws.Dimension.Columns; i++)
                {
                    ws.Cells[1, 1 + i].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    ws.Cells[1, 1 + i].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightBlue);
                    ws.Cells[1, 1 + i].Style.Font.Bold = true;
                }
                // change zoom view
                ws.View.ZoomScale = 80;

                // code

                using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
                {
                    /*db.Configuration.LazyLoadingEnabled = false;

                    foreach (Region r in db.Regions)
                    {
                        //int numerUpdate = ValueRepository.getNumerUpdateRegion(r.IdContinent, r.IdRegion, yearA, yearB);
                        //int totValuesNotNull = ValueRepository.getTotValuesNotNullRegion(r.IdContinent, r.IdRegion, thisY);
                        //int totValues = ValueRepository.getTotValuesRegion(r.ContinentCode, r.RegionCode, yearA);

                        ws.Cells[string.Format("A{0}", rowStart)].Value = r.ContinentCode;
                        ws.Cells[string.Format("B{0}", rowStart)].Value = r.RegionCode;
                        ws.Cells[string.Format("C{0}", rowStart)].Value = r.PmiCoding;
                        ws.Cells[string.Format("D{0}", rowStart)].Value = r.RegionName;
                        //ws.Cells[string.Format("E{0}", rowStart)].Value = Math.Round((((double)totValuesNotNull / totValues) * 100));
                        //ws.Cells[string.Format("F{0}", rowStart)].Value = Math.Round((((double)numerUpdate / totValues) * 100));
                        ws.Cells[string.Format("G{0}", rowStart)].Value = yearA;
                        ws.Cells[string.Format("H{0}", rowStart)].Value = yearB;

                        rowStart++;
                    }*/
                }

                // end code

                ws.Cells[ws.Dimension.Address].AutoFitColumns();

                return File(package.GetAsByteArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "GenerateReportRegions.xlsx");
            }
        }

    }
}
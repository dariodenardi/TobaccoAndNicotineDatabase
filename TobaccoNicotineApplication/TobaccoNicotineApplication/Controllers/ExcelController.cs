using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TobaccoNicotineApplication.Models;

namespace TobaccoNicotineApplication.Controllers
{
    public class ExcelController : Controller
    {
        //
        // GET: /Excel/Index
        //[Authorize(Roles = "Admin")]
        public ActionResult Index()
        {
            return View();
        }

        //
        // POST: /Excel/Index
        [HttpPost]
        //[Authorize(Roles = "Admin")]
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

                        List<Country> countries = db.Countries.Where(x => x.Name == name).ToList();

                        Country country;
                        if ((country = countries.FirstOrDefault()) != null)
                        {
                            year = 2010;
                            for (int i = 0; i < 8; i++)
                            {
                                Currency c = new Currency();
                                c.Year = year;
                                c.CountryCode = country.Code;

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
                } // using db

            } // posted file*/

            return View();
        }
    }
}
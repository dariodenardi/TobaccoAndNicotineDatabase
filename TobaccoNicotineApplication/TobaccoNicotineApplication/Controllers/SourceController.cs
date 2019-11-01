using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TobaccoNicotineApplication.Filters;
using TobaccoNicotineApplication.Models;
using TobaccoNicotineApplication.Utilities;

namespace TobaccoNicotineApplication.Controllers
{
    [Authorize]
    [NoCache]
    [ValidateAntiForgeryTokenOnAllPosts]
    public class SourceController : Controller
    {
        //
        // GET: /Source/Index
        [Log]
        public ActionResult Index()
        {
            return View();
        }

        //
        // POST: /Source/GetSourceList
        [HttpPost]
        public JsonResult GetSourceList(string orderName, string orderDate, string orderTime, string orderLink, string orderRepository, string orderDateDownload, string orderUsername)
        {
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                IQueryable<Source> sources = from s in db.Sources
                                             select s;

                //if (!string.IsNullOrEmpty(idContinentString[0]))
                //    sources = sources.Where(t => t.Values.Any(x => idRegionString.Select(short.Parse).Contains(x.IdContinent)));

                /*if (!string.IsNullOrEmpty(idRegionString[0]))
                    sources = sources.Where(t => idRegionString.Select(short.Parse).Contains(t.IdRegion));

                if (!string.IsNullOrEmpty(idCountryString[0]))
                    sources = sources.Where(t => idCountryString.Select(short.Parse).Contains(t.Id));

                if (!string.IsNullOrEmpty(pmiCodeString[0]))
                    sources = sources.Where(t => pmiCodeString.Contains(t.Regions.PmiCode));

                if (!string.IsNullOrEmpty(countryNameString[0]))
                    sources = sources.Where(t => countryNameString.Contains(t.Name));

                if (!string.IsNullOrEmpty(topicString[0]))
                    sources = sources.Where(t => topicString.Select(short.Parse).Contains(t.Topic));

                if (!string.IsNullOrEmpty(numberString[0]))
                    sources = sources.Where(t => numberString.Select(short.Parse).Contains(t.Number));

                if (!string.IsNullOrEmpty(variableNameString[0]))
                    sources = sources.Where(t => variableNameString.Contains(t.Name));

                if (!string.IsNullOrEmpty(measurementUnitString[0]))
                    sources = sources.Where(t => measurementUnitString.Contains(t.MeasurementUnitName));

                if (!string.IsNullOrEmpty(varLcString[0]))
                    sources = sources.Where(t => varLcString.Select(bool.Parse).Contains(t.VarLc));*/

                if (orderName == "desc")
                    sources = sources.OrderByDescending(x => x.Name);
                else if (orderName == "asc")
                    sources = sources.OrderBy(x => x.Name);

                if (orderDate == "desc")
                    sources = sources.OrderByDescending(x => x.Date);
                else if (orderDate == "asc")
                    sources = sources.OrderBy(x => x.Date);

                if (orderTime == "desc")
                    sources = sources.OrderByDescending(x => x.Time);
                else if (orderTime == "asc")
                    sources = sources.OrderBy(x => x.Time);

                if (orderLink == "desc")
                    sources = sources.OrderByDescending(x => x.Link);
                else if (orderLink == "asc")
                    sources = sources.OrderBy(x => x.Link);

                if (orderRepository == "desc")
                    sources = sources.OrderByDescending(x => x.Repository);
                else if (orderRepository == "asc")
                    sources = sources.OrderBy(x => x.Repository);

                if (orderDateDownload == "desc")
                    sources = sources.OrderByDescending(x => x.DateDownload);
                else if (orderDateDownload == "asc")
                    sources = sources.OrderBy(x => x.DateDownload);

                if (orderUsername == "desc")
                    sources = sources.OrderByDescending(x => x.Username);
                else if (orderUsername == "asc")
                    sources = sources.OrderBy(x => x.Username);

                return Json(sources.Select(x => new { x.Name, x.Date, x.Time, x.Link, x.Repository, x.DateDownload, x.Username }).ToList(), JsonRequestBehavior.AllowGet);
            }
        }

        //
        // GET: /Source/GetSourceById
        public JsonResult GetSourceById(string SourceName, DateTime date, TimeSpan time)
        {
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                Source model = db.Sources.Where(x => x.Name == SourceName && x.Date == date && x.Time == time).FirstOrDefault();

                return Json(model, JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Source/Edit
        [HttpPost]
        [Authorize(Roles = "Admin, Writer")]
        [Log]
        public JsonResult Edit(string SourceName, DateTime date, TimeSpan time, string link, string repository, string username, DateTime? dateDownload)
        {
            bool status = false;
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                Source model = db.Sources.Where(x => x.Name == SourceName && x.Date == date && x.Time == time).FirstOrDefault();

                if (model != null)
                {
                    if (!String.IsNullOrEmpty(link))
                    {
                        model.Link = link;
                        model.Username = username;
                    }
                    if (!String.IsNullOrEmpty(repository))
                    {
                        model.Repository = repository;
                        model.Username = username;
                    }
                    if (dateDownload.HasValue)
                    {
                        model.DateDownload = dateDownload.Value;
                        model.Username = username;
                    }

                    db.Entry(model).State = EntityState.Modified;

                    db.SaveChanges();

                    status = true;
                }

                return Json(new { success = status });
            }
        }

        //
        // POST: /Source/Delete
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Log]
        public JsonResult Delete(string SourceName, DateTime date, TimeSpan time)
        {
            bool status = false;
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                Source source = db.Sources.Where(x => x.Name == SourceName && x.Date == date && x.Time == time).FirstOrDefault();
                if (source != null)
                {
                    db.Sources.Remove(source);

                    db.SaveChanges();
                    status = true;
                }

                return Json(status, JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Source/Create
        [HttpPost]
        [Authorize(Roles = "Admin, Writer")]
        [Log]
        public JsonResult Create(Source source)
        {
            bool status = false;
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                // check duplicate
                bool result = db.Sources.Any(x => x.Name == source.Name && x.Date == source.Date && x.Time == source.Time);
                if (result == true)
                {
                    ModelState.AddModelError("Name", StaticName.SourceName() + " is already present.");
                    ModelState.AddModelError("Date", StaticName.UploadDate() + " is already present.");
                    ModelState.AddModelError("Time", StaticName.UploadTime() + " is already present.");
                }

                if (ModelState.IsValid)
                {
                    db.Sources.Add(source);

                    db.SaveChanges();

                    status = true;
                }
                else
                {
                    IEnumerable<string> errorModel =
                        from x in ModelState.Keys
                        where ModelState[x].Errors.Count > 0
                        select x;

                    return Json(new { success = status, errors = errorModel.Select(x => new { key = x, errors = ModelState[x].Errors.Select(y => y.ErrorMessage).ToArray() }) }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { success = status });
            }
        }

        //
        // GET: /Source/GetFieldList
        public JsonResult GetFieldList(string[] pmiCode, string[] regionName, string[] countryName, string[] topic, string[] number, string[] variableName)
        {
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.ProxyCreationEnabled = false;

                IQueryable<Value> values = from s in db.Values
                                           select s;

                /*if (!String.IsNullOrEmpty(pmiCode[0]))
                    values = values.Where(t => pmiCode.Contains(t.Countries.Regions.PmiCode));

                if (!String.IsNullOrEmpty(regionName[0]))
                    values = values.Where(t => regionName.Contains(t.Countries.Regions.RegionName));

                if (!String.IsNullOrEmpty(countryName[0]))
                    values = values.Where(t => countryName.Contains(t.Countries.Name));

                //if (!String.IsNullOrEmpty(topic[0]))
                //    values = values.Where(t => topic.Select(short.Parse).Contains(t.Variables.Topic));

                if (!String.IsNullOrEmpty(number[0]))
                    values = values.Where(t => number.Select(short.Parse).Contains(t.Number));

                if (!String.IsNullOrEmpty(variableName[0]))
                    values = values.Where(t => variableName.Contains(t.Variables.Name));*/

                return Json(values.Select(x => new { x.Countries.ContinentCode, x.Countries.RegionCode, x.CountryCode, CountryName = x.Countries.CountryName, x.Countries.RegionName, x.Countries.PmiCoding, VariableName = x.Variables.Name, x.Variables.PhaseCode, x.Variables.VarLc, x.Variables.MeasurementUnitName }).ToList(), JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Source/LoadSource
        [HttpPost]
        public JsonResult LoadSource(HttpPostedFileBase file)
        {
            string path = Server.MapPath("~/Uploads");
            try
            {
                string message = "File uploaded.";
                bool status = true;
                using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
                {
                    db.Configuration.ProxyCreationEnabled = false;

                    // divido il file in due parti
                    string[] slitFileNames = file.FileName.Split('_');
                    if (slitFileNames.Length > 0)
                    {
                        // converto la prima parte che dovrebbe essere un numero
                        int number = int.Parse(slitFileNames[0]);
                        Value value = db.Values.Where(x => x.NomismaCode == short.Parse(slitFileNames[0])).FirstOrDefault();

                        // controllo che il valore esista
                        if (value != null)
                        {
                            db.Entry(value).Collection(i => i.Sources).Load();

                            Source source = value.Sources.FirstOrDefault();
                            if (source != null)
                            {
                                string filePath = source.Name + "-" + source.Date.Day + "-" + source.Date.Month + "-" + source.Date.Year + "-" + source.Time.Hours + "-" + source.Time.Minutes + "-" + source.Time.Seconds;

                                // vedo se esiste già il file
                                if (System.IO.File.Exists(path + "/Sources" + "/" + filePath + "/" + source.Repository))
                                    return Json(new { success = false, response = "File already exists.", filePath }, JsonRequestBehavior.AllowGet);

                                // creo l'eventuale cartella della fonte
                                if (!Directory.Exists(path + "/Sources" + "/" + filePath))
                                {
                                    Directory.CreateDirectory(path + "/Sources" + "/" + filePath);
                                }

                                // aggiorno il nomeFile
                                source.Repository = file.FileName;

                                // carico file
                                file.SaveAs(filePath);

                                db.Entry(source).State = EntityState.Modified;
                                db.SaveChanges();
                            }
                            else
                            {
                                status = false;
                                message += file.FileName + ": source not found.";
                            }
                        }
                        else
                        {
                            status = false;
                            message = file.FileName + ": value not found.";
                        }
                    } // if split
                    else
                    {
                        status = false;
                        message = file.FileName + ": name isn't correct.";
                    }

                    return Json(new { success = status, response = message }, JsonRequestBehavior.AllowGet);
                } // using db
            }
            catch (Exception exception)
            {
                return Json(new { success = false, response = exception.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Source/DeleteFile
        [HttpPost]
        public JsonResult DeleteFile(string filePath)
        {
            string path = Server.MapPath("~/Uploads");
            try
            {
                System.IO.File.Delete(path + "/Sources" + "/" + filePath);

                return Json(true, JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json(false, JsonRequestBehavior.AllowGet);
            }
        }

    }
}
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.SqlClient;
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
    public class ValueController : Controller
    {
        //
        // GET: /Value/Index
        [Log]
        public ActionResult Index()
        {
            return View();
        }

        //
        // POST: /Value/GetValueList
        [HttpPost]
        public JsonResult GetValueList(string[] pmiCoding, string[] continentName, string[] regionName, string[] countryName, short[] continentCode, short[] regionCode, short[] countryCode, bool[] areaCode, short[] year, short[] number, string[] variableName, short[] phaseCode, string[] phaseName, bool[] varLc,
            string orderCountryName, string orderVariableName, string orderData, string orderDataUs, string orderYear, string orderPublicNotes, string orderInternalNotes)
        {
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                IQueryable<Value> values = from s in db.Values
                                                 select s;

                if (ArrayUtils.IsNullOrEmpty(pmiCoding) == false)
                    values = values.Where(t => pmiCoding.Contains(t.Countries.PmiCoding));

                if (ArrayUtils.IsNullOrEmpty(continentName) == false)
                    values = values.Where(t => continentName.Contains(t.Countries.ContinentName));

                if (ArrayUtils.IsNullOrEmpty(regionName) == false)
                    values = values.Where(t => regionName.Contains(t.Countries.RegionName));

                if (ArrayUtils.IsNullOrEmpty(countryName) == false)
                    values = values.Where(t => countryName.Contains(t.Countries.CountryName));

                if (ArrayUtils.IsNullOrEmpty(continentCode) == false)
                    values = values.Where(t => continentCode.Contains(t.Countries.ContinentCode));

                if (ArrayUtils.IsNullOrEmpty(regionCode) == false)
                    values = values.Where(t => regionCode.Contains(t.Countries.RegionCode));

                if (ArrayUtils.IsNullOrEmpty(countryCode) == false)
                    values = values.Where(t => countryCode.Contains(t.CountryCode));

                if (ArrayUtils.IsNullOrEmpty(areaCode) == false)
                    values = values.Where(t => areaCode.Contains(t.Countries.AreaCode));

                if (ArrayUtils.IsNullOrEmpty(year) == false)
                    values = values.Where(t => year.Contains(t.Year));

                if (ArrayUtils.IsNullOrEmpty(number) == false)
                    values = values.Where(t => number.Contains(t.Number));

                if (ArrayUtils.IsNullOrEmpty(variableName) == false)
                    values = values.Where(t => variableName.Contains(t.Variables.Name));

                if (ArrayUtils.IsNullOrEmpty(phaseCode) == false)
                    values = values.Where(t => phaseCode.Contains(t.Variables.PhaseCode));

                if (ArrayUtils.IsNullOrEmpty(phaseName) == false)
                    values = values.Where(t => phaseName.Contains(t.Variables.PhaseName));

                if (ArrayUtils.IsNullOrEmpty(varLc) == false)
                    values = values.Where(t => varLc.Contains(t.Variables.VarLc));

                if (orderCountryName == "desc")
                    values = values.OrderByDescending(x => x.Countries.CountryName);
                else if (orderCountryName == "asc")
                    values = values.OrderBy(x => x.Countries.CountryName);

                if (orderVariableName == "desc")
                    values = values.OrderByDescending(x => x.Variables.Name);
                else if (orderVariableName == "asc")
                    values = values.OrderBy(x => x.Variables.Name);

                if (orderData == "desc")
                    values = values.OrderByDescending(x => x.Data);
                else if (orderData == "asc")
                    values = values.OrderBy(x => x.Data);

                if (orderDataUs == "desc")
                    values = values.OrderByDescending(x => x.DataUs);
                else if (orderDataUs == "asc")
                    values = values.OrderBy(x => x.DataUs);

                if (orderYear == "desc")
                    values = values.OrderByDescending(x => x.Year);
                else if (orderYear == "asc")
                    values = values.OrderBy(x => x.Year);

                if (orderPublicNotes == "desc")
                    values = values.OrderByDescending(x => x.PublicNotes);
                else if (orderPublicNotes == "asc")
                    values = values.OrderBy(x => x.PublicNotes);

                if (orderInternalNotes == "desc")
                    values = values.OrderByDescending(x => x.InternalNotes);
                else if (orderInternalNotes == "asc")
                    values = values.OrderBy(x => x.InternalNotes);

                return Json(values.Select(x => new { x.CountryCode, x.Number, x.Countries.CountryName, VariableName = x.Variables.Name, x.Data, x.DataUs, x.Year, x.Variables.VarLc, CurrencyValue = (x.Countries.Currencies.Where(a => a.Year == x.Year).FirstOrDefault() != null)? x.Countries.Currencies.Where(a => a.Year == x.Year).FirstOrDefault().Value : 0, x.PublicNotes, x.InternalNotes, Sources = x.Sources.FirstOrDefault() }).ToList(), JsonRequestBehavior.AllowGet);
            }
        }

        //
        // GET: /Value/GetListValueYear
        public JsonResult GetListValueYear()
        {
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                return Json(db.Values.Select(x => new { x.Year }).Distinct().OrderBy(x => x.Year).ToList(), JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Value/Edit
        [HttpPost]
        [Authorize(Roles = "Admin, Writer")]
        [Log]
        public JsonResult Edit(short countryCode, short year, short number, string data, string dataUs, bool varLc, string publicNotes, string internalNotes, string sourceName, string link, string dateDownload, string repository, string username)
        {
            bool status = false;
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                Value model = db.Values.Where(x => x.CountryCode == countryCode && x.Year == year && x.Number == number).FirstOrDefault();

                if (model != null)
                {
                    if (!String.IsNullOrEmpty(publicNotes))
                        if (publicNotes == "null")
                            model.PublicNotes = null;
                        else
                            model.PublicNotes = publicNotes;
                    if (!String.IsNullOrEmpty(internalNotes))
                        if (internalNotes == "null")
                            model.InternalNotes = null;
                        else
                            model.InternalNotes = internalNotes;
                    if (varLc == true)
                    {
                        if (!String.IsNullOrEmpty(dataUs))
                            if (dataUs == "null")
                                model.DataUs = null;
                            else
                            {
                                decimal o;
                                if (decimal.TryParse(dataUs, out o))
                                    model.DataUs = Math.Round(o, 1);
                            }
                        if (!String.IsNullOrEmpty(data))
                                if (data == "null")
                                    model.Data = null;
                                else
                                {
                                    decimal o;
                                    if (decimal.TryParse(data, out o))
                                        model.Data = Math.Round(o, 1);
                                }
                    }
                    else
                    {
                        if (!String.IsNullOrEmpty(data))
                            if (data == "null")
                                model.Data = null;
                            else
                            {
                                decimal o;
                                if (decimal.TryParse(data, out o))
                                    model.Data = Math.Round(o, 1);
                            }
                    }
                    bool sourceChange = false;
                    if (!String.IsNullOrEmpty(sourceName))
                    {
                        if (sourceName == "null")
                        {
                            // caricamento lazy load
                            db.Entry(model).Collection(x => x.Sources).Load();

                            // rimuovo vecchia sorgente se è presente
                            if (model.Sources.Count > 0)
                                model.Sources.Remove(model.Sources.FirstOrDefault());
                        }
                        else
                        {
                            // caricamento lazy load
                            db.Entry(model).Collection(x => x.Sources).Load();

                            // vedo se la fonte di Value è la stessa di quella che appare in sourceName
                            if ((model.Sources.FirstOrDefault() != null ? model.Sources.FirstOrDefault().Name : null) != sourceName)
                            {
                                // fonte diversa
                                sourceChange = true;

                                // rimuovo vecchia sorgente se è presente
                                if (model.Sources.Count > 0)
                                    model.Sources.Remove(model.Sources.FirstOrDefault());

                                Source newSource = new Source();
                                newSource.Name = sourceName;
                                newSource.Date = DateTime.Now.Date;
                                newSource.Time = DateTime.Now.TimeOfDay;
                                newSource.Username = User.Identity.Name;

                                if (!String.IsNullOrEmpty(link))
                                    if (link == "null")
                                        newSource.Link = null;
                                    else
                                        newSource.Link = link;
                                if (!String.IsNullOrEmpty(repository))
                                    if (repository == "null")
                                        newSource.Repository = null;
                                    else
                                        newSource.Repository = repository;
                                if (!String.IsNullOrEmpty(dateDownload))
                                    if (dateDownload == "null")
                                        newSource.DateDownload = null;
                                    else
                                        newSource.DateDownload = dateDownload;
                                if (!String.IsNullOrEmpty(username))
                                    if (username == "null")
                                        newSource.Username = null;
                                    else
                                        newSource.Username = username;

                                model.Sources.Add(newSource);
                            }
                            else
                            {
                                // uguale

                                if (!String.IsNullOrEmpty(link))
                                    if (link == "null")
                                        model.Sources.FirstOrDefault().Link = null;
                                    else
                                        model.Sources.FirstOrDefault().Link = link;
                                if (!String.IsNullOrEmpty(repository))
                                    if (repository == "null")
                                        model.Sources.FirstOrDefault().Repository = null;
                                    else
                                        model.Sources.FirstOrDefault().Repository = repository;
                                if (!String.IsNullOrEmpty(dateDownload))
                                    if (dateDownload == "null")
                                        model.Sources.FirstOrDefault().DateDownload = null;
                                    else
                                        model.Sources.FirstOrDefault().DateDownload = dateDownload;
                                if (!String.IsNullOrEmpty(username))
                                    if (username == "null")
                                        model.Sources.FirstOrDefault().Username = null;
                                    else
                                        model.Sources.FirstOrDefault().Username = username;

                            }
                        }
                    }

                    if (data == "null" || decimal.TryParse(data, out decimal p) || dataUs == "null" || decimal.TryParse(dataUs, out decimal k) || !String.IsNullOrEmpty(internalNotes) || !String.IsNullOrEmpty(publicNotes) || sourceChange || sourceName == "null" || !String.IsNullOrEmpty(sourceName) && !String.IsNullOrEmpty(link) || !String.IsNullOrEmpty(sourceName) && !String.IsNullOrEmpty(repository) || !String.IsNullOrEmpty(sourceName) && (!String.IsNullOrEmpty(dateDownload) || dateDownload == "null") || !String.IsNullOrEmpty(sourceName) && !String.IsNullOrEmpty(username))
                        status = true;

                    // solo se è stato modificato qualcosa salvo
                    if (status == true)
                    {
                        db.Entry(model).State = EntityState.Modified;

                        db.SaveChanges();
                    } // if
                }
                else
                {
                    return Json(new { success = false, error = "Value not found." }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { success = status }, JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Value/Delete
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Log]
        public JsonResult Delete(short countryCode, short year, short number)
        {
            bool status = false;
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                Value value = db.Values.Where(a => a.CountryCode == countryCode && a.Year == year && a.Number == number).FirstOrDefault();
                if (value != null)
                {
                    db.Values.Remove(value);

                    db.SaveChanges();
                    status = true;
                }

                return Json(status, JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Value/Create
        [HttpPost]
        [Authorize(Roles = "Admin, Writer")]
        [Log]
        public JsonResult Create(Value value)
        {
            bool status = false;
            if (ModelState.IsValid)
            {
                using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
                {
                    db.Values.Add(value);

                    try
                    {
                        db.SaveChanges();
                    }
                    catch (DbUpdateException e)
                    {
                        SqlException innerException = null;
                        Exception tmp = e;
                        while (innerException == null && tmp != null)
                        {
                            if (tmp != null)
                            {
                                innerException = tmp.InnerException as SqlException;
                                tmp = tmp.InnerException;
                            }

                        }
                        if (innerException != null && innerException.Number == 547)
                        {
                            // FK
                            string[] error = { StaticName.Number() + " isn't present." };
                            string[] keys = { "Number" };
                            return Json(new { success = false, errors = keys.Select(x => new { key = x, errors = error }) }, JsonRequestBehavior.AllowGet);
                        }
                        else if (innerException != null && innerException.Number == 2627)
                        {
                            // PK
                            string[] error = { StaticName.Year() + " is already present" };
                            string[] keys = { "Year" };
                            return Json(new { success = false, errors = keys.Select(x => new { key = x, errors = error }) }, JsonRequestBehavior.AllowGet);
                        }
                        else if (innerException != null && innerException.Number == 2601)
                        {
                            // UNIQUE
                            string[] error = { StaticName.NomismaCode() + " is already present." };
                            string[] keys = { "NomismaCode" };
                            return Json(new { success = false, errors = keys.Select(x => new { key = x, errors = error }) }, JsonRequestBehavior.AllowGet);
                        }
                        else
                        {
                            throw;
                        }
                    }

                    status = true;

                    return Json(new { success = status }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                // errori dovuti check delle annotazioni
                IEnumerable<string> errorModel =
                    from x in ModelState.Keys
                    where ModelState[x].Errors.Count > 0
                    select x;

                return Json(new { success = status, errors = errorModel.Select(x => new { key = x, errors = ModelState[x].Errors.Select(y => y.ErrorMessage).ToArray() }) }, JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Value/GetFieldList
        [HttpPost]
        public JsonResult GetFieldList(string[] pmiCoding, string[] continentName, string[] regionName, string[] countryName, short[] continentCode, short[] regionCode, short[] countryCode, bool[] areaCode, short[] year, short[] number, string[] variableName, short[] phaseCode, string[] phaseName, bool[] varLc)
        {
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.ProxyCreationEnabled = false;

                IQueryable<Value> values = from s in db.Values
                                           select s;

                if (ArrayUtils.IsNullOrEmpty(pmiCoding) == false)
                    values = values.Where(t => pmiCoding.Contains(t.Countries.PmiCoding));

                if (ArrayUtils.IsNullOrEmpty(continentName) == false)
                    values = values.Where(t => continentName.Contains(t.Countries.ContinentName));

                if (ArrayUtils.IsNullOrEmpty(regionName) == false)
                    values = values.Where(t => regionName.Contains(t.Countries.RegionName));

                if (ArrayUtils.IsNullOrEmpty(countryName) == false)
                    values = values.Where(t => countryName.Contains(t.Countries.CountryName));

                if (ArrayUtils.IsNullOrEmpty(continentCode) == false)
                    values = values.Where(t => continentCode.Contains(t.Countries.ContinentCode));

                if (ArrayUtils.IsNullOrEmpty(regionCode) == false)
                    values = values.Where(t => regionCode.Contains(t.Countries.RegionCode));

                if (ArrayUtils.IsNullOrEmpty(countryCode) == false)
                    values = values.Where(t => countryCode.Contains(t.CountryCode));

                if (ArrayUtils.IsNullOrEmpty(areaCode) == false)
                    values = values.Where(t => areaCode.Contains(t.Countries.AreaCode));

                if (ArrayUtils.IsNullOrEmpty(year) == false)
                    values = values.Where(t => year.Contains(t.Year));

                if (ArrayUtils.IsNullOrEmpty(number) == false)
                    values = values.Where(t => number.Contains(t.Number));

                if (ArrayUtils.IsNullOrEmpty(variableName) == false)
                    values = values.Where(t => variableName.Contains(t.Variables.Name));

                if (ArrayUtils.IsNullOrEmpty(phaseCode) == false)
                    values = values.Where(t => phaseCode.Contains(t.Variables.PhaseCode));

                if (ArrayUtils.IsNullOrEmpty(phaseName) == false)
                    values = values.Where(t => phaseName.Contains(t.Variables.PhaseName));

                if (ArrayUtils.IsNullOrEmpty(varLc) == false)
                    values = values.Where(t => varLc.Contains(t.Variables.VarLc));

                return Json(values.Select(x => new { x.Year }).Distinct().OrderBy(x => x.Year).ToList(), JsonRequestBehavior.AllowGet);
            }
        }

        public static int CheckValue(short CountryCode, short Number, short Year, decimal? Data, decimal? DataUs)
        {
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                // Il tool genera un warning quando all’interno della stessa variabile e per singolo paese ci sono fonti diverse tra i vari anni
                // (es. la variabile 2 del Burundi ha fonte X per il 2010-2015 e fonte Y per il 2016-18).
                bool result = ValueRepository.getDifferentSource(CountryCode, Number);
                if (result == true)
                    return 1;

                // Il tool genera un warning ogni volta che registra la presenza di dati poco verosimili (ad esempio quando un dato cambia in maniera troppo
                // drastica tra un anno e l’altro (es. il numero di sigarette vendute passa da 1 miliardo a 1.000 nel giro di un anno)
                Value model = db.Values.Where(x => x.CountryCode == CountryCode && x.Year == (Year - 1) && x.Number == Number).FirstOrDefault();

                if (model != null)
                {
                    if (model.Data.HasValue && Data.HasValue && (model.Data - Data) >= 100000000)
                        return 2;
                    else if (model.DataUs.HasValue &&DataUs.HasValue && (model.DataUs - DataUs) >= 100000000)
                        return 2;
                }

                return 0;
            }
        }

    }
}
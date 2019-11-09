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
        public JsonResult GetValueList(string[] pmiCoding, string[] continentName, string[] regionName, string[] countryName, short[] continentCode, short[] regionCode, short[] countryCode, bool[] areaCode, short[] year, short[] number, string[] variableName, short[] phaseCode, string[] phaseName, bool[] varLc, string[] measurementUnit,
            string orderCountryName, string orderVariableName, string orderData, string orderYear, string orderPublicNotes, string orderInternalNotes)
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

                if (ArrayUtils.IsNullOrEmpty(measurementUnit) == false)
                    values = values.Where(t => measurementUnit.Contains(t.Variables.MeasurementUnitName));

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

                return Json(values.Select(x => new { x.Countries.CountryName, VariableName = x.Variables.Name, x.Data, x.Year, x.Variables.VarLc, CurrencyValue = (x.Countries.Currencies.Where(a => a.Year == x.Year).FirstOrDefault() != null)? x.Countries.Currencies.Where(a => a.Year == x.Year).FirstOrDefault().Value : 0, x.PublicNotes, x.InternalNotes, IsSource = (x.Sources.FirstOrDefault().Repository != null) ? true : false }).ToList(), JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Value/Edit
        [HttpPost]
        [Authorize(Roles = "Admin, Writer")]
        [Log]
        public JsonResult Edit(string countryName, short year, string variableName, decimal currencyValue, decimal? data, decimal? dataUs, bool varLc, string publicNotes, string internalNotes)
        {
            bool status = false;
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                //db.Configuration.LazyLoadingEnabled = false;

                Value model = db.Values.Where(x => x.Countries.CountryName == countryName && x.Year == year && x.Variables.Name == variableName).FirstOrDefault();

                if (model != null)
                {
                    bool ok = false;
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
                        if (dataUs.HasValue && currencyValue != 0)
                        {
                            model.Data = dataUs.Value * currencyValue;
                            ok = true;
                        }
                        else if (data.HasValue && currencyValue != 0)
                        {
                            model.Data = data.Value / currencyValue;
                            ok = true;
                        }
                    }
                    else
                    {
                        if (data.HasValue)
                        {
                            model.Data = data.Value;
                            ok = true;
                        }
                        else if (dataUs.HasValue && currencyValue != 0)
                        {
                            model.Data = dataUs.Value * currencyValue;
                            ok = true;
                        }
                    }

                    if (ok || !String.IsNullOrEmpty(internalNotes) || !String.IsNullOrEmpty(publicNotes))
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
        public JsonResult Delete(string CountryName, short year, string variableName)
        {
            bool status = false;
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                Value value = db.Values.Where(a => a.Countries.CountryName == CountryName && a.Year == year && a.Variables.Name == variableName).FirstOrDefault();
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
                            string[] error = { StaticName.CountryCode() + "-" + StaticName.Number() + " aren't present." };
                            string[] keys = { "IdCountry", "Number" };
                            return Json(new { success = false, errors = keys.Select(x => new { key = x, errors = error }) }, JsonRequestBehavior.AllowGet);
                        }
                        else if (innerException != null && innerException.Number == 2627)
                        {
                            // PK
                            string[] error = { StaticName.CountryCode() + "-" + StaticName.Number() + "-" + StaticName.Year() + " already present" };
                            string[] keys = { "IdCountry", "Year", "Number" };
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
        public JsonResult GetFieldList(string[] pmiCoding, string[] continentName, string[] regionName, string[] countryName, short[] continentCode, short[] regionCode, short[] countryCode, bool[] areaCode, short[] year, short[] number, string[] variableName, short[] phaseCode, string[] phaseName, bool[] varLc, string[] measurementUnit)
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

                if (ArrayUtils.IsNullOrEmpty(measurementUnit) == false)
                    values = values.Where(t => measurementUnit.Contains(t.Variables.MeasurementUnitName));

                return Json(values.Select(x => new { x.Year }).Distinct().OrderBy(x => x.Year).ToList(), JsonRequestBehavior.AllowGet);
            }
        }

    }
}
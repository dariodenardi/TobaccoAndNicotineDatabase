using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Validation;
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
    public class CurrencyController : Controller
    {
        //
        // GET: /Currency/Index
        [Log]
        public ActionResult Index()
        {
            return View();
        }

        //
        // POST: /Currency/GetCurrencyList
        [HttpPost]
        public JsonResult GetCurrencyList(string[] pmiCoding, string[] continentName, string[] regionName, string[] countryName, short[] continentCode, short[] regionCode, short[] countryCode, bool[] areaCode, short[] year, int pageNumber, int pageSize,
            string orderCountryName, string orderYear, string orderValue, string orderNotes)
        {
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                IQueryable<Currency> currencies = from s in db.Currencies
                                                  orderby s.CountryCode
                                                  select s;

                if (ArrayUtils.IsNullOrEmpty(pmiCoding) == false)
                    currencies = currencies.Where(t => pmiCoding.Contains(t.Countries.PmiCoding));

                if (ArrayUtils.IsNullOrEmpty(continentName) == false)
                    currencies = currencies.Where(t => continentName.Contains(t.Countries.ContinentName));

                if (ArrayUtils.IsNullOrEmpty(regionName) == false)
                    currencies = currencies.Where(t => regionName.Contains(t.Countries.RegionName));

                if (ArrayUtils.IsNullOrEmpty(countryName) == false)
                    currencies = currencies.Where(t => countryName.Contains(t.Countries.CountryName));

                if (ArrayUtils.IsNullOrEmpty(continentCode) == false)
                    currencies = currencies.Where(t => continentCode.Contains(t.Countries.ContinentCode));

                if (ArrayUtils.IsNullOrEmpty(regionCode) == false)
                    currencies = currencies.Where(t => regionCode.Contains(t.Countries.RegionCode));

                if (ArrayUtils.IsNullOrEmpty(countryCode) == false)
                    currencies = currencies.Where(t => countryCode.Contains(t.CountryCode));

                if (ArrayUtils.IsNullOrEmpty(areaCode) == false)
                    currencies = currencies.Where(t => areaCode.Contains(t.Countries.AreaCode));

                if (ArrayUtils.IsNullOrEmpty(year) == false)
                    currencies = currencies.Where(t => year.Contains(t.Year));

                if (orderCountryName == "desc")
                    currencies = currencies.OrderByDescending(x => x.Countries.CountryName);
                else if (orderCountryName == "asc")
                    currencies = currencies.OrderBy(x => x.Countries.CountryName);

                if (orderYear == "desc")
                    currencies = currencies.OrderByDescending(x => x.Year);
                else if (orderYear == "asc")
                    currencies = currencies.OrderBy(x => x.Year);

                if (orderValue == "desc")
                    currencies = currencies.OrderByDescending(x => x.Value);
                else if (orderValue == "asc")
                    currencies = currencies.OrderBy(x => x.Value);

                if (orderNotes == "desc")
                    currencies = currencies.OrderByDescending(x => x.Notes);
                else if (orderNotes == "asc")
                    currencies = currencies.OrderBy(x => x.Notes);

                return Json(Pagination.Pagination.PagedResult(currencies.Select(x => new { x.CountryCode, x.Countries.CountryName, x.Year, x.Value, x.Notes }), pageNumber, pageSize), JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Currency/Edit
        [HttpPost]
        [Authorize(Roles = "Admin, Writer")]
        [Log]
        public JsonResult Edit(short countryCode, short year, decimal? value, string note)
        {
            bool status = false;
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                Currency model = db.Currencies.Where(x => x.CountryCode == countryCode && x.Year == year).FirstOrDefault();

                if (model != null)
                {
                    if (!String.IsNullOrEmpty(note))
                        if (note == "null")
                            model.Notes = null;
                        else
                            model.Notes = note;
                    if (value.HasValue)
                        model.Value = value.Value;

                    if (value.HasValue || !String.IsNullOrEmpty(note))
                        status = true;

                    // solo se è stato modificato qualcosa salvo
                    if (status == true)
                    {
                        db.Entry(model).State = EntityState.Modified;

                        try
                        {
                            db.SaveChanges();
                        }
                        // catch dovuti alle annotazioni
                        catch (DbEntityValidationException e)
                        {
                            foreach (var error in e.EntityValidationErrors.SelectMany(entity => entity.ValidationErrors))
                            {
                                //error.PropertyName
                                return Json(new { success = false, error = error.ErrorMessage + "." }, JsonRequestBehavior.AllowGet);
                            }
                        }
                    } // if
                }
                else
                {
                    return Json(new { success = false, error = "Country not found." }, JsonRequestBehavior.AllowGet);
                }

                return Json(new { success = status }, JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Currency/Delete
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Log]
        public JsonResult Delete(short countryCode, short year)
        {
            bool status = false;
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                Currency currency = db.Currencies.Where(a => a.CountryCode == countryCode && a.Year == year).FirstOrDefault();
                if (currency != null)
                {
                    db.Currencies.Remove(currency);

                    db.SaveChanges();
                    status = true;
                }

                return Json(status, JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Currency/Create
        [HttpPost]
        [Authorize(Roles = "Admin, Writer")]
        [Log]
        public JsonResult Create(Currency currency)
        {
            bool status = false;
            if (ModelState.IsValid)
            {
                using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
                {
                    db.Currencies.Add(currency);

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
                            string[] error = { StaticName.CountryCode() + " isn't present." };
                            string[] keys = { "IdCountry" };
                            return Json(new { success = false, errors = keys.Select(x => new { key = x, errors = error }) }, JsonRequestBehavior.AllowGet);
                        }
                        else if (innerException != null && innerException.Number == 2627)
                        {
                            // PK
                            // IdCountry-Year
                            string[] error = { StaticName.Year() + " is already present." };
                            string[] keys = { "Year" };
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
        // POST: /Currency/GetFieldList
        [HttpPost]
        public JsonResult GetFieldList(string[] pmiCoding, string[] continentName, string[] regionName, string[] countryName, short[] continentCode, short[] regionCode, short[] countryCode, bool[] areaCode, short[] year)
        {
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.ProxyCreationEnabled = false;

                IQueryable<Currency> currencies = from s in db.Currencies
                                                select s;

                if (ArrayUtils.IsNullOrEmpty(pmiCoding) == false)
                    currencies = currencies.Where(t => pmiCoding.Contains(t.Countries.PmiCoding));

                if (ArrayUtils.IsNullOrEmpty(continentName) == false)
                    currencies = currencies.Where(t => continentName.Contains(t.Countries.ContinentName));

                if (ArrayUtils.IsNullOrEmpty(regionName) == false)
                    currencies = currencies.Where(t => regionName.Contains(t.Countries.RegionName));

                if (ArrayUtils.IsNullOrEmpty(countryName) == false)
                    currencies = currencies.Where(t => countryName.Contains(t.Countries.CountryName));

                if (ArrayUtils.IsNullOrEmpty(continentCode) == false)
                    currencies = currencies.Where(t => continentCode.Contains(t.Countries.ContinentCode));

                if (ArrayUtils.IsNullOrEmpty(regionCode) == false)
                    currencies = currencies.Where(t => regionCode.Contains(t.Countries.RegionCode));

                if (ArrayUtils.IsNullOrEmpty(countryCode) == false)
                    currencies = currencies.Where(t => countryCode.Contains(t.CountryCode));

                if (ArrayUtils.IsNullOrEmpty(areaCode) == false)
                    currencies = currencies.Where(t => areaCode.Contains(t.Countries.AreaCode));

                if (ArrayUtils.IsNullOrEmpty(year) == false)
                    currencies = currencies.Where(t => year.Contains(t.Year));

                return Json(currencies.Select(x => new { x.Year }).Distinct().OrderBy( x => x.Year).ToList(), JsonRequestBehavior.AllowGet);
            }
        }

    }
}
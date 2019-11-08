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
    public class CountryController : Controller
    {
        //
        // GET: /Country/Index
        [Log]
        public ActionResult Index()
        {
            return View();
        }

        //
        // POST: /Country/GetCountryList
        [HttpPost]
        public JsonResult GetCountryList(string[] pmiCoding, string[] continentName, string[] regionName, string[] countryName, short[] continentCode, short[] regionCode, short[] countryCode, bool[] areaCode, string orderCountryName, string orderContinentName, string orderRegionName, string orderPmi, string orderAreaCode)
        {
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                IQueryable<Country> countries = from s in db.Countries
                                             select s;

                if (ArrayUtils.IsNullOrEmpty(pmiCoding) == false)
                    countries = countries.Where(t => pmiCoding.Contains(t.PmiCoding));

                if (ArrayUtils.IsNullOrEmpty(continentName) == false)
                    countries = countries.Where(t => continentName.Contains(t.ContinentName));

                if (ArrayUtils.IsNullOrEmpty(regionName) == false)
                    countries = countries.Where(t => regionName.Contains(t.RegionName));

                if (ArrayUtils.IsNullOrEmpty(countryName) == false)
                    countries = countries.Where(t => countryName.Contains(t.CountryName));

                if (ArrayUtils.IsNullOrEmpty(continentCode) == false)
                    countries = countries.Where(t => continentCode.Contains(t.ContinentCode));

                if (ArrayUtils.IsNullOrEmpty(regionCode) == false)
                    countries = countries.Where(t => regionCode.Contains(t.RegionCode));

                if (ArrayUtils.IsNullOrEmpty(countryCode) == false)
                    countries = countries.Where(t => countryCode.Contains(t.CountryCode));

                if (ArrayUtils.IsNullOrEmpty(areaCode) == false)
                    countries = countries.Where(t => areaCode.Contains(t.AreaCode));

                if (orderCountryName == "desc")
                    countries = countries.OrderByDescending(x => x.CountryName);
                else if (orderCountryName == "asc")
                    countries = countries.OrderBy(x => x.CountryName);

                if (orderContinentName == "desc")
                    countries = countries.OrderByDescending(x => x.ContinentName);
                else if (orderContinentName == "asc")
                    countries = countries.OrderBy(x => x.ContinentName);

                if (orderRegionName == "desc")
                    countries = countries.OrderByDescending(x => x.RegionName);
                else if (orderRegionName == "asc")
                    countries = countries.OrderBy(x => x.RegionName);

                if (orderPmi == "desc")
                    countries = countries.OrderByDescending(x => x.PmiCoding);
                else if (orderPmi == "asc")
                    countries = countries.OrderBy(x => x.PmiCoding);

                if (orderAreaCode == "desc")
                    countries = countries.OrderByDescending(x => x.AreaCode);
                else if (orderAreaCode == "asc")
                    countries = countries.OrderBy(x => x.AreaCode);

                return Json(countries.Select(x => new { x.CountryCode, x.ContinentName, x.RegionName, x.PmiCoding, x.CountryName, x.AreaCode }).ToList(), JsonRequestBehavior.AllowGet);
            }
        }

        //
        // GET: /Country/GetListCountryName
        public JsonResult GetListCountryName()
        {
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                return Json(db.Countries.Select(x => new { x.CountryName, x.CountryCode }).ToList(), JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Country/Edit
        [HttpPost]
        [Authorize(Roles = "Admin, Writer")]
        [Log]
        public JsonResult Edit(short countryCode, string countryName, string regionName, string continentName, string pmiCoding, bool? areaCode)
        {
            bool status = false;
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                Country model = db.Countries.Where(x => x.CountryCode == countryCode).FirstOrDefault();

                if (model != null)
                {
                    if (!String.IsNullOrEmpty(countryName))
                        model.CountryName = countryName;
                    if (!String.IsNullOrEmpty(regionName))
                        model.RegionName = regionName;
                    if (!String.IsNullOrEmpty(continentName))
                        model.ContinentName = continentName;
                    if (!String.IsNullOrEmpty(pmiCoding))
                        model.PmiCoding = pmiCoding;
                    if (areaCode.HasValue)
                        model.AreaCode = areaCode.Value;

                    if (!String.IsNullOrEmpty(countryName) || !String.IsNullOrEmpty(regionName) || !String.IsNullOrEmpty(continentName) || !String.IsNullOrEmpty(pmiCoding) || areaCode.HasValue)
                        status = true;

                    // solo se è stato modificato qualcosa salvo
                    if (status == true)
                    {
                        db.Entry(model).State = EntityState.Modified;

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
                            if (innerException != null && innerException.Number == 2601)
                            {
                                // UNIQUE
                                return Json(new { success = false, error = StaticName.CountryName() + " is already present." }, JsonRequestBehavior.AllowGet);
                            }
                            else
                            {
                                throw;
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
        // POST: /Country/Delete
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Log]
        public JsonResult Delete(short countryCode)
        {
            bool status = false;
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;

                Country country = db.Countries.Where(a => a.CountryCode == countryCode).FirstOrDefault();
                if (country != null)
                {
                    db.Countries.Remove(country);

                    db.SaveChanges();
                    status = true;
                }

                return Json(status, JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Country/Create
        [HttpPost]
        [Authorize(Roles = "Admin, Writer")]
        [Log]
        public JsonResult Create(Country country)
        {
            bool status = false;
            if (ModelState.IsValid)
            {
                using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
                {
                    db.Countries.Add(country);

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
                        if (innerException != null && innerException.Number == 2601)
                        {
                            // UNIQUE
                            string[] error = { StaticName.CountryName() + " is already present." };
                            string[] keys = { "Name" };
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
        // POST: /Country/GetFieldList
        [HttpPost]
        public JsonResult GetFieldList(string[] pmiCoding, string[] continentName, string[] regionName, string[] countryName, short[] continentCode, short[] regionCode, short[] countryCode, bool[] areaCode)
        {
            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.ProxyCreationEnabled = false;

                IQueryable<Country> countries = from s in db.Countries
                                                select s;

                if (ArrayUtils.IsNullOrEmpty(pmiCoding) == false)
                    countries = countries.Where(t => pmiCoding.Contains(t.PmiCoding));

                if (ArrayUtils.IsNullOrEmpty(continentName) == false)
                    countries = countries.Where(t => continentName.Contains(t.ContinentName));

                if (ArrayUtils.IsNullOrEmpty(regionName) == false)
                    countries = countries.Where(t => regionName.Contains(t.RegionName));

                if (ArrayUtils.IsNullOrEmpty(countryName) == false)
                    countries = countries.Where(t => countryName.Contains(t.CountryName));

                if (ArrayUtils.IsNullOrEmpty(continentCode) == false)
                    countries = countries.Where(t => continentCode.Contains(t.ContinentCode));

                if (ArrayUtils.IsNullOrEmpty(regionCode) == false)
                    countries = countries.Where(t => regionCode.Contains(t.RegionCode));

                if (ArrayUtils.IsNullOrEmpty(countryCode) == false)
                    countries = countries.Where(t => countryCode.Contains(t.CountryCode));

                if (ArrayUtils.IsNullOrEmpty(areaCode) == false)
                    countries = countries.Where(t => areaCode.Contains(t.AreaCode));

                return Json(countries.Select(x => new { x.ContinentCode, x.RegionCode, x.CountryCode, x.ContinentName, x.RegionName, x.PmiCoding, x.CountryName, x.AreaCode }).ToList(), JsonRequestBehavior.AllowGet);
            }
        }

    }
}
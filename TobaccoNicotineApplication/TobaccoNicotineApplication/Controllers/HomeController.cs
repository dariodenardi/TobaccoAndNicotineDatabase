using Newtonsoft.Json;
using System;
using System.Collections.Generic;
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
    public class HomeController : Controller
    {
        //
        // GET: /Home/Index
        [Log]
        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /Home/About
        [Log]
        public ActionResult About()
        {
            return View();
        }

        //
        // GET: /Home/Contact
        [Log]
        public ActionResult Contact()
        {
            return View();
        }

        //
        // POST: /Home/GetInformation
        [HttpPost]
        public JsonResult GetInformation(string countryName)
        {
            bool stato = false;
            List<Value> valuesList = null;
            Dictionary<short, int> values = new Dictionary<short, int>();

            using (TobaccoNicotineDatabase db = new TobaccoNicotineDatabase())
            {
                db.Configuration.LazyLoadingEnabled = false;
                Country country = db.Countries.Where(a => a.Name == countryName).FirstOrDefault();
                if (country != null)
                {
                    // non considero la variabile 1
                    valuesList = db.Values.Where(x => x.CountryCode == country.Code && x.Number != 1).ToList();
                    stato = true;
                }
            }

            int totale = 0;
            int value = 0;
            foreach(var year in valuesList.GroupBy(x => x.Year))
            {
                // non considero la variabile 1
                value = year.Where(x => x.Data != null && x.Number != 1).Count();
                totale += value;
                values.Add(year.Key, value);
            }

            // converto dictionary in json
            string jsonValues = JsonConvert.SerializeObject(values);

            return Json(new { status = stato, total = totale, data = jsonValues }, JsonRequestBehavior.AllowGet);
        }
    }
}
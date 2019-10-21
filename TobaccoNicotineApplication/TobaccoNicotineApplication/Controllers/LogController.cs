using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TobaccoNicotineApplication.Models;

namespace TobaccoNicotineApplication.Controllers
{
    public class LogController : Controller
    {
        //
        // GET: /Log/Index
        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /Log/GetUserList
        public JsonResult GetLogList()
        {
            using (LogContext context = new LogContext())
            {
                // carico solo i log del giorno corrente per evitare consumo di banda inutile
                IQueryable<Log> logs = context.Log.Where(x => (x.TimeAccessed.Year == DateTime.Now.Year) && (x.TimeAccessed.Month == DateTime.Now.Month) && (x.TimeAccessed.Day == DateTime.Now.Day)).OrderByDescending(x => x.TimeAccessed);

                return Json(logs.ToList(), JsonRequestBehavior.AllowGet);
            }
        }
    }
}
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TobaccoNicotineApplication.Filters;
using TobaccoNicotineApplication.Models;

namespace TobaccoNicotineApplication.Controllers
{
    [Authorize(Roles = "Admin")]
    [NoCache]
    public class LogController : Controller
    {
        //
        // GET: /Log/Index
        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /Log/GetLogList
        public JsonResult GetLogList(int pageNumber, int pageSize)
        {
            using (LogContext context = new LogContext())
            {
                IQueryable<Log> logs = context.Log.OrderByDescending(x => x.TimeAccessed);

                return Json(Pagination.Pagination.PagedResult(logs, pageNumber, pageSize), JsonRequestBehavior.AllowGet);
            }
        }
    }
}
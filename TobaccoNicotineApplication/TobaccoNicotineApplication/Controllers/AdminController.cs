using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TobaccoNicotineApplication.Filters;
using TobaccoNicotineApplication.Models;
using TobaccoNicotineApplication.Utilities;

namespace TobaccoNicotineApplication.Controllers
{
    [Authorize(Roles = "Admin")]
    [NoCache]
    [ValidateAntiForgeryTokenOnAllPosts]
    public class AdminController : Controller
    {
        //
        // GET: /Admin/Grant
        [Log]
        public ActionResult Grant()
        {
            return View();
        }

        //
        // GET: /Admin/GetUserList
        public JsonResult GetUsersList()
        {
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                db.Configuration.LazyLoadingEnabled = false;

                // non posso modificarmi il privilegio
                IQueryable<ApplicationUser> users = db.Users.Where(x => x.UserName != User.Identity.Name);

                // non metto nella lista il mio username
                return Json(users.Where(x => x.UserName != "dariodenardi").Select(x => x.UserName).ToList(), JsonRequestBehavior.AllowGet);
            }
        }

        //
        // GET: /Admin/GetRolesList
        public JsonResult GetRolesList()
        {
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                db.Configuration.LazyLoadingEnabled = false;

                return Json(db.Roles.OrderBy(x => x.Id).Select(x => x.Name).ToList(), JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Admin/GetUserList
        [HttpPost]
        public JsonResult GetUserList(string order)
        {
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                db.Configuration.LazyLoadingEnabled = false;

                // non posso modificarmi il privilegio
                IQueryable<ApplicationUser> users = db.Users.Where(x => x.UserName != User.Identity.Name);

                if (order == "desc")
                    users = db.Users.OrderByDescending(x => x.UserName);
                else if (order == "asc")
                    users = db.Users.OrderBy(x => x.UserName);

                return Json(users.Select(x => x.UserName).ToList(), JsonRequestBehavior.AllowGet);
            }
        }

        //
        // GET: /Admin/GetRoleByUserName
        public JsonResult GetRoleByUserName(string UserName)
        {
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                ApplicationUser user = db.Users.Where(a => a.UserName == UserName).FirstOrDefault();
                string roleId = user.Roles.SingleOrDefault().RoleId;

                return Json(roleId, JsonRequestBehavior.AllowGet);
            }
        }

        //
        // POST: /Admin/Edit
        [HttpPost]
        [Log]
        public JsonResult Edit(string userName, string grant)
        {
            bool status = false;
            using (ApplicationDbContext db = new ApplicationDbContext())
            {
                ApplicationUser user = db.Users.Where(a => a.UserName == userName).FirstOrDefault();

                if (user != null)
                {
                    // aggiungo privilegio. Privilegio di default
                    string oldRoleId = user.Roles.SingleOrDefault().RoleId;
                    string oldRoleName = db.Roles.SingleOrDefault(r => r.Id == oldRoleId).Name;

                    if (oldRoleName != grant)
                    {
                        UserManager<ApplicationUser> UserManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(db));
                        UserManager.RemoveFromRole(user.Id, oldRoleName);
                        UserManager.AddToRole(user.Id, grant);

                        db.Entry(user).State = EntityState.Modified;

                        status = true;
                    }
                }

                return Json(status, JsonRequestBehavior.AllowGet);
            }
        }
    }
}
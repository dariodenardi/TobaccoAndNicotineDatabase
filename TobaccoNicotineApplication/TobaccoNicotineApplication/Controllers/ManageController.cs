using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using TobaccoNicotineApplication.Filters;
using TobaccoNicotineApplication.Models;

namespace TobaccoNicotineApplication.Controllers
{
    [Authorize]
    [NoCache]
    public class ManageController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

        public ManageController()
        {
        }

        public ManageController(ApplicationUserManager userManager, ApplicationSignInManager signInManager)
        {
            UserManager = userManager;
            SignInManager = signInManager;
        }

        public ApplicationSignInManager SignInManager
        {
            get
            {
                return _signInManager ?? HttpContext.GetOwinContext().Get<ApplicationSignInManager>();
            }
            private set 
            { 
                _signInManager = value; 
            }
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        //
        // GET: /Manage/Index
        public async Task<ActionResult> Index()
        {
            string userId = User.Identity.GetUserId();
            IndexViewModel model = new IndexViewModel
            {
                HasPhoto = HasPhoto(),
                BrowserRemembered = await AuthenticationManager.TwoFactorBrowserRememberedAsync(userId)
            };
            return View(model);
        }

        //
        // GET: /Manage/ChangePassword
        public ActionResult ChangePassword()
        {
            return View();
        }

        //
        // POST: /Manage/ChangePassword
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Log]
        public async Task<ActionResult> ChangePassword(ChangePasswordViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return View(model);
            }
            IdentityResult result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword, model.NewPassword);
            if (result.Succeeded)
            {
                ApplicationUser user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
                if (user != null)
                {
                    await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);

                    // messaggio temp
                    TempData["Message"] = "Password changed correctly!";
                }

                return RedirectToAction("Index");
            }
            AddErrors(result);
            return View(model);
        }

        //
        // GET: /Manage/ChangePhoto
        public ActionResult ChangePhoto()
        {
            return View();
        }

        //
        // POST: /Manage/ChangePhoto
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Log]
        public async Task<ActionResult> ChangePhoto(HttpPostedFileBase postedFile)
        {
            if (postedFile != null && !postedFile.FileName.EndsWith(".png"))
                ModelState.AddModelError("", "Select only PNG.");

            if (postedFile != null && postedFile.ContentLength > 4194304)
                ModelState.AddModelError("", "File must be less than 4 MB.");

            string filePath = "";
            if (ModelState.IsValid)
            {
                if (postedFile != null)
                {
                    string path = Server.MapPath("~/Uploads");

                    ApplicationUser user = await UserManager.FindByIdAsync(User.Identity.GetUserId());
                    if (user != null)
                    {
                        if (!Directory.Exists(path + "/Users/" + user.UserName))
                            Directory.CreateDirectory(path + "/Users/" + user.UserName);

                        if (System.IO.File.Exists(path + "/Users/" + user.UserName + "/" + Path.GetFileName(user.Photo)))
                            System.IO.File.Delete(path + "/Users/" + user.UserName + "/" + Path.GetFileName(user.Photo));
                    }

                    filePath = path + "/Users/" + user.UserName + "/" + Path.GetFileName(postedFile.FileName);

                    // carico file
                    postedFile.SaveAs(filePath);

                    // salvo solo il nome del file
                    user.Photo = Path.GetFileName(filePath);

                    // apply the changes if any to the db
                    UserManager.Update(user);

                    // messaggio temp
                    TempData["Message"] = "Profile picture edited.";
                } else
                    ModelState.AddModelError("", "Select a file please.");

                return RedirectToAction("Index");
            }

            return View();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && _userManager != null)
            {
                _userManager.Dispose();
                _userManager = null;
            }

            base.Dispose(disposing);
        }

#region Helper
        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.GetOwinContext().Authentication;
            }
        }

        private void AddErrors(IdentityResult result)
        {
            foreach (string error in result.Errors)
            {
                ModelState.AddModelError("", error);
            }
        }

        private bool HasPhoto()
        {
            ApplicationUser user = UserManager.FindById(User.Identity.GetUserId());
            if (user != null)
            {
                return user.Photo != null;
            }
            return false;
        }

#endregion
    }
}
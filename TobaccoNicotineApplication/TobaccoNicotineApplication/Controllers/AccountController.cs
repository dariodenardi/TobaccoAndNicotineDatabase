using System;
using System.Globalization;
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
    public class AccountController : Controller
    {
        private ApplicationSignInManager _signInManager;
        private ApplicationUserManager _userManager;

        public AccountController()
        {
        }

        public AccountController(ApplicationUserManager userManager, ApplicationSignInManager signInManager )
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
        // GET: /Account/Login
        // Per utenti non autenticati
        [AllowAnonymous]
        public ActionResult Login()
        {
            //Display only when user is not logged in
            if (!User.Identity.IsAuthenticated)
                return View();
            else
                return RedirectToAction("Index", "Home");
        }

        //
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        [Log]
        public async Task<ActionResult> Login(LoginViewModel model)
        {
            // Per abilitare il conteggio degli errori di password per attivare il blocco, impostare shouldLockout: true
            SignInStatus result = await SignInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, shouldLockout: true);

            switch (result)
            {
                case SignInStatus.Success:
                    // messaggio temp
                    TempData["Message"] = "Welcome!";
                    return RedirectToAction("Index", "Home");
                case SignInStatus.LockedOut:
                    bool ok = await this.SignInManager.CheckPasswordExpiredAsync(model.Email, model.Password);
                    if (ok == true)
                    {
                        ApplicationUser user = UserManager.FindByEmail(model.Email);
                        string resetCode = await this.UserManager.GeneratePasswordResetTokenAsync(user.Id);

                        return this.RedirectToAction("ResetPassword", "Account", new { userId = user.Id, code = resetCode });
                    }

                    return View("Lockout");
                //case SignInStatus.RequiresVerification:
                //return RedirectToAction("SendCode", new { ReturnUrl = returnUrl, RememberMe = model.RememberMe });
                case SignInStatus.Failure:
                default:
                    ModelState.AddModelError("", "Invalid email or password.");
                    return View(model);
            }
        }

        //
        // GET: /Account/Register
        [AllowAnonymous]
        public ActionResult Register()
        {
            //Display only when user is not logged in
            if (!User.Identity.IsAuthenticated)
                return View();
            else
                return RedirectToAction("Index", "Home");
        }

        //
        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        [Log]
        public async Task<ActionResult> Register(RegisterViewModel model)
        {
            ApplicationUser user = new ApplicationUser()
            {
                UserName = model.UserName,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Position = model.Position
            };

            IdentityResult result = await UserManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                // aggiungo privilegio. Privilegio di default
                await UserManager.AddToRoleAsync(user.Id, "Reader");

                // messaggio temp
                TempData["Message"] = "Congratulations! You are registered.";

                //await SignInManager.SignInAsync(user, isPersistent: false, rememberBrowser: false);

                // Per altre informazioni su come abilitare la conferma dell'account e la reimpostazione della password, vedere https://go.microsoft.com/fwlink/?LinkID=320771
                // Inviare un messaggio di posta elettronica con questo collegamento
                // string code = await UserManager.GenerateEmailConfirmationTokenAsync(user.Id);
                // var callbackUrl = Url.Action("ConfirmEmail", "Account", new { userId = user.Id, code = code }, protocol: Request.Url.Scheme);
                // await UserManager.SendEmailAsync(user.Id, "Conferma account", "Per confermare l'account, fare clic <a href=\"" + callbackUrl + "\">qui</a>");

                return RedirectToAction("Login", "Account");
            }
            else
                AddErrors(result);

            // Se si è arrivati a questo punto, significa che si è verificato un errore, rivisualizzare il form
            return View(model);
        }

        //
        // POST: /Account/LogOff
        [HttpPost]
        [ValidateAntiForgeryToken]
        [Log]
        public ActionResult LogOff()
        {
            AuthenticationManager.SignOut(DefaultAuthenticationTypes.ApplicationCookie);

            return RedirectToAction("Login", "Account");
        }

        //
        // GET: /Account/ResetPassword
        [AllowAnonymous]
        [Log]
        public ActionResult ResetPassword(string code)
        {
            return code == null ? View("Error") : View();
        }

        //
        // POST: /Account/ResetPassword
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        [Log]
        public async Task<ActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            ApplicationUser user = await UserManager.FindByIdAsync(model.Id);
            if (user == null)
            {
                // Non rivelare che l'utente non esiste
                return RedirectToAction("ResetPasswordConfirmation", "Account");
            }
            IdentityResult result = await UserManager.ResetPasswordAsync(user.Id, model.Code, model.Password);
            if (result.Succeeded)
            {
                return RedirectToAction("ResetPasswordConfirmation", "Account");
            }
            AddErrors(result);
            return View();
        }

        //
        // GET: /Account/ResetPasswordConfirmation
        [AllowAnonymous]
        [Log]
        public ActionResult ResetPasswordConfirmation()
        {
            return View();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_userManager != null)
                {
                    _userManager.Dispose();
                    _userManager = null;
                }

                if (_signInManager != null)
                {
                    _signInManager.Dispose();
                    _signInManager = null;
                }
            }

            base.Dispose(disposing);
        }

        #region Helper
        // Usato per la protezione XSRF durante l'aggiunta di account di accesso esterni
        private const string XsrfKey = "XsrfId";

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

        private ActionResult RedirectToLocal(string returnUrl)
        {
            if (Url.IsLocalUrl(returnUrl))
            {
                return Redirect(returnUrl);
            }
            return RedirectToAction("Index", "Home");
        }

        internal class ChallengeResult : HttpUnauthorizedResult
        {
            public ChallengeResult(string provider, string redirectUri)
                : this(provider, redirectUri, null)
            {
            }

            public ChallengeResult(string provider, string redirectUri, string userId)
            {
                LoginProvider = provider;
                RedirectUri = redirectUri;
                UserId = userId;
            }

            public string LoginProvider { get; set; }
            public string RedirectUri { get; set; }
            public string UserId { get; set; }

            public override void ExecuteResult(ControllerContext context)
            {
                AuthenticationProperties properties = new AuthenticationProperties { RedirectUri = RedirectUri };
                if (UserId != null)
                {
                    properties.Dictionary[XsrfKey] = UserId;
                }
                context.HttpContext.GetOwinContext().Authentication.Challenge(properties, LoginProvider);
            }
        }
        #endregion
    }
}
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.DataProtection;
using TobaccoNicotineApplication.Models;

namespace TobaccoNicotineApplication
{
    // scadenza della password
    // estendo l'interfaccia
    public static class IUserStoreExtensions
    {
        internal static async Task StorePasswordChangedAsync(this IUserStore<ApplicationUser, string> store, string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new ArgumentNullException("userId");

            ApplicationUser user = await store.FindByIdAsync(userId);

            if (user == null)
                return;

            user.PasswordChangeDateUtc = DateTime.UtcNow;

            await store.UpdateAsync(user);
        }
    }

    // Configurare la gestione utenti dell'applicazione utilizzata in questa applicazione. UserManager viene definito in ASP.NET Identity ed è utilizzato dall'applicazione.
    public class ApplicationUserManager : UserManager<ApplicationUser>
    {
        public ApplicationUserManager(IUserStore<ApplicationUser> store)
            : base(store)
        {
        }

        public static ApplicationUserManager Create(IdentityFactoryOptions<ApplicationUserManager> options, IOwinContext context)
        {
            ApplicationUserManager manager = new ApplicationUserManager(new UserStore<ApplicationUser>(context.Get<ApplicationDbContext>()));
            // Configurare la logica di convalida per i nomi utente
            manager.UserValidator = new UserValidator<ApplicationUser>(manager)
            {
                AllowOnlyAlphanumericUserNames = false,
                RequireUniqueEmail = true
            };

            // Configurare la logica di convalida per le password
            manager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 8,
                RequireNonLetterOrDigit = false,
                RequireDigit = true,
                RequireLowercase = true,
                RequireUppercase = true,
            };

            // Configurare le impostazioni predefinite per il blocco dell'utente
            manager.UserLockoutEnabledByDefault = true;
            manager.DefaultAccountLockoutTimeSpan = TimeSpan.FromMinutes(5);
            manager.MaxFailedAccessAttemptsBeforeLockout = 5;

            // Registrare i provider di autenticazione a due fattori. Questa applicazione usa il numero di telefono e gli indirizzi e-mail come metodi per ricevere un codice di verifica dell'utente
            // Si può scrivere un provider personalizzato e inserirlo qui.
            //manager.RegisterTwoFactorProvider("Codice telefono", new PhoneNumberTokenProvider<ApplicationUser>
            //{
            //    MessageFormat = "Il codice di sicurezza è {0}"
            //});
            //manager.RegisterTwoFactorProvider("Codice e-mail", new EmailTokenProvider<ApplicationUser>
            //{
            //    Subject = "Codice di sicurezza",
            //    BodyFormat = "Il codice di sicurezza è {0}"
            //});
            //manager.EmailService = new EmailService();
            //manager.SmsService = new SmsService();
            IDataProtectionProvider dataProtectionProvider = options.DataProtectionProvider;
            if (dataProtectionProvider != null)
            {
                manager.UserTokenProvider =
                    new DataProtectorTokenProvider<ApplicationUser>(dataProtectionProvider.Create("ASP.NET Identity"));
            }
            return manager;
        }

        // scadenza della password
        public override async Task<IdentityResult> CreateAsync(ApplicationUser user)
        {
            user.PasswordChangeDateUtc = DateTime.UtcNow;
            return await base.CreateAsync(user);
        }

        public override async Task<IdentityResult> ChangePasswordAsync(string userId, string currentPassword, string newPassword)
        {
            IdentityResult result = await base.ChangePasswordAsync(
              userId, currentPassword, newPassword);

            if (result.Succeeded)
            {
                await this.Store.StorePasswordChangedAsync(userId);
            }

            return result;
        }

        public override async Task<IdentityResult> ResetPasswordAsync(string userId, string token, string newPassword)
        {
            IdentityResult result = await base.ResetPasswordAsync(userId, token, newPassword);

            if (result.Succeeded)
            {
                await this.Store.StorePasswordChangedAsync(userId);
            }

            return result;
        }
    }

    // Configurare la gestione accessi usata in questa applicazione.
    public class ApplicationSignInManager : SignInManager<ApplicationUser, string>
    {
        public ApplicationSignInManager(ApplicationUserManager userManager, IAuthenticationManager authenticationManager)
            : base(userManager, authenticationManager)
        {
        }

        public override Task<ClaimsIdentity> CreateUserIdentityAsync(ApplicationUser user)
        {
            return user.GenerateUserIdentityAsync((ApplicationUserManager)UserManager);
        }

        public static ApplicationSignInManager Create(IdentityFactoryOptions<ApplicationSignInManager> options, IOwinContext context)
        {
            return new ApplicationSignInManager(context.GetUserManager<ApplicationUserManager>(), context.Authentication);
        }

        // scadenza della password
        public async Task<bool> CheckPasswordExpiredAsync(string email, string password)
        {
            ApplicationUser user = await this.UserManager.FindByEmailAsync(email);

            if (user == null)
                return false;

            if (!(await this.UserManager.CheckPasswordAsync(user, password)))
                return false;

            return (DateTime.UtcNow - user.PasswordChangeDateUtc).TotalDays > 180;
        }

        public async override Task<SignInStatus> PasswordSignInAsync(string email, string password, bool isPersistent, bool shouldLockout)
        {
            if (await this.CheckPasswordExpiredAsync(email, password))
            {
                return SignInStatus.LockedOut;
            }

            ApplicationUser user = UserManager.FindByEmail(email);

            if (user == null)
                return SignInStatus.Failure;

            return await base.PasswordSignInAsync(user.UserName, password, isPersistent, shouldLockout);
        }
    }
}

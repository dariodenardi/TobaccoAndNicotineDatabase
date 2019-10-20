using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace TobaccoNicotineApplication.Utilities
{
    [AttributeUsage(AttributeTargets.Class)]
    public class ValidateAntiForgeryTokenOnAllPosts : AuthorizeAttribute
    {
        /*
         * Nel caso di .NET MVC, Microsoft ha implementato un metodo di protezione di facile utilizzo contro CSRF. C'è un attributo nel framework MVC che puoi mettere sulle azioni del tuo controller: ValidateAntiForgeryToken. Funziona bene, ma presenta alcuni svantaggi:
         * Devi decorare manualmente tutte le tue azioni post con l'attributo.
         * È facle dimenticare di farlo, quindi è preferibile decorare l'intero controller con l'attributo (o meglio, un controller di base che l'intera applicazione utilizza). Sfortunatamente, questo non funziona con l'attributo ValidateAntiForgeryToken standard, poiché ciò causa anche la convalida di tutte le azioni GET (e verranno sempre esplodere, poiché il client non invia alcun dato del modulo con una richiesta GET).
         * Non funziona con i post Ajax.
         * L'attributo standard non funziona con ajax perché controlla la raccolta Request.Form quando cerca il campo token. Quando invii messaggi ajax questo modulo è sempre vuoto. Questo è il motivo per cui inizialmente ho iniziato a cercare implementazioni alternative della convalida del token anti-contraffazione.*/

        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            var request = filterContext.HttpContext.Request;

            //  Only validate POSTs
            if (request.HttpMethod == WebRequestMethods.Http.Post)
            {
                //  Ajax POSTs and normal form posts have to be treated differently when it comes
                //  to validating the AntiForgeryToken
                if (request.IsAjaxRequest())
                {
                    var antiForgeryCookie = request.Cookies[AntiForgeryConfig.CookieName];

                    var cookieValue = antiForgeryCookie != null
                        ? antiForgeryCookie.Value
                        : null;

                    AntiForgery.Validate(cookieValue, request.Headers["__RequestVerificationToken"]);
                }
                else
                {
                    new ValidateAntiForgeryTokenAttribute()
                        .OnAuthorization(filterContext);
                }
            }
        }
    }
}
using System;
using System.Collections.Generic;
using System.Web;
using System.Web.Mvc;
using TobaccoNicotineApplication.Models;

namespace TobaccoNicotineApplication.Filters
{
    public class LogAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            // Stores the Request in an Accessible object
            var request = filterContext.HttpContext.Request;
            // Generate an audit
            Log log = new Log()
            {
                // Creates our Timestamp/Identifier
                TimeAccessed = DateTime.Now,
                // Our Username (if available)
                UserName = (request.IsAuthenticated) ? filterContext.HttpContext.User.Identity.Name : "Anonymous",
                // The IP Address of the Request
                IPAddress = request.ServerVariables["HTTP_X_FORWARDED_FOR"] ?? request.UserHostAddress,
                // The URL that was accessed
                AreaAccessed = request.RawUrl,
            };

            // Stores Log in the Database
            using (LogContext context = new LogContext())
            {
                context.Log.Add(log);
                context.SaveChanges();
            }

            // Finishes executing the Action as normal 
            base.OnActionExecuting(filterContext);
        }
    }
}
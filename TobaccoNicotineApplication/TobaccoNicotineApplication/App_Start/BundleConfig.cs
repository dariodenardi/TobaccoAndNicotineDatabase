using System.Web;
using System.Web.Optimization;

namespace TobaccoNicotineApplication
{
    public class BundleConfig
    {
        // Per altre informazioni sulla creazione di bundle, vedere https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            // script
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            // Utilizzare la versione di sviluppo di Modernizr per eseguire attività di sviluppo e formazione. Successivamente, quando si è
            // pronti per passare alla produzione, usare lo strumento di compilazione disponibile all'indirizzo https://modernizr.com per selezionare solo i test necessari.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/detect").Include(
                        "~/Scripts/detect.js"));

            bundles.Add(new ScriptBundle("~/bundles/fastclick").Include(
                        "~/Scripts/fastclick.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryslim").Include(
                        "~/Scripts/jquery.slimscroll.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryblock").Include(
                        "~/Scripts/jquery.blockUI.js"));

            bundles.Add(new ScriptBundle("~/bundles/waves").Include(
                        "~/Scripts/waves.js"));

            bundles.Add(new ScriptBundle("~/bundles/wow").Include(
                        "~/Scripts/wow.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/jquerynice").Include(
                        "~/Scripts/jquery.nicescroll.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryscroll").Include(
                        "~/Scripts/jquery.scrollTo.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/app").Include(
                        "~/Scripts/app.js"));

            bundles.Add(new ScriptBundle("~/bundles/cookies").Include(
                        "~/Scripts/jquery.cookie.js",
                        "~/Scripts/cookies_eu.js"));

            // style
            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/font-awesome.css",
                      "~/Content/materialdesignicons.css",
                      "~/Content/ionicons.css",
                      "~/Content/style.css"));

            bundles.Add(new StyleBundle("~/Content/cookies").Include(
                      "~/Content/cookies_eu.css"));

            // you will need the line below so already minified files can be picked up by the bundler in debug mode.
            BundleTable.EnableOptimizations = true;
        }
    }
}

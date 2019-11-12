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
            bundles.Add(new ScriptBundle("~/Scripts/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/Scripts/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/Scripts/bootstrap").Include(
                      "~/Scripts/bootstrap.js"));

            // Utilizzare la versione di sviluppo di Modernizr per eseguire attività di sviluppo e formazione. Successivamente, quando si è
            // pronti per passare alla produzione, usare lo strumento di compilazione disponibile all'indirizzo https://modernizr.com per selezionare solo i test necessari.
            bundles.Add(new ScriptBundle("~/Scripts/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/Scripts/detect").Include(
                        "~/Scripts/detect.js"));

            bundles.Add(new ScriptBundle("~/Scripts/fastclick").Include(
                        "~/Scripts/fastclick.js"));

            bundles.Add(new ScriptBundle("~/Scripts/jqueryslim").Include(
                        "~/Scripts/jquery.slimscroll.js"));

            bundles.Add(new ScriptBundle("~/Scripts/jqueryblock").Include(
                        "~/Scripts/jquery.blockUI.js"));

            bundles.Add(new ScriptBundle("~/Scripts/waves").Include(
                        "~/Scripts/waves.js"));

            bundles.Add(new ScriptBundle("~/Scripts/wow").Include(
                        "~/Scripts/wow.min.js"));

            bundles.Add(new ScriptBundle("~/Scripts/jquerynice").Include(
                        "~/Scripts/jquery.nicescroll.js"));

            bundles.Add(new ScriptBundle("~/Scripts/jqueryscroll").Include(
                        "~/Scripts/jquery.scrollTo.min.js"));

            bundles.Add(new ScriptBundle("~/Scripts/app").Include(
                        "~/Scripts/app.js"));

            bundles.Add(new ScriptBundle("~/Scripts/cookies").Include(
                        "~/Scripts/jquery.cookie.js",
                        "~/Scripts/cookies_eu.js"));

            bundles.Add(new ScriptBundle("~/Scripts/pagination").Include(
                        "~/Scripts/pagination.js"));

            bundles.Add(new ScriptBundle("~/Scripts/colorpicker").Include(
                        "~/Scripts/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.min.js"));

            bundles.Add(new ScriptBundle("~/Scripts/maxlength").Include(
                        "~/Scripts/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js"));

            bundles.Add(new ScriptBundle("~/Scripts/sweetalert").Include(
                        "~/Scripts/plugins/bootstrap-sweetalert/sweet-alert.min.js"));

            bundles.Add(new ScriptBundle("~/Scripts/filestyle").Include(
                        "~/Scripts/plugins/bootstrap-filestyle/js/bootstrap-filestyle.min.js"));

            bundles.Add(new ScriptBundle("~/Scripts/datepicker").Include(
                        "~/Scripts/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js"));

            bundles.Add(new ScriptBundle("~/Scripts/dropzone").Include(
                        "~/Scripts/plugins/dropzone/dist/dropzone.js"));

            bundles.Add(new ScriptBundle("~/Scripts/parsley").Include(
                        "~/Scripts/plugins/parsleyjs/parsley.min.js",
                        "~/Scripts/plugins/parsleyjs/validation.js"));

            bundles.Add(new ScriptBundle("~/Scripts/jvectormap").Include(
                        "~/Scripts/plugins/jvectormap/jquery-jvectormap-2.0.2.min.js",
                        "~/Scripts/plugins/jvectormap/jquery-jvectormap-world-mill-en.js",
                        "~/Scripts/plugins/jvectormap/gdp-data.js",
                        "~/Scripts/plugins/jvectormap/jvectormap.init.js"));

            bundles.Add(new ScriptBundle("~/Scripts/admin").Include(
                        "~/Scripts/views/admin.js"));

            bundles.Add(new ScriptBundle("~/Scripts/log").Include(
                        "~/Scripts/views/log.js"));

            bundles.Add(new ScriptBundle("~/Scripts/contact").Include(
                        "~/Scripts/views/contact.js"));

            bundles.Add(new ScriptBundle("~/Scripts/excel").Include(
                        "~/Scripts/views/excel.js"));

            bundles.Add(new ScriptBundle("~/Scripts/variable").Include(
                        "~/Scripts/views/variable.js"));

            bundles.Add(new ScriptBundle("~/Scripts/value").Include(
                        "~/Scripts/views/value.js"));

            bundles.Add(new ScriptBundle("~/Scripts/source").Include(
                        "~/Scripts/views/source.js"));

            bundles.Add(new ScriptBundle("~/Scripts/currency").Include(
                        "~/Scripts/views/currency.js"));

            bundles.Add(new ScriptBundle("~/Scripts/country").Include(
                        "~/Scripts/views/country.js"));

            // style
            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/font-awesome.css",
                      "~/Content/materialdesignicons.css",
                      "~/Content/ionicons.css",
                      "~/Content/style.css"));

            bundles.Add(new StyleBundle("~/Content/cookies").Include(
                      "~/Content/cookies_eu.css"));

            bundles.Add(new StyleBundle("~/Content/colorpicker").Include(
                      "~/Scripts/plugins/bootstrap-colorpicker/css/bootstrap-colorpicker.min.css"));

            bundles.Add(new StyleBundle("~/Content/sweetalert").Include(
                      "~/Scripts/plugins/bootstrap-sweetalert/sweet-alert.css"));

            bundles.Add(new StyleBundle("~/Content/dropzone").Include(
                      "~/Scripts/plugins/dropzone/dist/dropzone.css"));

            bundles.Add(new StyleBundle("~/Content/datepicker").Include(
                      "~/Scripts/plugins/bootstrap-datepicker/css/bootstrap-datepicker.min.css"));

            bundles.Add(new StyleBundle("~/Content/jvectormap").Include(
                      "~/Scripts/plugins/jvectormap/jquery-jvectormap-2.0.2.css"));

            bundles.Add(new StyleBundle("~/Content/datatables").Include(
                      "~/Scripts/plugins/datatables/jquery.dataTables.min.css",
                      "~/Scripts/plugins/datatables/select.bootstrap.min.css",
                      "~/Scripts/plugins/datatables/dataTables.bootstrap.min.css"));

            // you will need the line below so already minified files can be picked up by the bundler in debug mode.
            BundleTable.EnableOptimizations = true;
        }
    }
}

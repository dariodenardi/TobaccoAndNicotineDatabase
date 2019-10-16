using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(TobaccoNicotineApplication.Startup))]
namespace TobaccoNicotineApplication
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}

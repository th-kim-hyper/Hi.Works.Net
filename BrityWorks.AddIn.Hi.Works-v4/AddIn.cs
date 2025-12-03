using BrityWorks.AddIn.Hi.Works.Activities;
using BrityWorks.AddIn.Hi.Works.Properties;
using RPAGO.AddIn;
using RPAGO.Common.Data;
using System.Collections.Generic;
using System.Drawing;

namespace BrityWorks.AddIn.HiWorks
{
    public class AddIn : ActivityAddInBase
    {
        protected override string AddInDisplayName => "AddInDisplayName".GetResource("Hi.Works v4.0");
        protected override Bitmap AddInIcon => Resources.hi_works;
        protected override Bitmap AddInOverIcon => Resources.hi_works_over;

        protected override List<IActivity> CreateActivites()
        {
            List<IActivity> activities = new List<IActivity>
            {
                new CaptchaChromeV4(),
            };

            return activities;
        }
    }
}

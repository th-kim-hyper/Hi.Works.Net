using BrityWorks.AddIn.HiWorks.Properties;
using BrityWorks.AddIn.HiWorks.Activities;
using RPAGO.AddIn;
using System.Collections.Generic;
using System.Drawing;

namespace BrityWorks.AddIn.HiWorks
{
    public class AddIn : ActivityAddInBase
    {
        protected override string AddInDisplayName => "AddInDisplayName".GetResource("HiWorks v4.0");
        protected override Bitmap AddInIcon => Resources.hi_works;
        protected override Bitmap AddInOverIcon => Resources.hi_works_over;

        private List<string> predefinedVariables = new List<string>();

        public override List<string> PredefinedVariables
        {
            get
            {
                return predefinedVariables;
            }
        }

        public AddIn()
        {
            predefinedVariables = base.PredefinedVariables;
            predefinedVariables = predefinedVariables ?? new List<string>();
            predefinedVariables.Add("LATEST_BROWSER");
        }

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

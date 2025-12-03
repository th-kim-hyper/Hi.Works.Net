using BrityWorks.AddIn.Hi.Works.Properties;
using RPAGO.AddIn;
using System.Drawing;

namespace BrityWorks.AddIn.Hi.Works.Activities
{
    public class ReceiveMailV30 : ReceiveMail, IActivityItem
    {
        public new string DisplayName => "DisplayName_ReceiveMailV30".GetResource("Hi. Receive Mail v3.0");
        //protected override string PresetRange => "PresetRange_ReceiveMailV30".GetResource("All;Today;This Week;This Month;This Year");
        public new Bitmap Icon => Resources.send_mail;
    }
}
